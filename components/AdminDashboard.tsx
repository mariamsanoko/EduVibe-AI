
import React, { useState, useRef } from 'react';
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
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;

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
      Style: 3D tech art, vibrant colors, clean composition, minimalist, 4k resolution. 
      No text on the image.`;

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

      // Find the image part in the response
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
    setEditingCourse(null);
    setIsAddingCourse(false);
    setPreviewImage(null);
  };

  const openCourseEditor = (course: Course | null) => {
    if (course) {
      setEditingCourse({ ...course });
      setPreviewImage(course.thumbnail);
    } else {
      setIsAddingCourse(true);
      setEditingCourse({ lessons: [] } as any);
      setPreviewImage(null);
    }
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
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logos */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center border-2 border-slate-950 shadow-lg" title="Gemini AI">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-slate-950 shadow-lg" title="Make.com">
                  <span className="text-white font-black text-xs">M</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-slate-950 shadow-lg" title="Whisk">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                </div>
              </div>
              <span className="h-4 w-px bg-slate-800"></span>
              <h1 className="text-3xl font-black tracking-tight text-white">Back Office <span className="text-indigo-500">EduVibe</span></h1>
            </div>
            <p className="text-slate-400 font-medium">Gestion du catalogue & automatisation IA avancée.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => openCourseEditor(null)}
              className="px-6 py-3 bg-white text-slate-950 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center gap-2 shadow-xl active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round"/></svg>
              Nouveau Cours
            </button>
            <button onClick={onClose} className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl font-bold hover:bg-slate-800 transition-all text-slate-300">
              Quitter
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900 p-6 rounded-[32px] border border-slate-800/50 shadow-sm">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Revenus</span>
            <p className="text-3xl font-black mt-1 text-white">12,450 €</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-[32px] border border-slate-800/50 shadow-sm">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Étudiants</span>
            <p className="text-3xl font-black mt-1 text-white">1,284</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-[32px] border border-slate-800/50 shadow-sm">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Ventes 24h</span>
            <p className="text-3xl font-black mt-1 text-emerald-400">+12</p>
          </div>
          <div className="bg-indigo-600 p-6 rounded-[32px] shadow-lg shadow-indigo-500/20 flex items-center justify-between">
            <div>
              <span className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">IA Status</span>
              <p className="text-white text-sm font-black mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse shadow-[0_0_8px_rgba(110,231,183,1)]"></span> Gemini 3 Pro
              </p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-slate-900 rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <h3 className="font-black text-lg text-white">Catalogue de Formations</h3>
            <div className="relative">
               <input type="text" placeholder="Rechercher..." className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 text-white" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-[10px] font-black uppercase tracking-tighter">
                  <th className="px-8 py-4">Formation</th>
                  <th className="px-8 py-4">Catégorie</th>
                  <th className="px-8 py-4">Prix</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {courses.map(course => (
                  <tr key={course.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={course.thumbnail} className="w-16 h-10 rounded-xl object-cover shadow-md border border-slate-800 group-hover:scale-105 transition-transform" />
                        <div>
                          <p className="font-black text-white">{course.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{course.instructor} • {course.lessons.length} leçons</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold border border-slate-700">{course.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      {course.isFree ? <span className="text-emerald-400 font-bold">Gratuit</span> : <span className="font-bold text-white">{course.price} €</span>}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openCourseEditor(course)}
                          className="w-10 h-10 flex items-center justify-center bg-slate-800 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2" strokeLinecap="round"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="w-10 h-10 flex items-center justify-center bg-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round"/></svg>
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

      {/* Course Editor Modal */}
      {(editingCourse || isAddingCourse) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => { setEditingCourse(null); setIsAddingCourse(false); setPreviewImage(null); }}></div>
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-[48px] p-10 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-white">{isAddingCourse ? 'Nouveau Cours' : 'Modifier la Formation'}</h2>
              <button onClick={() => { setEditingCourse(null); setIsAddingCourse(false); setPreviewImage(null); }} className="p-3 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round"/></svg>
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSaveCourse} className="space-y-8">
              {/* Image Upload Area with AI Generation */}
              <div>
                <div className="flex justify-between items-center mb-4">
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Image de couverture</label>
                   <button 
                    type="button" 
                    onClick={generateAIThumbnail}
                    disabled={isGeneratingImage}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${isGeneratingImage ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95'}`}
                   >
                     {isGeneratingImage ? (
                       <>
                         <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         Génération...
                       </>
                     ) : (
                       <>
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>
                         Générer avec l'IA
                       </>
                     )}
                   </button>
                </div>

                <div 
                  onClick={() => !isGeneratingImage && fileInputRef.current?.click()}
                  className={`relative group cursor-pointer w-full h-56 bg-slate-950 rounded-3xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all ${isGeneratingImage ? 'opacity-50' : 'hover:border-indigo-500/50'} ${previewImage ? 'border-transparent' : 'border-slate-800'}`}
                >
                  {previewImage ? (
                    <>
                      <img src={previewImage} className="w-full h-full object-cover transition-opacity group-hover:opacity-50" alt="Preview" />
                      {!isGeneratingImage && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="bg-white text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-xl">Changer l'image</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <p className="text-sm font-bold text-slate-500">Cliquez pour charger ou générez ci-dessus</p>
                    </div>
                  )}
                  {isGeneratingImage && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                       <div className="text-center">
                          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                          <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Création de votre chef-d'œuvre...</p>
                       </div>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Titre de la formation</label>
                  <input name="title" required defaultValue={editingCourse?.title} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" placeholder="Ex: Masterclass n8n" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Catégorie</label>
                  <input name="category" required defaultValue={editingCourse?.category} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" placeholder="Ex: Automatisation" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Prix (€)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingCourse?.price} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Description</label>
                <textarea name="description" rows={3} defaultValue={editingCourse?.description} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all leading-relaxed" placeholder="Détails du programme..." />
              </div>

              {/* Lessons Management Section */}
              <div className="pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between mb-6">
                   <div>
                     <h3 className="text-xl font-black text-white">Programme ({editingCourse?.lessons.length})</h3>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Gérez le contenu pédagogique</p>
                   </div>
                   <button 
                    type="button"
                    onClick={handleAddLesson}
                    className="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 rounded-xl text-xs font-black uppercase hover:bg-indigo-600 hover:text-white transition-all"
                   >
                     Ajouter une leçon
                   </button>
                </div>

                <div className="space-y-3">
                  {editingCourse?.lessons.length === 0 && (
                    <div className="text-center py-10 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-slate-600 text-sm font-bold">Aucune leçon pour le moment.</p>
                    </div>
                  )}
                  {editingCourse?.lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800 group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 font-black text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-indigo-400 uppercase">{lesson.type}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span className="text-[10px] font-bold text-slate-500">{lesson.duration}</span>
                            {lesson.isFreePreview && <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded ml-2">APERÇU</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          type="button" 
                          onClick={() => handleEditLesson(lesson, idx)}
                          className="w-8 h-8 flex items-center justify-center bg-slate-900 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2"/></svg>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteLesson(idx)}
                          className="w-8 h-8 flex items-center justify-center bg-slate-900 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <input type="checkbox" name="isFree" id="isFree" defaultChecked={editingCourse?.isFree} className="w-6 h-6 rounded-lg border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 transition-all" />
                <label htmlFor="isFree" className="text-sm font-black text-slate-300">Marquer comme formation gratuite</label>
              </div>

              <div className="pt-6 flex gap-4 sticky bottom-0 bg-slate-900 py-4">
                <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95">
                  {isAddingCourse ? 'Publier la formation' : 'Enregistrer le cours'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setEditingCourse(null); setIsAddingCourse(false); setPreviewImage(null); }}
                  className="px-10 py-5 bg-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-700 transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Editor Modal (Sub-modal) */}
      {editingLesson && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingLesson(null)}></div>
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-[32px] p-8 border border-slate-800 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-8">{editingLesson.index !== null ? 'Modifier la Leçon' : 'Ajouter une Leçon'}</h3>
            
            <form onSubmit={handleSaveLesson} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Titre de la leçon</label>
                  <input name="l-title" required defaultValue={editingLesson.lesson.title} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Type</label>
                  <select name="l-type" defaultValue={editingLesson.lesson.type} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none">
                    <option value="video">Vidéo</option>
                    <option value="text">Texte</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Durée (HH:MM)</label>
                  <input name="l-duration" placeholder="15:00" defaultValue={editingLesson.lesson.duration} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">URL Vidéo (Si type Vidéo)</label>
                <input name="l-videoUrl" defaultValue={editingLesson.lesson.videoUrl} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs" placeholder="https://youtube.com/embed/..." />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Contenu (Texte ou Instructions Quiz)</label>
                <textarea name="l-content" rows={4} defaultValue={editingLesson.lesson.content} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed" />
              </div>

              <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <input type="checkbox" name="l-isFreePreview" id="l-isFreePreview" defaultChecked={editingLesson.lesson.isFreePreview} className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 transition-all" />
                <label htmlFor="l-isFreePreview" className="text-sm font-bold text-slate-400">Accès gratuit pour cette leçon (Preview)</label>
              </div>

              <div className="pt-6 flex gap-3">
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-500/20">
                  Valider la Leçon
                </button>
                <button type="button" onClick={() => setEditingLesson(null)} className="px-6 py-4 bg-slate-800 text-slate-400 rounded-xl font-bold hover:text-white transition-all">
                  Annuler
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
