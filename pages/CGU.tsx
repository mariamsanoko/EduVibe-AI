
import React from 'react';

interface CGUProps {
  onBack: () => void;
}

const CGU: React.FC<CGUProps> = ({ onBack }) => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="mb-16">
        <button onClick={onBack} className="mb-8 text-indigo-600 font-black text-xs uppercase flex items-center gap-2 hover:gap-4 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3"/></svg>
          Retour
        </button>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Conditions Générales d'Utilisation</h1>
        <p className="text-slate-500 font-medium">Dernière mise à jour : 24 Mai 2024</p>
      </div>

      <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités de mise à disposition des services de la plateforme EduVibe AI. L'accès et l'utilisation de la plateforme impliquent l'acceptation sans réserve de ces conditions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Accès au Service</h2>
          <p>
            L'accès à la plateforme est réservé aux utilisateurs inscrits ayant fourni un email et un numéro de téléphone mobile valides. EduVibe AI se réserve le droit de suspendre ou de refuser l'accès à tout utilisateur ne respectant pas les présentes CGU.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Propriété Intellectuelle</h2>
          <p>
            L'ensemble des contenus (vidéos, textes, quiz, codes sources) présents sur EduVibe AI est protégé par le droit d'auteur. Toute reproduction ou diffusion non autorisée, même partielle, est strictement interdite et peut donner lieu à des poursuites judiciaires.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">4. Modalités de Paiement et Facturation</h2>
          <p>
            Les formations payantes sont accessibles après un paiement unique ou via un abonnement. Une facture détaillée est générée automatiquement pour chaque transaction et reste accessible dans l'espace "Profil" de l'utilisateur. Aucun remboursement n'est possible une fois que plus de 20% du contenu de la formation a été visionné.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">5. Protection des Données (RGPD)</h2>
          <p>
            Conformément au RGPD, EduVibe AI s'engage à protéger les données personnelles de ses utilisateurs. Les numéros de téléphone sont utilisés exclusivement pour la sécurisation des comptes via authentification et ne sont jamais transmis à des tiers.
          </p>
        </section>

        <section className="p-10 bg-slate-100 rounded-[40px] border border-slate-200">
          <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Contact</h2>
          <p>
            Pour toute question relative aux présentes conditions, vous pouvez nous contacter à l'adresse suivante : 
            <span className="block mt-2 font-black text-indigo-600">legal@eduvibe-ai.com</span>
          </p>
        </section>
      </div>
    </main>
  );
};

export default CGU;
