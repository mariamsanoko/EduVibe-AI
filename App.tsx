
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import CoursePlayer from './pages/CoursePlayer';
import CourseDetails from './pages/CourseDetails';
import Profile from './pages/Profile';
import AuthSystem from './components/AuthSystem';
import PaymentSystem from './components/PaymentSystem';
import AdminDashboard from './components/AdminDashboard';
import { Course, User, SiteSettings } from './types';
import { COURSES as INITIAL_COURSES } from './data/courses';

type View = 'home' | 'player' | 'details' | 'profile' | 'admin';

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "Maîtrisez l'Automatisation avec Make, n8n & Google AI",
  heroSubtitle: "Découvrez comment révolutionner votre flux de travail grâce au Vibe Coding et à l'intelligence artificielle de pointe.",
  heroImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000",
  footerText: "© 2024 EduVibe AI Learning. Tous droits réservés."
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [courseToPay, setCourseToPay] = useState<Course | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedCourses = localStorage.getItem('edu_courses');
    setCourses(savedCourses ? JSON.parse(savedCourses) : INITIAL_COURSES);

    const savedSettings = localStorage.getItem('edu_settings');
    if (savedSettings) setSiteSettings(JSON.parse(savedSettings));

    const savedUser = localStorage.getItem('edu_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.role === 'admin') setCurrentView('admin');
      } catch (e) {
        localStorage.removeItem('edu_user');
      }
    }
  }, []);

  const handleUpdateCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    localStorage.setItem('edu_courses', JSON.stringify(newCourses));
  };

  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    localStorage.setItem('edu_settings', JSON.stringify(newSettings));
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('edu_user', JSON.stringify(userData));
    setShowAuthModal(false);
    if (userData.role === 'admin') setCurrentView('admin');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('edu_user');
    setCurrentView('home');
    setSelectedCourseId(null);
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('details');
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

  const currentCourse = courses.find(c => c.id === selectedCourseId);

  if (currentView === 'admin' && user?.role === 'admin') {
    return (
      <AdminDashboard 
        courses={courses} 
        onUpdateCourses={handleUpdateCourses} 
        siteSettings={siteSettings}
        onUpdateSettings={handleUpdateSettings}
        onClose={() => setCurrentView('home')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
      <Header 
        onNavigate={(view) => setCurrentView(view as View)} 
        currentPage={currentView}
        user={user}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      
      {currentView === 'home' && (
        <Home courses={courses} onSelectCourse={handleSelectCourse} siteSettings={siteSettings} />
      )}
      
      {currentView === 'details' && currentCourse && (
        <CourseDetails 
          course={currentCourse} 
          user={user}
          onStartLearning={() => setCurrentView('player')}
          onBuy={() => setCourseToPay(currentCourse)}
          onLogin={() => setShowAuthModal(true)}
          onBack={() => setCurrentView('home')}
        />
      )}

      {currentView === 'player' && currentCourse && (
        <CoursePlayer 
          course={currentCourse} 
          onBack={() => setCurrentView('home')} 
          user={user}
          onPay={() => setCourseToPay(currentCourse)}
          onLogin={() => setShowAuthModal(true)}
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
          <p>{siteSettings.footerText}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
