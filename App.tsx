
import React, { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import CoursePlayer from './pages/CoursePlayer';
import Profile from './pages/Profile';
import { Course } from './types';
import { COURSES } from './data/courses';

type View = 'home' | 'player' | 'profile';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('player');
  };

  const currentCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
      <Header onNavigate={handleNavigate} currentPage={currentView} />
      
      {currentView === 'home' && (
        <Home onSelectCourse={handleSelectCourse} />
      )}
      
      {currentView === 'player' && currentCourse && (
        <CoursePlayer 
          course={currentCourse} 
          onBack={() => setCurrentView('home')} 
        />
      )}

      {currentView === 'profile' && (
        <Profile onSelectCourse={handleSelectCourse} />
      )}

      <footer className="bg-white border-t border-slate-200 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">E</div>
            <span className="font-bold text-slate-800">EduVibe AI</span>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a>
          </div>
          
          <p>© 2024 EduVibe AI Learning. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
