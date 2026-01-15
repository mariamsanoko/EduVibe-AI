
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AITutorProps {
  currentContext: string;
}

const AITutor: React.FC<AITutorProps> = ({ currentContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Salut ! Je suis ton tuteur **VibeBot**. Je connais cette leçon sur le bout des doigts. Comment puis-je t'aider aujourd'hui ?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string = input) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMessage];
      const aiResponse = await geminiService.getTutorResponse(history, currentContext);
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Désolé, j'ai eu une petite défaillance technique. On réessaie ?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "💡 Résumé", prompt: "Peux-tu me résumer les points clés de cette leçon ?" },
    { label: "🚀 Exemple", prompt: "Donne-moi un exemple concret d'application de ce concept." },
    { label: "❓ Quiz Flash", prompt: "Pose-moi une question rapide pour tester mes connaissances." }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200">
      {/* Header */}
      <div className="p-6 bg-indigo-600 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-lg tracking-tight">VibeBot AI</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest">Tuteur Expert Actif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] p-4 rounded-3xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none shadow-xl' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm prose prose-sm'
            }`}>
              {msg.text.split('\n').map((line, idx) => (
                <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                  {line.startsWith('**') ? <strong>{line.replace(/\*\*/g, '')}</strong> : line}
                </p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">VibeBot réfléchit...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-6 bg-white border-t border-slate-100">
        {/* Quick Actions */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action.prompt)}
              disabled={isLoading}
              className="whitespace-nowrap px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-95"
            >
              {action.label}
            </button>
          ))}
        </div>

        <div className="relative group">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pose-moi une question..."
            className="w-full pl-5 pr-14 py-4 bg-slate-100 border-none rounded-[20px] text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-lg active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
           Propulsé par Gemini 3 Pro
        </p>
      </div>
    </div>
  );
};

export default AITutor;
