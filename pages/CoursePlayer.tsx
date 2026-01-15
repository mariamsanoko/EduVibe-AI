
import React, { useState, useEffect } from 'react';
import { Course, Lesson, User } from '../types';
import AITutor from '../components/AITutor';
import QuizPlayer from '../components/QuizPlayer';

interface CoursePlayerProps {
  course: Course;
  onBack: () => void;
  user: User | null;
  onPay: () => void;
  onLogin: () => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onBack, user, onPay, onLogin }) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const currentLesson = course.lessons[currentLessonIndex];
  
  const isPurchased = user?.purchasedCourses.includes(course.id) || course.isFree;
  const isLocked = !isPurchased && !currentLesson.isFreePreview;

  const handleNext = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-72px)] overflow-hidden bg-white">
      {/* Sidebar - Course Content */}
      <div className="w-full lg:w-80 flex flex-col border-r border-slate-200 bg-slate-50/30">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Catalogue
          </button>
        </div>
        
        <div className="p-6 bg-white border-b border-slate-100">
          <h2 className="font-bold text-slate-900 line-clamp-1 mb-1">{course.title}</h2>
          <div className="flex items-center gap-2 mb-4">
             <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500" 
                  style={{ width: `${((currentLessonIndex + 1) / course.lessons.length) * 100}%` }}
                ></div>
             </div>
             <span className="text-[10px] font-bold text-slate-400">
               {Math.round(((currentLessonIndex + 1) / course.lessons.length) * 100)}%
             </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.lessons.map((lesson, idx) => {
            const lessonLocked = !isPurchased && !lesson.isFreePreview;
            return (
              <button
                key={lesson.id}
                onClick={() => setCurrentLessonIndex(idx)}
                className={`w-full text-left p-4 border-l-4 transition-all flex items-start gap-3 ${
                  currentLessonIndex === idx 
                    ? 'bg-indigo-50 border-indigo-600' 
                    : 'bg-transparent border-transparent hover:bg-slate-100/50'
                }`}
              >
                <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center ${
                   currentLessonIndex === idx ? 'text-indigo-600' : 'text-slate-300'
                }`}>
                  {lessonLocked ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  ) : (
                    <>
                      {lesson.type === 'video' && <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>}
                      {lesson.type === 'text' && <svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path></svg>}
                      {lesson.type === 'quiz' && <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>}
                    </>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${currentLessonIndex === idx ? 'text-indigo-600' : 'text-slate-400'}`}>
                      Leçon {idx + 1}
                    </span>
                    {lesson.isFreePreview && !isPurchased && (
                      <span className="bg-emerald-100 text-emerald-700 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Aperçu Gratuit</span>
                    )}
                  </div>
                  <p className={`text-sm font-semibold leading-tight ${currentLessonIndex === idx ? 'text-slate-900' : 'text-slate-600'}`}>
                    {lesson.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Player Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8 lg:p-12">
            {isLocked ? (
              <div className="bg-slate-50 rounded-[40px] p-12 text-center border-2 border-dashed border-slate-200">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 text-indigo-600 animate-bounce">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Contenu Verrouillé</h2>
                <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
                  Cette leçon fait partie du programme premium. Accédez à l'intégralité de la formation pour débloquer toutes les vidéos, quiz et le tutorat IA.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {user ? (
                    <button 
                      onClick={onPay}
                      className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                    >
                      Débloquer pour {course.price}€
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={onLogin}
                        className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                      >
                        S'inscrire / Connexion
                      </button>
                      <button 
                        onClick={onPay}
                        className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-100 text-slate-700 font-black rounded-2xl hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95"
                      >
                        Acheter maintenant
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                {currentLesson.type === 'video' ? (
                  <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-900 shadow-2xl mb-10 ring-8 ring-slate-50">
                    <iframe 
                      className="w-full h-full" 
                      src={currentLesson.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"} 
                      title="Lesson Video"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : null}

                {currentLesson.type === 'quiz' ? (
                  <QuizPlayer content={currentLesson.content} onComplete={handleNext} />
                ) : (
                  <article className="prose prose-slate max-w-none">
                    <div className="flex items-center gap-4 mb-8">
                       <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-widest">Leçon {currentLessonIndex + 1}</span>
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                       <span className="text-slate-400 font-bold text-sm">{currentLesson.duration} de lecture</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-8 leading-tight">{currentLesson.title}</h1>
                    <div className="text-lg text-slate-600 leading-relaxed space-y-6">
                      {currentLesson.content.split('\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </article>
                )}

                <div className="flex items-center justify-between mt-16 py-8 border-t border-slate-100">
                  <button 
                    onClick={handlePrev}
                    disabled={currentLessonIndex === 0}
                    className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                    Précédent
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={currentLessonIndex === course.lessons.length - 1}
                    className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-30 flex items-center gap-2"
                  >
                    Leçon Suivante
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - AI Tutor */}
      {!isLocked && (
        <div className="w-full lg:w-96">
          <AITutor currentContext={`${currentLesson.title}: ${currentLesson.content}`} />
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
