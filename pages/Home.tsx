
import React, { useState } from 'react';
import { Course, SiteSettings } from '../types';
import CourseCard from '../components/CourseCard';

interface HomeProps {
  courses: Course[];
  onSelectCourse: (id: string) => void;
  siteSettings: SiteSettings;
}

const Home: React.FC<HomeProps> = ({ courses, onSelectCourse, siteSettings }) => {
  const [filter, setFilter] = useState('All');
  
  // Only show published courses on home page
  const publishedCourses = courses.filter(c => c.status === 'published');
  
  const categories = ['All', ...new Set(publishedCourses.map(c => c.category))];

  const filteredCourses = filter === 'All' 
    ? publishedCourses 
    : publishedCourses.filter(c => c.category === filter);

  const stats = [
    { label: "Étudiants actifs", val: "25k+", icon: "👨‍💻" },
    { label: "Formateurs experts", val: "120", icon: "🏆" },
    { label: "Taux de réussite", val: "94%", icon: "⚡" },
    { label: "Notes moyennes", val: "4.9/5", icon: "⭐" }
  ];

  return (
    <main className="pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden bg-slate-950 mb-24">
        <div className="absolute top-0 left-0 w-full h-full">
          <img 
            src={siteSettings.heroImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[3px] mb-10 shadow-2xl">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
            Intelligence Artificielle & Automatisation
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-[0.85] filter drop-shadow-2xl">
            {siteSettings.heroTitle}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
            {siteSettings.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => {
                const target = document.getElementById('catalog');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-12 py-6 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-500 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:scale-105 active:scale-95 text-lg"
            >
              Explorer le catalogue
            </button>
            <button className="w-full sm:w-auto px-12 py-6 bg-white/5 backdrop-blur-md text-white font-black rounded-3xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95 text-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Voir la Démo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-36 relative z-20 mb-32">
        <div className="bg-white rounded-[48px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">{stat.icon}</div>
              <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{stat.val}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6" id="catalog">
        <section className="mb-32">
          <div className="flex items-center justify-between flex-wrap gap-8 mb-16">
            <div className="max-w-xl">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[4px] mb-4 block">Notre sélection</span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">Parcourez les Masterclasses</h2>
              <p className="text-lg text-slate-500 font-medium">Programmes intensifs créés par des experts.</p>
            </div>
            
            <div className="flex flex-wrap gap-2 bg-slate-100 p-2 rounded-[24px]">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    filter === cat 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} onSelect={onSelectCourse} />
            ))}
          </div>
          {filteredCourses.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-bold">Aucun cours disponible.</p>
            </div>
          )}
        </section>

        <section className="bg-indigo-600 rounded-[64px] p-12 md:p-24 text-white relative overflow-hidden">
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[0.9]">Apprenez avec un Tuteur IA <span className="text-indigo-200">24/7</span></h2>
                <p className="text-xl text-indigo-100 mb-10 leading-relaxed font-medium">Gemini 3 Pro vous accompagne dans chaque leçon. Posez vos questions et recevez des réponses instantanées.</p>
              </div>
              <div className="relative">
                 <div className="bg-white/10 backdrop-blur-2xl rounded-[40px] p-8 border border-white/20 shadow-2xl transform rotate-2">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full animate-pulse"></div>
                      <div className="h-4 w-32 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-3 w-full bg-white/10 rounded-full"></div>
                      <div className="h-3 w-4/5 bg-white/10 rounded-full"></div>
                      <div className="h-3 w-2/3 bg-white/10 rounded-full"></div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
