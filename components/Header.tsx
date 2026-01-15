
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  user: User | null;
  onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, user, onLogin }) => {
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
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 p-1.5 pr-4 bg-slate-100 rounded-full">
              <img src={`https://i.pravatar.cc/150?u=${user.id}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="Profile" />
              <span className="text-sm font-bold text-slate-700">{user.name}</span>
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
