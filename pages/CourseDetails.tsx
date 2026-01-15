
import React from 'react';
import { Course, User, Lesson } from '../types';

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
  
  const approvedReviews = course.reviews?.filter(r => r.status === 'approved') || [];
  
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: approvedReviews.filter(r => r.rating === star).length,
    percent: approvedReviews.length > 0 
      ? (approvedReviews.filter(r => r.rating === star).length / approvedReviews.length) * 100 
      : 0
  }));

  const calculateTotalDuration = (lessons: Lesson[]) => {
    let totalMinutes = 0;
    lessons.forEach(l => {
      const parts = l.duration.split(':');
      if (parts.length === 2) {
        totalMinutes += parseInt(parts[0]) + (parseInt(parts[1]) / 60);
      }
    });
    const h = Math.floor(totalMinutes / 60);
    const m = Math.round(totalMinutes % 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Header */}
      <div className="relative h-[65vh] bg-slate-900 overflow-hidden">
        <img src={course.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[4px]" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-end pb-16">
          <div className="flex flex-col md:flex-row gap-12 items-end w-full">
            <div className="w-full md:w-80 aspect-video md:aspect-square bg-slate-800 rounded-[48px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] border-[12px] border-white shrink-0 animate-in slide-in-from-bottom-10 duration-700">
               <img src={course.thumbnail} className="w-full h-full object-cover" alt={course.title} />
            </div>
            <div className="flex-1 space-y-6 pb-4">
              <span className="px-5 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                {course.category}
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                {course.title}
              </h1>
              <div className="flex items-center gap-8 text-white/90 font-black text-xs uppercase tracking-widest">
                 <span className="flex items-center gap-2">
                   <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                   {course.rating} / 5
                 </span>
                 <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
                    {calculateTotalDuration(course.lessons)}
                 </span>
                 <span className="px-4 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">{course.level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          {/* ... Description & Programme ... */}
          <section>
            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">Présentation</h2>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">{course.description}</p>
          </section>

          <section>
            <h2 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter">Programme complet</h2>
            <div className="space-y-4">
              {course.lessons.map((lesson, idx) => (
                <div key={lesson.id} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:bg-indigo-50 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-[20px] bg-white flex items-center justify-center text-slate-400 font-black text-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-lg">{lesson.title}</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{lesson.type} • {lesson.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Ce qu'en disent les élèves</h2>
                <p className="text-slate-500 font-medium">Découvrez les retours de notre communauté d'experts.</p>
              </div>
              <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <div className="text-center">
                  <p className="text-5xl font-black text-slate-900 leading-none mb-2">{course.rating}</p>
                  <div className="flex text-amber-400 justify-center">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z"/></svg>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{approvedReviews.length} avis</p>
                </div>
                <div className="w-px h-16 bg-slate-200 hidden md:block"></div>
                <div className="space-y-1.5 min-w-[150px]">
                  {ratingCounts.map(r => (
                    <div key={r.star} className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 w-4">{r.star}</span>
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${r.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvedReviews.length === 0 ? (
                <p className="col-span-2 text-slate-400 text-center py-20 bg-slate-50 rounded-[48px] font-bold">Aucun avis publié pour le moment.</p>
              ) : (
                approvedReviews.map((rev) => (
                  <div key={rev.id} className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                       <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H13.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H8.017C7.46472 8 7.017 8.44772 7.017 9V12C7.017 12.5523 6.56929 13 6.017 13H5.017V21H6.017Z"/></svg>
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <img src={`https://i.pravatar.cc/150?u=${rev.userId}`} className="w-12 h-12 rounded-[18px] shadow-md" alt={rev.userName} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 tracking-tight">{rev.userName}</h4>
                          <span className="w-4 h-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                          </span>
                        </div>
                        <div className="flex text-amber-400 gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed italic relative z-10">"{rev.comment}"</p>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-6">Publié le {rev.date}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Pricing Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 p-12 bg-slate-950 rounded-[56px] shadow-2xl space-y-10 text-white animate-in zoom-in duration-500">
            <div className="text-center">
               <span className="text-indigo-400 font-black uppercase text-[10px] tracking-[4px]">Paiement Unique</span>
               <div className="mt-4 flex items-center justify-center gap-2">
                 {course.isFree ? (
                   <span className="text-6xl font-black text-emerald-400 uppercase tracking-tighter">Gratuit</span>
                 ) : (
                   <span className="text-6xl font-black text-white tracking-tighter">{course.price}€</span>
                 )}
               </div>
            </div>

            <div className="space-y-4">
               {isPurchased ? (
                 <button onClick={onStartLearning} className="w-full py-6 bg-indigo-600 text-white rounded-[24px] font-black text-xl hover:bg-indigo-500 transition-all shadow-2xl active:scale-95">Démarrer l'Apprentissage</button>
               ) : (
                 <button onClick={user ? onBuy : onLogin} className="w-full py-6 bg-white text-slate-950 rounded-[24px] font-black text-xl hover:bg-indigo-50 transition-all shadow-2xl active:scale-95">S'inscrire Maintenant</button>
               )}
            </div>

            <div className="pt-10 border-t border-white/10 space-y-5">
               <div className="flex items-center gap-4 text-white/70 font-bold text-sm">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg></div>
                  {calculateTotalDuration(course.lessons)} de formation
               </div>
               <div className="flex items-center gap-4 text-white/70 font-bold text-sm">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg></div>
                  Accès à vie illimité
               </div>
               <div className="flex items-center gap-4 text-white/70 font-bold text-sm">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1" strokeWidth="2.5"/></svg></div>
                  Tutorat IA inclus
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
