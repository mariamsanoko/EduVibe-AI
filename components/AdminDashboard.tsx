
import React, { useState, useRef, useEffect } from 'react';
import { Course, Lesson } from '../types';
import { GoogleGenAI } from "@google/genai";

interface AdminDashboardProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ courses, onUpdateCourses, onClose }) => {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [editingLesson, setEditingLesson] = useState<{ lesson: Partial<Lesson>; index: number | null } | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempCategory, setTempCategory] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
    const title = tempTitle;
    const category = tempCategory;

    if (!title || !category) {
      alert("Veuillez d'abord remplir le titre et la catégorie pour guider l'IA.");
      return;
    }

    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A professional, sleek and modern high-quality educational course thumbnail. 
      Topic: ${title}. 
      Category: ${category}. 
      Style: 3D minimalist tech art, vibrant gradients, high resolution, soft lighting. 
      Absolutely no text on the image.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setPreviewImage(`data:image/png;base64,${base64Data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Erreur lors de la génération de l'image:", error);
      alert("Impossible de générer l'image pour le moment.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSaveCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCourse && !isAddingCourse) return;

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

  const handleAddLesson = () => {
    setEditingLesson({ lesson: { type: 'video', isFreePreview: false }, index: null });
  };

  const handleEditLesson = (lesson: Lesson, index: number) => {
    setEditingLesson({ lesson: { ...lesson }, index });
  };

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
    if (editingLesson.index !== null) {
      newLessons[editingLesson.index] = lessonData;
    } else {
      newLessons.push(lessonData);
    }

    setEditingCourse({ ...editingCourse, lessons: newLessons });
    setEditingLesson(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with Enhanced Brand Logos */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <div className="flex items-center gap-6 mb-4">
              <div className="flex -space-x-3">
                {/* Gemini Logo */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#4285F4] via-[#9B72CB] to-[#D96570] flex items-center justify-center border-2 border-slate-950 shadow-xl" title="Google Gemini AI">
                   <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"/></svg>
                </div>
                {/* Make Logo */}
                <div className="w-11 h-11 rounded-full bg-[#EA3EF7] flex items-center justify-center border-2 border-slate-950 shadow-xl" title="Make.com Integration">
                  <span className="text-white font-black text-xs">M</span>
                </div>
                {/* Whisk/n8n Placeholder */}
                <div className="w-11 h-11 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-slate-950 shadow-xl" title="Automation Workflow">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
              </div>
              <span className="h-6 w-px bg-slate-800"></span>
              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">Back Office <span className="text-indigo-500">EduVibe</span></h1>
            </div>
            <p className="text-slate-400 font-medium ml-1">Pilotage IA & Gestion du catalogue multimédia.</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => openCourseEditor(null)}
              className="px-8 py-4 bg-white text-slate-950 rounded-[20px] font-black hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 group"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round"/></svg>
              Nouvelle Formation
            </button>
            <button onClick={onClose} className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-[20px] font-bold hover:bg-slate-800 transition-all text-slate-300">
              Quitter
            </button>
          </div>
        </div>

        {/* Stats Section with Pro Look */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {[
            { label: 'Revenus', val: '12,450 €', color: 'text-white' },
            { label: 'Étudiants', val: '1,284', color: 'text-white' },
            { label: 'Ventes 24h', val: '+12', color: 'text-emerald-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-sm p-7 rounded-[32px] border border-slate-800/50 shadow-inner group hover:border-slate-700 transition-colors">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
              <p className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-7 rounded-[32px] shadow-2xl shadow-indigo-600/20 flex items-center justify-between">
            <div>
              <span className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">Moteur IA Actif</span>
              <p className="text-white text-sm font-black mt-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping shadow-[0_0_10px_rgba(52,211,153,1)]"></span> Gemini 2.5 Image
              </p>
            </div>
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-[48px] border border-slate-800/80 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-1000">
          <div className="p-8 border-b border-slate-800 bg-slate-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-black text-xl text-white">Catalogue de Formations</h3>
            <div className="relative w-full sm:w-72">
               <input type="text" placeholder="Rechercher une formation..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-slate-600 transition-all" />
            </div>
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
                  <tr key={course.id} className="hover:bg-indigo-500/5 transition-colors group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="relative overflow-hidden w-20 h-12 rounded-xl border border-slate-800 group-hover:border-indigo-500/50 transition-colors">
                          <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div>
                          <p className="font-black text-white text-lg group-hover:text-indigo-400 transition-colors">{course.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">{course.instructor} • {course.lessons.length} modules</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <span className="px-4 py-1.5 bg-slate-800/60 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-700/50">{course.category}</span>
                    </td>
                    <td className="px-10 py-7">
                      {course.isFree ? <span className="text-emerald-400 font-black text-sm uppercase">Gratuit</span> : <span className="font-black text-white text-sm">{course.price} €</span>}
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => openCourseEditor(course)}
                          className="w-11 h-11 flex items-center justify-center bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-[14px] transition-all shadow-lg active:scale-90"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2.5" strokeLinecap="round"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="w-11 h-11 flex items-center justify-center bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-[14px] transition-all shadow-lg active:scale-90"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Main Course Editor Modal */}
      {(editingCourse || isAddingCourse) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={closeCourseEditor}></div>
          <div className="relative w-full max-w-5xl bg-slate-900 rounded-[56px] p-8 sm:p-12 border border-slate-800 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[95vh] custom-scrollbar animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-black text-white">{isAddingCourse ? 'Création de Formation' : 'Édition du Module'}</h2>
                <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-[4px]">Espace de Travail Collaboratif IA</p>
              </div>
              <button onClick={closeCourseEditor} className="p-4 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all hover:rotate-90 active:scale-90 shadow-xl border border-slate-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round"/></svg>
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSaveCourse} className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Image Section */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[2px]">Image de couverture</label>
                    <button 
                      type="button" 
                      onClick={generateAIThumbnail}
                      disabled={isGeneratingImage || !tempTitle}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all ${isGeneratingImage ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-30 disabled:grayscale'}`}
                    >
                      {isGeneratingImage ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>
                      )}
                      Générer par IA
                    </button>
                  </div>

                  <div 
                    onClick={() => !isGeneratingImage && fileInputRef.current?.click()}
                    className={`relative group cursor-pointer aspect-video w-full bg-slate-950 rounded-[32px] border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all ${isGeneratingImage ? 'opacity-50' : 'hover:border-indigo-500/50 hover:bg-slate-900/50'} ${previewImage ? 'border-transparent' : 'border-slate-800'}`}
                  >
                    {previewImage ? (
                      <>
                        <img src={previewImage} className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-40" alt="Preview" />
                        {!isGeneratingImage && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                             <div className="w-14 h-14 bg-white text-slate-950 rounded-full flex items-center justify-center shadow-2xl mb-3">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                             </div>
                             <span className="text-white text-xs font-black uppercase tracking-widest">Remplacer</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-8">
                        <div className="w-20 h-20 bg-slate-900 rounded-[28px] flex items-center justify-center mx-auto mb-6 text-slate-700 group-hover:text-indigo-500 transition-colors shadow-inner">
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <p className="text-sm font-black text-slate-500 group-hover:text-indigo-300">Importer ou générer une vignette</p>
                        <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-tighter">Recommandé : 1920x1080px</p>
                      </div>
                    )}

                    {isGeneratingImage && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center">
                         <div className="text-center">
                            <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-5 shadow-2xl"></div>
                            <p className="text-xs font-black text-white uppercase tracking-[4px] animate-pulse">Vision IA en cours...</p>
                         </div>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

                  {/* Proactive IA Prompt for New Courses */}
                  {isAddingCourse && !previewImage && !isGeneratingImage && tempTitle && (
                    <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-[28px] animate-in zoom-in duration-300">
                       <div className="flex gap-4 items-start">
                          <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                          </div>
                          <div>
                            <p className="text-white text-xs font-black uppercase tracking-tight mb-1">Suggestion IA</p>
                            <p className="text-indigo-200 text-[11px] leading-relaxed mb-4">Je peux générer une vignette artistique pour "<strong>{tempTitle}</strong>" en un clic.</p>
                            <button 
                              type="button" 
                              onClick={generateAIThumbnail}
                              className="px-5 py-2 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-600/30"
                            >
                              Générer maintenant
                            </button>
                          </div>
                       </div>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">Titre de la formation</label>
                      <input 
                        name="title" required 
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-black text-lg placeholder:text-slate-800" 
                        placeholder="Ex: Masterclass Automatisation n8n" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">Catégorie</label>
                      <input 
                        name="category" required 
                        value={tempCategory}
                        onChange={(e) => setTempCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold placeholder:text-slate-800" 
                        placeholder="Ex: IA Coding" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">Prix de vente (€)</label>
                      <input name="price" type="number" step="0.01" defaultValue={editingCourse?.price} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-black text-lg placeholder:text-slate-800" placeholder="0.00" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">Description du programme</label>
                    <textarea name="description" rows={4} defaultValue={editingCourse?.description} className="w-full bg-slate-950 border border-slate-800 rounded-[28px] px-6 py-5 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all leading-relaxed placeholder:text-slate-800" placeholder="Décrivez les objectifs pédagogiques et les compétences acquises..." />
                  </div>
                </div>
              </div>

              {/* Lessons Management Section with Improved UI */}
              <div className="pt-12 border-t border-slate-800/60">
                <div className="flex items-center justify-between mb-8">
                   <div>
                     <h3 className="text-2xl font-black text-white">Structure du Programme</h3>
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-[3px] mt-2">Modules pédagogiques ({editingCourse?.lessons.length || 0})</p>
                   </div>
                   <button 
                    type="button"
                    onClick={handleAddLesson}
                    className="px-6 py-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-2xl text-[11px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-95"
                   >
                     + Nouveau Module
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(editingCourse?.lessons.length === 0) ? (
                    <div className="col-span-2 text-center py-16 bg-slate-950/40 rounded-[40px] border-2 border-dashed border-slate-800/60">
                      <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-700">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round"/></svg>
                      </div>
                      <p className="text-slate-500 text-sm font-bold">Aucun contenu pédagogique défini pour le moment.</p>
                      <button type="button" onClick={handleAddLesson} className="mt-4 text-indigo-400 font-black text-xs uppercase hover:text-indigo-300">Ajouter la première leçon</button>
                    </div>
                  ) : (
                    editingCourse?.lessons.map((lesson, idx) => (
                      <div key={lesson.id} className="flex items-center justify-between p-6 bg-slate-950/80 rounded-[32px] border border-slate-800/60 group hover:border-indigo-500/30 transition-all hover:translate-y-[-2px] hover:shadow-2xl shadow-indigo-500/5">
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 font-black text-sm group-hover:text-indigo-400 transition-colors">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white line-clamp-1">{lesson.title}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-md">{lesson.type}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                              <span className="text-[9px] font-black text-slate-500 uppercase">{lesson.duration}</span>
                              {lesson.isFreePreview && <span className="text-[8px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md ml-1 tracking-tighter">PREVIEW</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => handleEditLesson(lesson, idx)}
                            className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-md active:scale-90"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5"/></svg>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteLesson(idx)}
                            className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-md active:scale-90"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5"/></svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 bg-slate-950/40 p-7 rounded-[32px] border border-slate-800/60">
                <div className="relative inline-block w-14 h-8">
                   <input type="checkbox" name="isFree" id="isFree" defaultChecked={editingCourse?.isFree} className="sr-only peer" />
                   <label htmlFor="isFree" className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-800 rounded-full transition-all peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-1 after:left-1 after:w-6 after:h-6 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-6 shadow-inner"></label>
                </div>
                <div>
                  <label htmlFor="isFree" className="text-sm font-black text-white cursor-pointer uppercase tracking-tight">Formation en accès libre</label>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">Si activé, les utilisateurs n'auront pas à payer pour accéder aux leçons.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-10 flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-slate-900/80 backdrop-blur-lg py-8 mt-12 border-t border-slate-800">
                <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/40 active:scale-95 flex items-center justify-center gap-3 group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  {isAddingCourse ? 'Publier la formation' : 'Enregistrer les modifications'}
                </button>
                <button 
                  type="button" 
                  onClick={closeCourseEditor}
                  className="px-12 py-5 bg-slate-800 text-slate-300 rounded-[24px] font-black hover:bg-slate-700 transition-all active:scale-95"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Editor Modal (Sub-modal) - Same White Text Polish */}
      {editingLesson && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditingLesson(null)}></div>
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-[48px] p-10 border border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-black text-white mb-10">{editingLesson.index !== null ? 'Configuration du Module' : 'Nouveau Contenu'}</h3>
            
            <form onSubmit={handleSaveLesson} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">Titre de la leçon</label>
                  <input name="l-title" required defaultValue={editingLesson.lesson.title} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-black text-lg" placeholder="Entrez le titre du module..." />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">Type de support</label>
                  <div className="relative">
                    <select name="l-type" defaultValue={editingLesson.lesson.type} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-black appearance-none cursor-pointer">
                      <option value="video">🎥 Vidéo Masterclass</option>
                      <option value="text">📄 Guide Interactif</option>
                      <option value="quiz">🧠 Quiz d'Évaluation</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3"/></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">Durée estimée</label>
                  <input name="l-duration" placeholder="Ex: 15:30" defaultValue={editingLesson.lesson.duration} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-black" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">URL Média (Embed / YouTube)</label>
                <input name="l-videoUrl" defaultValue={editingLesson.lesson.videoUrl} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm placeholder:text-slate-800" placeholder="https://www.youtube.com/embed/..." />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-[2px]">Contenu Pédagogique (Markdown supporté)</label>
                <textarea name="l-content" rows={5} defaultValue={editingLesson.lesson.content} className="w-full bg-slate-950 border border-slate-800 rounded-[24px] px-6 py-5 text-white outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed placeholder:text-slate-800" placeholder="Rédigez le contenu textuel ou les instructions..." />
              </div>

              <div className="flex items-center gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/60">
                <input type="checkbox" name="l-isFreePreview" id="l-isFreePreview" defaultChecked={editingLesson.lesson.isFreePreview} className="w-6 h-6 rounded-lg border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" />
                <label htmlFor="l-isFreePreview" className="text-sm font-black text-slate-300 cursor-pointer uppercase tracking-tight">Autoriser l'aperçu gratuit</label>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/30 active:scale-95">
                  Valider le Module
                </button>
                <button type="button" onClick={() => setEditingLesson(null)} className="px-10 py-5 bg-slate-800 text-slate-400 rounded-[24px] font-black hover:text-white transition-all active:scale-95">
                  Fermer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
