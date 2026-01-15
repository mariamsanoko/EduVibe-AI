
import React, { useState } from 'react';
import { User } from '../types';

interface AuthSystemProps {
  onAuthSuccess: (user: User) => void;
  onClose: () => void;
}

const AuthSystem: React.FC<AuthSystemProps> = ({ onAuthSuccess, onClose }) => {
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation délai Firebase Auth
    setTimeout(() => {
      setLoading(false);
      setStep('2fa');
    }, 1500);
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation vérification 2FA
    setTimeout(() => {
      const mockUser: User = {
        id: 'u1',
        email,
        name: email.split('@')[0],
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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl overflow-hidden">
        {step === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900">Bienvenue sur EduVibe</h2>
              <p className="text-slate-500">Connectez-vous pour continuer</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">E-mail</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="nom@exemple.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mot de passe</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Connexion en cours...' : 'Se Connecter'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify2FA} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.083 0 7.674-2.43 9.377-5.926M9 11V9a3 3 0 016 0v2m-6 0h6"></path></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900">Vérification 2FA</h2>
              <p className="text-slate-500">Entrez le code envoyé sur votre mobile</p>
            </div>

            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <input 
                  key={i}
                  type="text" 
                  maxLength={1}
                  className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={code[i-1] || ''}
                  onChange={(e) => setCode(prev => prev + e.target.value)}
                />
              ))}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Vérification...' : 'Vérifier le Code'}
            </button>

            <button type="button" onClick={() => setStep('login')} className="w-full text-sm font-bold text-slate-400 hover:text-slate-600">
              Retour
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthSystem;
