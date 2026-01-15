
import React, { useState } from 'react';
import { COURSES } from '../data/courses';
import CourseCard from '../components/CourseCard';

interface HomeProps {
  onSelectCourse: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSelectCourse }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(COURSES.map(c => c.category))];

  const filteredCourses = filter === 'All' 
    ? COURSES 
    : COURSES.filter(c => c.category === filter);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <section className="mb-16">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-6">
            Unlock your potential with <span className="text-indigo-600">AI-powered</span> learning.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-10">
            Learn faster, smarter, and with personalized support from our advanced AI tutors. 
            Choose from hundreds of courses curated by industry experts.
          </p>
          
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                  filter === cat 
                    ? 'bg-indigo-600 text-white shadow-indigo-200' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Available Courses</h2>
          <span className="text-sm font-medium text-slate-400">{filteredCourses.length} courses found</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onSelect={onSelectCourse} 
            />
          ))}
        </div>
      </section>

      <section className="mt-24 p-12 bg-slate-900 rounded-[32px] text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[120%] bg-indigo-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-40%] right-[-10%] w-[50%] h-[100%] bg-purple-500 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Start your journey today</h2>
          <p className="text-slate-400 mb-8">Join over 50,000 learners achieving their goals with EduVibe AI. 7-day free trial on all premium features.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/20 active:scale-95">
              Explore All Courses
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/10 backdrop-blur-sm">
              Business Solutions
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
