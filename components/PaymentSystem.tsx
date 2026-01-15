
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
      
      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-5/12 bg-indigo-600 p-8 text-white flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Récapitulatif</span>
            <h2 className="text-2xl font-black mt-4 leading-tight">{course.title}</h2>
          </div>
          <div className="mt-12">
            <span className="text-4xl font-black">{course.price}€</span>
            <p className="text-indigo-200 text-sm">Accès à vie inclus</p>
          </div>
        </div>

        <div className="flex-1 p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Informations de Paiement</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Numéro de Carte</label>
              <div className="relative">
                <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                  <div className="w-8 h-5 bg-slate-200 rounded"></div>
                  <div className="w-8 h-5 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Expiration</label>
                <input type="text" placeholder="MM / YY" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">CVC</label>
                <input type="text" placeholder="123" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            <p className="text-[10px] text-slate-400">
              Paiement sécurisé crypté de bout en bout. En cliquant sur payer, vous acceptez nos CGV.
            </p>

            <button 
              onClick={handlePay}
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : `Payer ${course.price}€`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;
