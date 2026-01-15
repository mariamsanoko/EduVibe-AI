
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, user, onLogin, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 glass-effect bg-white/70 shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl group-hover:rotate-6 transition-all shadow-lg shadow-indigo-200">
            E
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">EduVibe<span className="text-indigo-600">AI</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
          <button 
            onClick={() => onNavigate('home')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              currentPage === 'home' 
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            Formations
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              currentPage === 'profile' 
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l9-5-9-5-9 5 9 5zm0 0v6"/></svg>
            Mon Apprentissage
          </button>
          {user?.role === 'admin' && (
            <button 
              onClick={() => onNavigate('admin')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                currentPage === 'admin' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" strokeWidth="2.5"/></svg>
              Admin
            </button>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 p-1.5 pr-4 bg-slate-900 rounded-2xl shadow-lg hover:translate-y-[-1px] transition-all cursor-pointer">
                <img src={`https://i.pravatar.cc/150?u=${user.id}`} className="w-9 h-9 rounded-xl border-2 border-white/10" alt="Profile" />
                <span className="text-sm font-black text-white">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                title="Déconnexion"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={onLogin} className="px-6 py-3 text-sm font-black text-slate-600 hover:text-indigo-600 transition-colors">Connexion</button>
              <button onClick={onLogin} className="px-7 py-3.5 text-sm font-black bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] active:scale-95">
                Accès Immédiat
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
