
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import CoursePlayer from './pages/CoursePlayer';
import Profile from './pages/Profile';
import AuthSystem from './components/AuthSystem';
import PaymentSystem from './components/PaymentSystem';
import { Course, User } from './types';
import { COURSES } from './data/courses';

type View = 'home' | 'player' | 'profile';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [courseToPay, setCourseToPay] = useState<Course | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('edu_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('edu_user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleSelectCourse = (courseId: string) => {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    if (course.isFree || (user && user.purchasedCourses.includes(courseId))) {
      setSelectedCourseId(courseId);
      setCurrentView('player');
    } else {
      if (!user) {
        setShowAuthModal(true);
      } else {
        setCourseToPay(course);
      }
    }
  };

  const handlePaymentSuccess = (courseId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        purchasedCourses: [...user.purchasedCourses, courseId]
      };
      setUser(updatedUser);
      localStorage.setItem('edu_user', JSON.stringify(updatedUser));
      setCourseToPay(null);
      setSelectedCourseId(courseId);
      setCurrentView('player');
    }
  };

  const currentCourse = COURSES.find(c => c.id === selectedCourseId);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
      <Header 
        onNavigate={(view) => setCurrentView(view as View)} 
        currentPage={currentView}
        user={user}
        onLogin={() => setShowAuthModal(true)}
      />
      
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
        <Profile onSelectCourse={handleSelectCourse} user={user} />
      )}

      {showAuthModal && (
        <AuthSystem onAuthSuccess={handleAuthSuccess} onClose={() => setShowAuthModal(false)} />
      )}

      {courseToPay && (
        <PaymentSystem 
          course={courseToPay} 
          onSuccess={handlePaymentSuccess} 
          onClose={() => setCourseToPay(null)} 
        />
      )}

      <footer className="bg-white border-t border-slate-200 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">E</div>
            <span className="font-bold text-slate-800">EduVibe AI</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-indigo-600 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">CGU</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Aide</a>
          </div>
          <p>© 2024 EduVibe AI Learning. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
