
import React from 'react';
import { Course, User } from '../types';

interface CourseDetailsProps {
  course: Course;
  user: User | null;
  onStartLearning: () => void;
  onBuy: () => void;
  onLogin: () => void;
  onBack: () => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course, user, onStartLearning, onBuy, onLogin, onBack }) => {
  const isPurchased = user?.purchasedCourses.includes(course.id) || course.isFree;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] bg-slate-900 overflow-hidden">
        <img src={course.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-10 items-end w-full">
            <div className="w-full md:w-80 aspect-video md:aspect-square bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-white shrink-0">
               <img src={course.thumbnail} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4">
              <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full">
                {course.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg leading-tight">
                {course.title}
              </h1>
              <div className="flex items-center gap-6 text-white/80 font-bold text-sm">
                 <span className="flex items-center gap-2">
                   <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                   {course.rating} / 5.0
                 </span>
                 <span>{course.studentsCount.toLocaleString()} Étudiants</span>
                 <span className="px-3 py-1 bg-white/20 rounded-lg">{course.level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-6">À propos de ce cours</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              {course.description}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-8">Programme de la formation</h2>
            <div className="space-y-4">
              {course.lessons.map((lesson, idx) => (
                <div key={lesson.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 font-black text-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{lesson.title}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase mt-1">{lesson.type} • {lesson.duration}</p>
                    </div>
                  </div>
                  {lesson.isFreePreview && !isPurchased && (
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-tighter">Aperçu Offert</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-900 rounded-[40px] p-10 text-white flex flex-col md:flex-row gap-10 items-center">
             <div className="shrink-0">
                <img src={`https://i.pravatar.cc/150?u=${course.instructor}`} className="w-32 h-32 rounded-[32px] border-4 border-indigo-500 shadow-2xl" />
             </div>
             <div>
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[3px]">Expert Formateur</span>
                <h3 className="text-3xl font-black mt-2 mb-4">{course.instructor}</h3>
                <p className="text-slate-400 leading-relaxed">David est ingénieur en automatisation avec plus de 10 ans d'expérience. Il a aidé des centaines d'entreprises à optimiser leurs processus grâce aux outils No-Code.</p>
             </div>
          </section>
        </div>

        {/* Pricing Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 p-10 bg-white border border-slate-100 rounded-[40px] shadow-2xl space-y-8">
            <div className="text-center">
               <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Prix de lancement</span>
               <div className="mt-4 flex items-center justify-center gap-2">
                 {course.isFree ? (
                   <span className="text-5xl font-black text-emerald-500 uppercase">Gratuit</span>
                 ) : (
                   <span className="text-5xl font-black text-slate-900">{course.price}€</span>
                 )}
               </div>
            </div>

            <div className="space-y-4">
               {isPurchased ? (
                 <button 
                  onClick={onStartLearning}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                 >
                   Reprendre le cours
                 </button>
               ) : (
                 <>
                  <button 
                    onClick={user ? onBuy : onLogin}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                  >
                    S'inscrire Maintenant
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase">Garantie satisfait ou remboursé 30j</p>
                 </>
               )}
            </div>

            <div className="pt-8 border-t border-slate-50 space-y-4">
               <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {course.lessons.length} modules de formation
               </div>
               <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Accès à vie illimité
               </div>
               <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Support par Tutor IA 24/7
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
