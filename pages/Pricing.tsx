
import React, { useState } from 'react';
import { SubscriptionPlan } from '../types';

interface PricingProps {
  onBack: () => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
  currentPlan?: SubscriptionPlan;
}

const Pricing: React.FC<PricingProps> = ({ onBack, onSubscribe, currentPlan }) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'Free' as SubscriptionPlan,
      name: "Standard",
      price: "0",
      features: ["Accès aux cours gratuits", "Tutorat IA (5 questions/jour)", "Certificats numériques", "Support communautaire"],
      cta: "Plan Actuel",
      highlight: false,
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'Pro' as SubscriptionPlan,
      name: "Expert Pro",
      price: "19",
      features: ["Accès à TOUTES les formations", "Tutorat IA Illimité", "Accès en avant-première", "Ateliers Live Mensuels"],
      cta: "Passer en Pro",
      highlight: true,
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
        </svg>
      )
    },
    {
      id: 'Enterprise' as SubscriptionPlan,
      name: "Business",
      price: "99",
      features: ["Comptes d'équipe (jusqu'à 10)", "Analytiques avancées", "Formations sur mesure", "Coach IA dédié"],
      cta: "Contacter la Vente",
      highlight: false,
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  const handleSelect = (planId: SubscriptionPlan) => {
    if (planId === currentPlan) return;
    setLoadingPlan(planId);
    setTimeout(() => {
      onSubscribe(planId);
      setLoadingPlan(null);
    }, 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in duration-700">
      <div className="text-center mb-24">
        <button onClick={onBack} className="mb-10 text-indigo-600 font-black text-xs uppercase flex items-center gap-2 mx-auto hover:gap-4 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3"/></svg>
          Retour au catalogue
        </button>
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[4px] mb-8">
           <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
           Investissez sur vous-même
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.85]">
          Passez au niveau <span className="text-indigo-600">Supérieur</span>
        </h1>
        <p className="text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
          Débloquez la puissance illimitée du tutorat IA et accédez à l'intégralité de notre catalogue expert.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative p-12 rounded-[56px] border-2 transition-all duration-500 flex flex-col justify-between overflow-hidden ${
              plan.highlight 
                ? 'bg-slate-950 border-indigo-600 text-white shadow-[0_40px_100px_rgba(79,70,229,0.3)] scale-[1.05] z-10' 
                : 'bg-white border-slate-100 text-slate-900 shadow-2xl shadow-slate-200/50'
            }`}
          >
            {plan.highlight && (
               <div className="absolute top-0 right-0 p-8">
                 <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                   Populaire
                 </span>
               </div>
            )}

            <div>
              <div className={`mb-10 w-20 h-20 rounded-3xl flex items-center justify-center ${plan.highlight ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-indigo-600'}`}>
                {plan.icon}
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-4">{plan.name}</h2>
              <div className="flex items-baseline gap-2 mb-12">
                <span className="text-6xl font-black tracking-tighter">{plan.price}€</span>
                <span className={`text-sm font-bold uppercase tracking-widest ${plan.highlight ? 'text-slate-500' : 'text-slate-400'}`}>/ mois</span>
              </div>
              <ul className="space-y-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4 text-sm font-bold leading-tight">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-50 text-emerald-600'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => handleSelect(plan.id)}
              disabled={!!loadingPlan || currentPlan === plan.id}
              className={`mt-14 w-full py-6 rounded-3xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 ${
                currentPlan === plan.id
                  ? 'bg-emerald-500 text-white cursor-default'
                  : plan.highlight 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-900/50 disabled:opacity-50' 
                    : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl disabled:opacity-50'
              }`}
            >
              {loadingPlan === plan.id ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : currentPlan === plan.id ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  Plan Actif
                </>
              ) : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-indigo-600 rounded-[64px] p-16 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 Q 50 0 100 100" fill="none" stroke="white" strokeWidth="0.5" />
           </svg>
        </div>
        <div className="relative z-10">
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-none">Garantie de Satisfaction</h2>
           <p className="text-xl text-indigo-100 font-medium leading-relaxed opacity-90">Pas convaincu ? Nous vous remboursons intégralement dans les 30 jours, sans poser de questions. Testez la puissance de l'IA sans risque.</p>
        </div>
        <div className="relative z-10 flex justify-center md:justify-end">
           <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[48px] border border-white/20 shadow-2xl text-center rotate-3">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45zM11 10h2v4h-2v-4zm0 6h2v2h-2v-2z"/></svg>
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-indigo-200">Certifié SSL & PCI-DSS</p>
           </div>
        </div>
      </div>
    </main>
  );
};

export default Pricing;
