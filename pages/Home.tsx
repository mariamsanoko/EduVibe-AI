
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
  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filteredCourses = filter === 'All' 
    ? courses 
    : courses.filter(c => c.category === filter);

  return (
    <main className="pb-12">
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-slate-900 mb-12">
        <div className="absolute top-0 left-0 w-full h-full">
          <img 
            src={siteSettings.heroImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-300 text-sm font-bold mb-8 animate-pulse">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400"></span>
            NOUVEAUTÉS : AUTOMATISATION & AI MASTERCLASS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-tight">
            {siteSettings.heroTitle}
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {siteSettings.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                const target = document.getElementById('catalog');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95"
            >
              Explorer les formations
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95">
              Voir la Démo
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6" id="catalog">
        <section className="mb-16">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Catalogue de Formations</h2>
              <p className="text-slate-500">Apprenez avec les meilleurs experts en IA et Productivité.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    filter === cat 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onSelect={onSelectCourse} 
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
