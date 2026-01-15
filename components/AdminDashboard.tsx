
import React, { useState, useRef, useEffect } from 'react';
import { Course, Lesson, SiteSettings } from '../types';
import { GoogleGenAI } from "@google/genai";

interface AdminDashboardProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
  siteSettings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ courses, onUpdateCourses, siteSettings, onUpdateSettings, onClose }) => {
  const [activeTab, setActiveTab] = useState<'formations' | 'site'>('formations');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [editingLesson, setEditingLesson] = useState<{ lesson: Partial<Lesson>; index: number | null } | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempCategory, setTempCategory] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleUpdateSite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated: SiteSettings = {
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      heroImage: formData.get('heroImage') as string,
      footerText: formData.get('footerText') as string,
    };
    onUpdateSettings(updated);
    alert('Configuration du site mise à jour !');
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce cours ?')) {
      onUpdateCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIThumbnail = async () => {
    if (!tempTitle || !tempCategory) {
      alert("Veuillez d'abord remplir le titre et la catégorie pour guider l'IA.");
      return;
    }
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A professional, sleek and modern high-quality educational course thumbnail. Topic: ${tempTitle}. Category: ${tempCategory}. Style: 3D minimalist tech art, vibrant gradients, high resolution, soft lighting. Absolutely no text on the image.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setPreviewImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      alert("Erreur génération IA");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSaveCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const courseData: Partial<Course> = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      price: parseFloat(formData.get('price') as string) || 0,
      description: formData.get('description') as string,
      isFree: formData.get('isFree') === 'on',
      thumbnail: previewImage || editingCourse?.thumbnail || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
      lessons: editingCourse?.lessons || []
    };

    if (editingCourse) {
      onUpdateCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...courseData } as Course : c));
    } else {
      const newCourse: Course = {
        id: 'c' + Date.now(),
        title: courseData.title!,
        description: courseData.description!,
        category: courseData.category!,
        price: courseData.price,
        isFree: courseData.isFree!,
        thumbnail: courseData.thumbnail!,
        instructor: 'Admin',
        level: 'Débutant',
        rating: 5.0,
        studentsCount: 0,
        lessons: courseData.lessons || []
      };
      onUpdateCourses([...courses, newCourse]);
    }
    closeCourseEditor();
  };

  const openCourseEditor = (course: Course | null) => {
    if (course) {
      setEditingCourse({ ...course });
      setPreviewImage(course.thumbnail);
      setTempTitle(course.title);
      setTempCategory(course.category);
    } else {
      setIsAddingCourse(true);
      setEditingCourse({ lessons: [] } as any);
      setPreviewImage(null);
      setTempTitle('');
      setTempCategory('');
    }
  };

  const closeCourseEditor = () => {
    setEditingCourse(null);
    setIsAddingCourse(false);
    setPreviewImage(null);
    setTempTitle('');
    setTempCategory('');
  };

  const handleAddLesson = () => setEditingLesson({ lesson: { type: 'video', isFreePreview: false }, index: null });
  const handleEditLesson = (lesson: Lesson, index: number) => setEditingLesson({ lesson: { ...lesson }, index });
  const handleDeleteLesson = (index: number) => {
    if (editingCourse) {
      const newLessons = [...editingCourse.lessons];
      newLessons.splice(index, 1);
      setEditingCourse({ ...editingCourse, lessons: newLessons });
    }
  };

  const handleSaveLesson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingLesson || !editingCourse) return;
    const formData = new FormData(e.currentTarget);
    const lessonData: Lesson = {
      id: (editingLesson.lesson.id as string) || 'l' + Date.now(),
      title: formData.get('l-title') as string,
      type: formData.get('l-type') as any,
      duration: formData.get('l-duration') as string,
      content: formData.get('l-content') as string,
      videoUrl: formData.get('l-videoUrl') as string,
      isFreePreview: formData.get('l-isFreePreview') === 'on',
    };
    const newLessons = [...editingCourse.lessons];
    if (editingLesson.index !== null) newLessons[editingLesson.index] = lessonData;
    else newLessons.push(lessonData);
    setEditingCourse({ ...editingCourse, lessons: newLessons });
    setEditingLesson(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div>
            <div className="flex items-center gap-6 mb-4">
              <div className="flex -space-x-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#4285F4] via-[#9B72CB] to-[#D96570] flex items-center justify-center border-2 border-slate-950 shadow-xl">
                   <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"/></svg>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#EA3EF7] flex items-center justify-center border-2 border-slate-950 shadow-xl">
                  <span className="text-white font-black text-xs">M</span>
                </div>
                <div className="w-11 h-11 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-slate-950 shadow-xl">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
              </div>
              <span className="h-6 w-px bg-slate-800"></span>
              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">Back Office <span className="text-indigo-500">EduVibe</span></h1>
            </div>
            <div className="flex bg-slate-900 p-1 rounded-xl w-fit">
              <button 
                onClick={() => setActiveTab('formations')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'formations' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                Formations
              </button>
              <button 
                onClick={() => setActiveTab('site')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'site' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                Pages du Site
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => openCourseEditor(null)} className="px-8 py-4 bg-white text-slate-950 rounded-[20px] font-black hover:bg-indigo-50 transition-all flex items-center gap-2">
              Nouvelle Formation
            </button>
            <button onClick={onClose} className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-[20px] font-bold text-slate-300">
              Quitter
            </button>
          </div>
        </div>

        {activeTab === 'formations' ? (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-[48px] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
              <h3 className="font-black text-xl text-white uppercase tracking-widest">Gestion du Catalogue</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-950/40 text-slate-500 text-[11px] font-black uppercase tracking-widest border-b border-slate-800/50">
                    <th className="px-10 py-5">Formation</th>
                    <th className="px-10 py-5">Catégorie</th>
                    <th className="px-10 py-5">Prix</th>
                    <th className="px-10 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {courses.map(course => (
                    <tr key={course.id} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-5">
                          <img src={course.thumbnail} className="w-20 h-12 rounded-xl object-cover border border-slate-800" />
                          <div>
                            <p className="font-black text-white text-lg">{course.title}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{course.instructor} • {course.lessons.length} leçons</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <span className="px-4 py-1.5 bg-slate-800/60 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-700/50">{course.category}</span>
                      </td>
                      <td className="px-10 py-7">
                        {course.isFree ? <span className="text-emerald-400 font-black">Gratuit</span> : <span className="font-black text-white">{course.price} €</span>}
                      </td>
                      <td className="px-10 py-7 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openCourseEditor(course)} className="w-11 h-11 flex items-center justify-center bg-slate-800 hover:bg-indigo-600 rounded-[14px] transition-all"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2" strokeLinecap="round"/></svg></button>
                          <button onClick={() => handleDeleteCourse(course.id)} className="w-11 h-11 flex items-center justify-center bg-slate-800 hover:bg-rose-600 rounded-[14px] transition-all"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round"/></svg></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-[48px] border border-slate-800 p-12 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-widest">Édition des Pages</h3>
            <form onSubmit={handleUpdateSite} className="space-y-8 max-w-4xl">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">Titre Principal (Hero)</label>
                <input name="heroTitle" required defaultValue={siteSettings.heroTitle} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-black text-lg" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">Sous-titre (Hero)</label>
                <textarea name="heroSubtitle" required defaultValue={siteSettings.heroSubtitle} rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">URL Image de Fond (Hero)</label>
                <input name="heroImage" required defaultValue={siteSettings.heroImage} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">Texte de bas de page (Footer)</label>
                <input name="footerText" required defaultValue={siteSettings.footerText} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
              </div>
              <button type="submit" className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                Sauvegarder les Changements
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Editor Modal for Courses */}
      {(editingCourse || isAddingCourse) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
          <div className="relative w-full max-w-5xl bg-slate-900 rounded-[56px] p-8 sm:p-12 border border-slate-800 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-black text-white">{isAddingCourse ? 'Nouveau Cours' : 'Modifier Cours'}</h2>
              <button onClick={closeCourseEditor} className="p-4 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg></button>
            </div>
            <form ref={formRef} onSubmit={handleSaveCourse} className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[2px]">Thumbnail</label>
                    <button type="button" onClick={generateAIThumbnail} disabled={isGeneratingImage || !tempTitle} className="bg-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Générer IA</button>
                  </div>
                  <div onClick={() => fileInputRef.current?.click()} className={`relative aspect-video w-full bg-slate-950 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer ${previewImage ? 'border-transparent' : 'border-slate-800'}`}>
                    {previewImage ? <img src={previewImage} className="w-full h-full object-cover" /> : <p className="text-slate-500 font-bold">Importer image</p>}
                    {isGeneratingImage && <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center animate-pulse"><p className="text-xs font-black uppercase">Génération...</p></div>}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="lg:col-span-7 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase mb-3">Titre</label>
                      <input name="title" required value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none font-black" />
                    </div>
                    <div><label className="text-[11px] font-black text-slate-500 uppercase mb-3">Catégorie</label><input name="category" required value={tempCategory} onChange={(e) => setTempCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none font-bold" /></div>
                    <div><label className="text-[11px] font-black text-slate-500 uppercase mb-3">Prix (€)</label><input name="price" type="number" step="0.01" defaultValue={editingCourse?.price} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none font-black" /></div>
                  </div>
                  <textarea name="description" rows={3} defaultValue={editingCourse?.description} className="w-full bg-slate-950 border border-slate-800 rounded-[28px] px-6 py-5 text-white outline-none" placeholder="Description..." />
                </div>
              </div>
              <div className="pt-12 border-t border-slate-800">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-white uppercase tracking-widest">Leçons ({editingCourse?.lessons.length || 0})</h3>
                  <button type="button" onClick={handleAddLesson} className="px-6 py-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-2xl text-[11px] font-black uppercase">+ Nouveau Module</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editingCourse?.lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="flex justify-between items-center p-6 bg-slate-950 rounded-[32px] border border-slate-800">
                      <div>
                        <p className="font-black text-white text-sm">{lesson.title}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">{lesson.type} • {lesson.duration}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleEditLesson(lesson, idx)} className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl"><svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5"/></svg></button>
                        <button type="button" onClick={() => handleDeleteLesson(idx)} className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl"><svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5"/></svg></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6 bg-slate-950/40 p-7 rounded-[32px] border border-slate-800">
                <input type="checkbox" name="isFree" id="isFree" defaultChecked={editingCourse?.isFree} className="w-6 h-6 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0" />
                <label htmlFor="isFree" className="text-sm font-black uppercase text-white">Formation gratuite</label>
              </div>
              <div className="pt-10 flex gap-4 sticky bottom-0 bg-slate-900/80 py-8 mt-12 border-t border-slate-800">
                <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl active:scale-95">Publier / Sauvegarder</button>
                <button type="button" onClick={closeCourseEditor} className="px-12 py-5 bg-slate-800 text-slate-300 rounded-[24px] font-black hover:bg-slate-700 transition-all">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Sub-modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-[48px] p-10 border border-slate-800 animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-black text-white mb-10">Configuration du Module</h3>
            <form onSubmit={handleSaveLesson} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2"><label className="text-[11px] font-black text-slate-500 uppercase mb-3">Titre de la leçon</label><input name="l-title" required defaultValue={editingLesson.lesson.title} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none font-black text-lg" /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase mb-3">Type</label><select name="l-type" defaultValue={editingLesson.lesson.type} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none font-black appearance-none"><option value="video">Vidéo</option><option value="text">Texte</option><option value="quiz">Quiz</option></select></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase mb-3">Durée</label><input name="l-duration" placeholder="15:00" defaultValue={editingLesson.lesson.duration} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none font-black" /></div>
              </div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase mb-3">URL Vidéo</label><input name="l-videoUrl" defaultValue={editingLesson.lesson.videoUrl} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none font-mono text-sm" /></div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase mb-3">Contenu</label><textarea name="l-content" rows={4} defaultValue={editingLesson.lesson.content} className="w-full bg-slate-950 border border-slate-800 rounded-[24px] px-6 py-5 text-white outline-none text-sm leading-relaxed" /></div>
              <div className="flex items-center gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800"><input type="checkbox" name="l-isFreePreview" defaultChecked={editingLesson.lesson.isFreePreview} className="w-6 h-6 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0" /><label className="text-sm font-black uppercase text-slate-300">Preview gratuit</label></div>
              <div className="pt-6 flex gap-4"><button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl active:scale-95">Valider</button><button type="button" onClick={() => setEditingLesson(null)} className="px-10 py-5 bg-slate-800 text-slate-400 rounded-[24px] font-black hover:text-white transition-all">Fermer</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
