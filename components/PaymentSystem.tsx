
import React, { useState } from 'react';
import { Course } from '../types';

interface PaymentSystemProps {
  course: Course;
  onSuccess: (courseId: string) => void;
  onClose: () => void;
}

const PaymentSystem: React.FC<PaymentSystemProps> = ({ course, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      onSuccess(course.id);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Course Preview */}
        <div className="w-full md:w-5/12 bg-slate-50 border-r border-slate-100 flex flex-col">
          <div className="h-48 overflow-hidden">
            <img src={course.thumbnail} className="w-full h-full object-cover" alt={course.title} />
          </div>
          <div className="p-8 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Récapitulatif</span>
              <h2 className="text-xl font-black mt-2 leading-tight text-slate-800">{course.title}</h2>
              <p className="text-slate-400 text-xs mt-4 line-clamp-2">{course.instructor} • Accès à vie</p>
            </div>
            <div className="mt-8">
              <span className="text-3xl font-black text-slate-900">{course.price}€</span>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">Paiement unique sécurisé</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="flex-1 p-10">
          <h3 className="text-lg font-black text-slate-800 mb-8 uppercase tracking-tighter">Coordonnées de paiement</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Numéro de Carte</label>
              <div className="relative">
                <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                  <div className="w-8 h-5 bg-slate-200 rounded"></div>
                  <div className="w-8 h-5 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Expiration</label>
                <input type="text" placeholder="MM / YY" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">CVC</label>
                <input type="text" placeholder="123" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={handlePay}
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-[24px] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : `Valider l'achat • ${course.price}€`}
              </button>
            </div>

            <p className="text-[9px] text-slate-400 text-center leading-relaxed px-4">
              Transaction sécurisée via Stripe. Vos données bancaires sont cryptées et ne transitent jamais par nos serveurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;
