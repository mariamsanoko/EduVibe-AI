
import React, { useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';
import { User, Course, Review, Invoice } from '../types';

interface ProfileProps {
  onSelectCourse: (id: string) => void;
  user: User | null;
  courses: Course[];
  onAddReview: (courseId: string, review: Review) => void;
}

const Profile: React.FC<ProfileProps> = ({ onSelectCourse, user, courses, onAddReview }) => {
  const [activeTab, setActiveTab] = useState<'formations' | 'factures'>('formations');
  const [reviewingCourseId, setReviewingCourseId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const activityData = [
    { name: 'Lun', hours: 2.5 },
    { name: 'Mar', hours: 3.8 },
    { name: 'Mer', hours: 1.2 },
    { name: 'Jeu', hours: 4.5 },
    { name: 'Ven', hours: 2.8 },
    { name: 'Sam', hours: 5.2 },
    { name: 'Dim', hours: 1.5 },
  ];

  const avatarUrl = user ? `https://i.pravatar.cc/300?u=${user.id}` : "https://i.pravatar.cc/300?u=guest";
  const purchasedCourses = courses.filter(c => user?.purchasedCourses.includes(c.id));
  const invoices = user?.invoices || [];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reviewingCourseId) return;

    const newReview: Review = {
      id: 'r' + Date.now(),
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'pending'
    };

    onAddReview(reviewingCourseId, newReview);
    setReviewingCourseId(null);
    setRating(5);
    setComment('');
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Info */}
        <div className="w-full lg:w-1/3 space-y-8">
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/40 text-center">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-white shadow-2xl" />
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{user?.name}</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">{user?.email}</p>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">+33 {user?.phoneNumber}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-10">
              <div className="p-5 bg-slate-50 rounded-3xl">
                <span className="block text-3xl font-black text-indigo-600">{purchasedCourses.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cours</span>
              </div>
              <div className="p-5 bg-slate-50 rounded-3xl">
                <span className="block text-3xl font-black text-indigo-600">{invoices.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paiements</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl">
            <h3 className="text-xl font-black mb-8 tracking-tight">Activité Hebdomadaire</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ borderRadius: '16px', border: 'none', background: '#1e293b', fontSize: '12px', fontWeight: 'bold' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-10">
          <div className="flex bg-slate-100/50 p-2 rounded-[28px] w-fit border border-slate-200/50">
            <button 
              onClick={() => setActiveTab('formations')}
              className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'formations' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Mes Formations
            </button>
            <button 
              onClick={() => setActiveTab('factures')}
              className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'factures' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Ma Facturation
            </button>
          </div>

          {activeTab === 'formations' ? (
            <div className="grid grid-cols-1 gap-6">
              {purchasedCourses.length === 0 ? (
                <div className="p-20 text-center bg-white rounded-[48px] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Aucune formation active</p>
                </div>
              ) : (
                purchasedCourses.map(course => (
                  <div key={course.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col sm:flex-row gap-8 hover:shadow-2xl transition-all group">
                    <div className="w-full sm:w-56 h-36 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                      <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div>
                        <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">{course.title}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{course.instructor} • {course.category}</p>
                      </div>
                      <div className="flex items-center justify-between">
                         <button onClick={() => onSelectCourse(course.id)} className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all">Continuer le cours</button>
                         <button onClick={() => setReviewingCourseId(course.id)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Laisser un avis</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {invoices.length === 0 ? (
                <div className="p-20 text-center bg-white rounded-[48px] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Aucune facture disponible</p>
                </div>
              ) : (
                invoices.map(inv => (
                  <div key={inv.id} className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center justify-between hover:shadow-xl transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg leading-none mb-2">{inv.courseTitle}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inv.id}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{inv.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-2xl font-black text-slate-900 mb-2">{inv.amount} €</p>
                       <button className="text-[10px] font-black text-indigo-600 uppercase tracking-[2px] px-4 py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all flex items-center gap-2">
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="3"/></svg>
                         Télécharger PDF
                       </button>
                    </div>
                  </div>
                ))
              )}

              <div className="p-10 bg-indigo-600 rounded-[48px] text-white flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">Paiements Sécurisés</h3>
                  <p className="text-indigo-100 font-medium opacity-80">Toutes vos transactions sont cryptées et certifiées par Stripe.</p>
                </div>
                <div className="flex -space-x-4">
                   <div className="w-14 h-9 bg-white/20 rounded-lg backdrop-blur-md border border-white/30"></div>
                   <div className="w-14 h-9 bg-white/20 rounded-lg backdrop-blur-md border border-white/30"></div>
                   <div className="w-14 h-9 bg-white/20 rounded-lg backdrop-blur-md border border-white/30"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal code remains similar... */}
    </main>
  );
};

export default Profile;
