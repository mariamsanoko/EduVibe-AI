
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import CoursePlayer from './pages/CoursePlayer';
import CourseDetails from './pages/CourseDetails';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import CGU from './pages/CGU';
import AuthSystem from './components/AuthSystem';
import PaymentSystem from './components/PaymentSystem';
import AdminDashboard from './components/AdminDashboard';
import { Course, User, SiteSettings, Review, Invoice, SubscriptionPlan } from './types';
import { COURSES as INITIAL_COURSES } from './data/courses';

type View = 'home' | 'player' | 'details' | 'profile' | 'admin' | 'pricing' | 'cgu';

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "Maîtrisez l'IA et l'Automatisation",
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
    setUser({ ...userData, subscription: userData.subscription || 'Free' });
    localStorage.setItem('edu_user', JSON.stringify(userData));
    setShowAuthModal(false);
    if (userData.role === 'admin') setCurrentView('admin');
  };

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const updatedUser: User = { ...user, subscription: plan };
    setUser(updatedUser);
    localStorage.setItem('edu_user', JSON.stringify(updatedUser));
    alert(`Félicitations ! Vous êtes désormais membre ${plan}.`);
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
    if (user && courseToPay) {
      const newInvoice: Invoice = {
        id: 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        courseTitle: courseToPay.title,
        date: new Date().toLocaleDateString('fr-FR'),
        amount: courseToPay.price || 0,
        paymentMethod: 'Carte Bancaire'
      };

      const updatedUser: User = {
        ...user,
        purchasedCourses: [...user.purchasedCourses, courseId],
        invoices: [...(user.invoices || []), newInvoice]
      };
      
      setUser(updatedUser);
      localStorage.setItem('edu_user', JSON.stringify(updatedUser));
      setCourseToPay(null);
      setSelectedCourseId(courseId);
      setCurrentView('player');
    }
  };

  const handleAddReview = (courseId: string, review: Review) => {
    const updatedCourses = courses.map(c => {
      if (c.id === courseId) {
        const newReviews = [...(c.reviews || []), { ...review, status: 'pending' as const }];
        return { ...c, reviews: newReviews };
      }
      return c;
    });
    handleUpdateCourses(updatedCourses);
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
      
      {currentView === 'pricing' && (
        <Pricing 
          onBack={() => setCurrentView('home')} 
          onSubscribe={handleSubscribe} 
          currentPlan={user?.subscription}
        />
      )}

      {currentView === 'cgu' && (
        <CGU onBack={() => setCurrentView('home')} />
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
        <Profile 
          onSelectCourse={handleSelectCourse} 
          user={user} 
          courses={courses}
          onAddReview={handleAddReview}
        />
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
            <button onClick={() => setCurrentView('pricing')} className="hover:text-indigo-600 transition-colors font-bold uppercase tracking-tighter">Tarification</button>
            <button className="hover:text-indigo-600 transition-colors font-bold uppercase tracking-tighter">Confidentialité</button>
            <button onClick={() => setCurrentView('cgu')} className="hover:text-indigo-600 transition-colors font-bold uppercase tracking-tighter">CGU</button>
          </div>
          <p>{siteSettings.footerText}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
