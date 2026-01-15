
import React, { useState, useRef, useEffect } from 'react';
import { Course, Lesson, SiteSettings, Review } from '../types';
import { GoogleGenAI } from "@google/genai";

interface AdminDashboardProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
  siteSettings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ courses, onUpdateCourses, siteSettings, onUpdateSettings, onClose }) => {
  const [activeTab, setActiveTab] = useState<'formations' | 'site' | 'moderation'>('formations');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const [formState, setFormState] = useState({
    title: '',
    category: '',
    price: 0,
    description: '',
    isFree: false,
    level: 'Débutant' as 'Débutant' | 'Intermédiaire' | 'Avancé',
    lessons: [] as Lesson[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save draft
  useEffect(() => {
    if (isAddingCourse || editingCourse) {
      const draft = { formState, previewImage, editingId: editingCourse?.id };
      localStorage.setItem('admin_draft_course', JSON.stringify(draft));
    }
  }, [formState, previewImage, isAddingCourse, editingCourse]);

  const handleOpenEditor = (course: Course | null) => {
    if (course) {
      setEditingCourse(course);
      setIsAddingCourse(false);
      setFormState({
        title: course.title,
        category: course.category,
        price: course.price || 0,
        description: course.description,
        isFree: course.isFree,
        level: course.level,
        lessons: course.lessons
      });
      setPreviewImage(course.thumbnail);
    } else {
      setEditingCourse(null);
      setIsAddingCourse(true);
      setFormState({ title: '', category: '', price: 0, description: '', isFree: false, level: 'Débutant', lessons: [] });
      setPreviewImage(null);
    }
  };

  const handleSave = (status: 'draft' | 'published') => {
    if (!formState.title || !formState.category) return alert("Champs requis manquants.");

    const updatedCourse: Course = {
      id: editingCourse?.id || 'c' + Date.now(),
      title: formState.title,
      category: formState.category,
      description: formState.description,
      thumbnail: previewImage || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
      instructor: editingCourse?.instructor || 'Admin Master',
      level: formState.level,
      lessons: formState.lessons,
      rating: editingCourse?.rating || 5.0,
      studentsCount: editingCourse?.studentsCount || 0,
      isFree: formState.isFree,
      price: formState.price,
      reviews: editingCourse?.reviews || [],
      status: status
    };

    const newCourses = editingCourse 
      ? courses.map(c => c.id === editingCourse.id ? updatedCourse : c)
      : [...courses, updatedCourse];

    onUpdateCourses(newCourses);
    setEditingCourse(null);
    setIsAddingCourse(false);
    localStorage.removeItem('admin_draft_course');
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer définitivement ?")) {
      onUpdateCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleModerateReview = (courseId: string, reviewId: string, approved: boolean) => {
    const updatedCourses = courses.map(c => {
      if (c.id === courseId) {
        const updatedReviews = c.reviews.map(r => 
          r.id === reviewId ? { ...r, status: approved ? 'approved' : 'rejected' } as Review : r
        );
        
        // Recalculate rating
        const approvedRev = updatedReviews.filter(r => r.status === 'approved');
        const avgRating = approvedRev.length > 0 
          ? Number((approvedRev.reduce((acc, r) => acc + r.rating, 0) / approvedRev.length).toFixed(1))
          : 5.0;

        return { ...c, reviews: updatedReviews, rating: avgRating };
      }
      return c;
    });
    onUpdateCourses(updatedCourses);
  };

  const generateAIThumbnail = async () => {
    if (!formState.title) return alert("Entrez un titre.");
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `Professional educational thumbnail: ${formState.title}. Digital art style, vibrant.` }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      const base64 = response.candidates[0].content.parts.find(p => p.inlineData)?.inlineData?.data;
      if (base64) setPreviewImage(`data:image/png;base64,${base64}`);
    } catch (e) { alert("Erreur génération."); }
    finally { setIsGeneratingImage(false); }
  };

  const pendingReviews = courses.flatMap(c => 
    (c.reviews || []).filter(r => r.status === 'pending').map(r => ({ ...r, courseTitle: c.title, courseId: c.id }))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">EduVibe <span className="text-indigo-500">CMS</span></h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[4px]">Espace de gestion administrateur</p>
          </div>
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button onClick={() => setActiveTab('formations')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'formations' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Catalogue</button>
            <button onClick={() => setActiveTab('moderation')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'moderation' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              Modération
              {pendingReviews.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-black animate-pulse">{pendingReviews.length}</span>}
            </button>
            <button onClick={() => setActiveTab('site')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'site' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Design Site</button>
          </div>
          <div className="flex gap-4">
             <button onClick={() => handleOpenEditor(null)} className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">Nouveau Cours</button>
             <button onClick={onClose} className="px-8 py-4 bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white transition-all">Sortir</button>
          </div>
        </header>

        {activeTab === 'formations' && (
          <div className="bg-slate-900/50 rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-[9px] font-black uppercase tracking-widest border-b border-slate-800/50">
                  <th className="px-10 py-6">Formation</th>
                  <th className="px-10 py-6">Statut</th>
                  <th className="px-10 py-6">Prix</th>
                  <th className="px-10 py-6">Élèves</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {courses.map(course => (
                  <tr key={course.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <img src={course.thumbnail} className="w-20 h-12 rounded-lg object-cover border border-slate-800" />
                        <div>
                          <p className="font-black text-white text-base leading-tight">{course.title}</p>
                          <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{course.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${course.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                         {course.status === 'published' ? 'En Ligne' : 'Brouillon'}
                       </span>
                    </td>
                    <td className="px-10 py-6 font-black">{course.isFree ? 'Gratuit' : `${course.price}€`}</td>
                    <td className="px-10 py-6 text-slate-500 font-bold">{course.studentsCount}</td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleOpenEditor(course)} className="p-3 bg-slate-800 hover:bg-indigo-600 rounded-xl transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2.5"/></svg></button>
                         <button onClick={() => handleDelete(course.id)} className="p-3 bg-slate-800 hover:bg-rose-600 rounded-xl transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5"/></svg></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black px-4">Avis en attente de validation</h2>
            <div className="grid grid-cols-1 gap-4">
              {pendingReviews.map(rev => (
                <div key={rev.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-8 animate-in slide-in-from-bottom-5 duration-300 shadow-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20">{rev.courseTitle}</span>
                      <span className="text-slate-500 text-[10px] font-bold uppercase">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                       <img src={`https://i.pravatar.cc/100?u=${rev.userId}`} className="w-10 h-10 rounded-full border border-slate-800 shadow-lg" />
                       <div>
                         <p className="font-black text-white text-lg">{rev.userName}</p>
                         <div className="flex text-amber-400 gap-0.5">
                           {Array.from({ length: 5 }).map((_, i) => (
                             <svg key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-slate-800'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                           ))}
                         </div>
                       </div>
                    </div>
                    <p className="text-slate-400 font-medium italic leading-relaxed border-l-2 border-slate-800 pl-4 py-1">"{rev.comment}"</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleModerateReview(rev.courseId, rev.id, true)} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">Approuver</button>
                    <button onClick={() => handleModerateReview(rev.courseId, rev.id, false)} className="px-8 py-4 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">Rejeter</button>
                  </div>
                </div>
              ))}
              {pendingReviews.length === 0 && (
                <div className="py-20 text-center bg-slate-900/40 rounded-[48px] border-2 border-dashed border-slate-800/50">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Tout est en ordre ! Aucun avis en attente.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* site tab remains as previously defined but optimized for global site settings */}
        {activeTab === 'site' && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-12 rounded-[48px] shadow-2xl">
            <h2 className="text-2xl font-black mb-10 text-center">Identité Visuelle</h2>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              onUpdateSettings({
                heroTitle: fd.get('ht') as string,
                heroSubtitle: fd.get('hs') as string,
                heroImage: fd.get('hi') as string,
                footerText: fd.get('ft') as string
              });
              alert("Styles enregistrés !");
            }} className="space-y-8">
              <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Titre Héro</label><input name="ht" defaultValue={siteSettings.heroTitle} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-black text-white" /></div>
              <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Sous-titre Héro</label><textarea name="hs" rows={3} defaultValue={siteSettings.heroSubtitle} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-300" /></div>
              <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Image Héro (URL)</label><input name="hi" defaultValue={siteSettings.heroImage} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-mono text-sm text-indigo-400" /></div>
              <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Texte Pied de page</label><input name="ft" defaultValue={siteSettings.footerText} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-white" /></div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-[3px] shadow-xl hover:bg-indigo-500 active:scale-95 transition-all">Sauvegarder l'univers visuel</button>
            </form>
          </div>
        )}

        {/* Editor Modal */}
        {(isAddingCourse || editingCourse) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="relative w-full max-w-5xl bg-slate-900 rounded-[56px] border border-slate-800 p-12 overflow-y-auto max-h-[90vh] shadow-[0_0_100px_rgba(79,70,229,0.2)]">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter mb-2">{isAddingCourse ? 'Nouveau Programme' : 'Édition Expert'}</h2>
                  <p className="text-indigo-400 font-bold uppercase text-[9px] tracking-[4px]">Auto-sauvegarde locale activée</p>
                </div>
                <button onClick={() => { setEditingCourse(null); setIsAddingCourse(false); localStorage.removeItem('admin_draft_course'); }} className="p-4 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="relative aspect-video w-full bg-slate-950 rounded-[32px] border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden cursor-pointer group hover:border-indigo-500 transition-all" onClick={() => fileInputRef.current?.click()}>
                    {previewImage ? <img src={previewImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="text-center text-slate-600"><p className="text-xs font-black uppercase tracking-widest mb-2">Image de couverture</p><p className="text-[10px] font-bold">Cliquer pour choisir</p></div>}
                    {isGeneratingImage && <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center"><div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) { const r = new FileReader(); r.onloadend = () => setPreviewImage(r.result as string); r.readAsDataURL(f); }
                  }} />
                  <button onClick={generateAIThumbnail} disabled={isGeneratingImage} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-white/10 transition-all">🪄 Générer avec Gemini AI</button>
                  
                  <div className="p-8 bg-slate-950 rounded-[32px] border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                      <label className="font-bold text-slate-400">Formation Gratuite</label>
                      <button onClick={() => setFormState({...formState, isFree: !formState.isFree})} className={`w-12 h-6 rounded-full transition-all relative ${formState.isFree ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formState.isFree ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                    {!formState.isFree && (
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-2">Prix de vente (€)</label>
                        <input type="number" value={formState.price} onChange={e => setFormState({...formState, price: parseFloat(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 font-black text-2xl text-white outline-none focus:ring-2 focus:ring-indigo-600" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                   <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Titre de la Masterclass</label><input value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-black text-lg" /></div>
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Catégorie</label><input value={formState.category} onChange={e => setFormState({...formState, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none font-bold" /></div>
                     <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Niveau</label><select value={formState.level} onChange={e => setFormState({...formState, level: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none font-bold appearance-none"><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option></select></div>
                   </div>
                   <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Description Longue</label><textarea value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} rows={6} className="w-full bg-slate-950 border border-slate-800 rounded-[32px] px-8 py-6 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-300 leading-relaxed" /></div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row gap-4">
                <button onClick={() => handleSave('published')} className="flex-1 py-6 bg-indigo-600 text-white rounded-[24px] font-black text-xl hover:bg-indigo-500 shadow-2xl shadow-indigo-600/20 transition-all active:scale-95">Publier Immédiatement</button>
                <button onClick={() => handleSave('draft')} className="flex-1 py-6 bg-slate-800 text-white rounded-[24px] font-black text-xl hover:bg-slate-700 transition-all active:scale-95">Garder en Brouillon</button>
                <button onClick={() => { setEditingCourse(null); setIsAddingCourse(false); }} className="px-10 py-6 text-slate-500 font-black uppercase tracking-widest hover:text-white transition-all">Annuler</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
