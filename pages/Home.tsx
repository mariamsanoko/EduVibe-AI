
import React, { useState } from 'react';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';

interface HomeProps {
  courses: Course[];
  onSelectCourse: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ courses, onSelectCourse }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filteredCourses = filter === 'All' 
    ? courses 
    : courses.filter(c => c.category === filter);

  return (
    <main className="pb-12">
      {/* Hero Section with Video/Visual */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-slate-900 mb-12">
        <div className="absolute top-0 left-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-300 text-sm font-bold mb-8 animate-pulse">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400"></span>
            NOUVELLE CATÉGORIE : AUTOMATISATION & AI STUDIO
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-tight">
            Maîtrisez l'Automatisation avec <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Make, n8n & Google AI</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Découvrez comment révolutionner votre flux de travail grâce au Vibe Coding et à l'intelligence artificielle de pointe.
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
            <a 
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
            >
              <svg className="w-6 h-6 text-red-600 fill-current" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              Voir la Démo YouTube
            </a>
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

        <section className="mt-24 p-12 bg-indigo-600 rounded-[40px] text-center text-white relative overflow-hidden shadow-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-600 opacity-50"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl font-black mb-6">Prêt à automatiser votre avenir ?</h2>
            <p className="text-indigo-100 text-lg mb-10">
              Rejoignez EduVibe AI et maîtrisez les outils qui feront de vous un ingénieur de demain, sans sacrifier votre temps.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="px-10 py-4 bg-white text-indigo-600 font-black rounded-2xl hover:shadow-2xl transition-all active:scale-95">
                S'inscrire Maintenant
              </button>
              <button className="px-10 py-4 bg-indigo-500/30 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-indigo-500/50 transition-all">
                Nous Contacter
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
