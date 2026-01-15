
import React, { useState } from 'react';
import { User } from '../types';

interface AuthSystemProps {
  onAuthSuccess: (user: User) => void;
  onClose: () => void;
}

const AuthSystem: React.FC<AuthSystemProps> = ({ onAuthSuccess, onClose }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleGoogleLogin = () => {
    setLoadingGoogle(true);
    // Simulation d'une authentification Google
    setTimeout(() => {
      const googleUser: User = {
        id: 'google_' + Math.random().toString(36).substr(2, 9),
        email: isAdminMode ? 'admin@eduvibe.com' : 'user.google@gmail.com',
        name: isAdminMode ? 'Admin Staff' : 'Utilisateur Google',
        role: isAdminMode ? 'admin' : 'user',
        phoneNumber: '06 00 00 00 00',
        isAuthenticated: true,
        is2FAVerified: true,
        purchasedCourses: [],
        invoices: [],
        subscription: 'Free'
      };
      onAuthSuccess(googleUser);
      setLoadingGoogle(false);
    }, 1500);
  };

  const handleStartAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !name) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
    }, 1000);
  };

  const handleFinalVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const mockUser: User = {
        id: 'u' + Date.now(),
        email: email,
        name: name,
        role: (email.includes('admin') || isAdminMode) ? 'admin' : 'user',
        phoneNumber: phone,
        isAuthenticated: true,
        is2FAVerified: true,
        purchasedCourses: [],
        invoices: [],
        subscription: 'Free'
      };
      onAuthSuccess(mockUser);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-lg rounded-[48px] p-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 transition-colors ${isAdminMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
        {/* Toggle Mode */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex">
            <button 
              onClick={() => setIsAdminMode(false)}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isAdminMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Élève
            </button>
            <button 
              onClick={() => setIsAdminMode(true)}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isAdminMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-400'}`}
            >
              Admin
            </button>
          </div>
        </div>

        {step === 'input' ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight">{isAdminMode ? 'Accès Administrateur' : 'Rejoindre EduVibe'}</h2>
              <p className={`mt-2 font-medium ${isAdminMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Connectez-vous pour {isAdminMode ? 'gérer la plateforme' : 'commencer à apprendre'}
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleGoogleLogin}
                disabled={loadingGoogle || loading}
                className={`w-full flex items-center justify-center gap-4 py-4 rounded-[24px] border font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${
                  isAdminMode 
                  ? 'bg-white text-slate-900 border-white hover:bg-slate-100' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {loadingGoogle ? (
                  <div className={`w-5 h-5 border-2 rounded-full animate-spin ${isAdminMode ? 'border-slate-900/20 border-t-slate-900' : 'border-indigo-600/20 border-t-indigo-600'}`}></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    Google
                  </>
                )}
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className={`flex-1 h-px ${isAdminMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[2px]">Ou par identifiants</span>
                <div className={`flex-1 h-px ${isAdminMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
              </div>
            </div>

            <form onSubmit={handleStartAuth} className="space-y-4">
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Nom complet"
                className={`w-full px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold ${isAdminMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
              />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold ${isAdminMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
              />
              <div className="flex gap-2">
                <div className={`w-16 flex items-center justify-center rounded-2xl font-black text-xs ${isAdminMode ? 'bg-slate-900 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>+33</div>
                <input 
                  type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="Téléphone"
                  className={`flex-1 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold ${isAdminMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                />
              </div>

              <button 
                type="submit" disabled={loading || loadingGoogle}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-[24px] shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 text-lg mt-6"
              >
                {loading ? 'Connexion...' : 'Continuer'}
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleFinalVerify} className="space-y-8 text-center">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.083 0 7.674-2.43 9.377-5.926M9 11V9a3 3 0 016 0v2m-6 0h6"></path></svg>
            </div>
            <h2 className="text-3xl font-black">Code de sécurité</h2>
            <p className={`font-medium ${isAdminMode ? 'text-slate-400' : 'text-slate-500'}`}>Envoyé au +33 {phone}</p>

            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4].map((i) => (
                <input 
                  key={i} type="text" maxLength={1}
                  className={`w-14 h-16 rounded-2xl text-center font-black text-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isAdminMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              ))}
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-5 bg-emerald-500 text-white font-black rounded-[24px] shadow-xl hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 text-lg"
            >
              {loading ? 'Vérification...' : 'Valider'}
            </button>
            
            <button type="button" onClick={() => setStep('input')} className="block w-full text-xs font-black text-indigo-500 uppercase tracking-widest hover:underline">
              Retour
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthSystem;
