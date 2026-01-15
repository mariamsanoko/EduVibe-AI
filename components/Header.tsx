
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
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
            E
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">EduVibe<span className="text-indigo-600">AI</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate('home')}
            className={`font-medium transition-colors ${currentPage === 'home' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            Formations
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className={`font-medium transition-colors ${currentPage === 'profile' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            Mon Apprentissage
          </button>
          {user?.role === 'admin' && (
            <button 
              onClick={() => onNavigate('admin')}
              className={`font-black text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg flex items-center gap-2 transition-all hover:bg-indigo-100 ${currentPage === 'admin' ? 'ring-2 ring-indigo-500' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeWidth="2"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/></svg>
              Admin
            </button>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 p-1.5 pr-4 bg-slate-100 rounded-full">
                <img src={`https://i.pravatar.cc/150?u=${user.id}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="Profile" />
                <span className="text-sm font-bold text-slate-700">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                title="Déconnexion"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <button onClick={onLogin} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Connexion</button>
              <button onClick={onLogin} className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95">
                Commencer
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
