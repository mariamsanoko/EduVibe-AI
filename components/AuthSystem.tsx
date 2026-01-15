
import React, { useState } from 'react';
import { User } from '../types';

interface AuthSystemProps {
  onAuthSuccess: (user: User) => void;
  onClose: () => void;
}

const AuthSystem: React.FC<AuthSystemProps> = ({ onAuthSuccess, onClose }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [method, setMethod] = useState<'email' | 'mobile'>('email');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const handleStartAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const mockUser: User = {
        id: 'g' + Date.now(),
        email: isAdminMode ? 'admin@eduvibe.com' : 'google.user@gmail.com',
        name: isAdminMode ? 'Admin Google' : 'Google User',
        role: isAdminMode ? 'admin' : 'user',
        isAuthenticated: true,
        is2FAVerified: true,
        purchasedCourses: []
      };
      onAuthSuccess(mockUser);
    }, 1200);
  };

  const handleFinalVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const mockUser: User = {
        id: 'u' + Date.now(),
        email: method === 'email' ? email : `${phone}@mobile.com`,
        name: method === 'email' ? email.split('@')[0] : 'User',
        role: (email === 'admin@eduvibe.com' || isAdminMode) ? 'admin' : 'user',
        phoneNumber: method === 'mobile' ? phone : undefined,
        isAuthenticated: true,
        is2FAVerified: true,
        purchasedCourses: []
      };
      onAuthSuccess(mockUser);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-md rounded-[32px] p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 transition-colors ${isAdminMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className="flex justify-center mb-6">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex">
            <button 
              onClick={() => setIsAdminMode(false)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${!isAdminMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Étudiant
            </button>
            <button 
              onClick={() => setIsAdminMode(true)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${isAdminMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-400'}`}
            >
              Admin
            </button>
          </div>
        </div>

        {step === 'input' ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-colors ${isAdminMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white shadow-indigo-200'}`}>
                {isAdminMode ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" strokeLinecap="round"/></svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.083 0 7.674-2.43 9.377-5.926M9 11V9a3 3 0 016 0v2m-6 0h6" strokeWidth="2" strokeLinecap="round"/></svg>
                )}
              </div>
              <h2 className="text-2xl font-black">{isAdminMode ? 'Portail Admin' : 'Rejoindre EduVibe'}</h2>
              <p className={isAdminMode ? 'text-slate-400' : 'text-slate-500'}>
                {isAdminMode ? 'Accès réservé aux gestionnaires' : 'Apprenez avec l\'IA'}
              </p>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className={`w-full py-4 border rounded-2xl flex items-center justify-center gap-3 font-bold transition-all active:scale-95 ${isAdminMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google Workspace
            </button>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setMethod('email')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${method === 'email' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                E-mail
              </button>
              <button 
                onClick={() => setMethod('mobile')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${method === 'mobile' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                Mobile
              </button>
            </div>

            <form onSubmit={handleStartAuth} className="space-y-4">
              {method === 'email' ? (
                <div className="space-y-4">
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@eduvibe.com"
                    className={`w-full px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isAdminMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                  />
                  <input 
                    type="password" required placeholder="Mot de passe"
                    className={`w-full px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isAdminMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                  />
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className={`w-20 px-3 py-4 border rounded-2xl font-bold flex items-center justify-center ${isAdminMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>+33</div>
                  <input 
                    type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className={`flex-1 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isAdminMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                  />
                </div>
              )}

              <button 
                type="submit" disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Connexion...' : 'S\'identifier'}
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleFinalVerify} className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.083 0 7.674-2.43 9.377-5.926M9 11V9a3 3 0 016 0v2m-6 0h6"></path></svg>
              </div>
              <h2 className="text-2xl font-black">Double Facteur</h2>
              <p className={isAdminMode ? 'text-slate-400' : 'text-slate-500'}>Code envoyé par SMS</p>
            </div>

            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <input 
                  key={i} type="text" maxLength={1}
                  className={`w-12 h-14 border rounded-xl text-center font-bold text-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isAdminMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  value={code[i-1] || ''}
                  onChange={(e) => setCode(prev => prev + e.target.value)}
                />
              ))}
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Vérification...' : 'Valider l\'accès'}
            </button>

            <button type="button" onClick={() => setStep('input')} className="w-full text-sm font-bold text-slate-400 hover:text-indigo-400">
              Retour
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthSystem;
