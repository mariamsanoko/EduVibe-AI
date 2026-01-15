
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { geminiService } from '../services/geminiService';

interface QuizPlayerProps {
  content: string;
  onComplete: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ content, onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      setIsLoading(true);
      const generatedQuestions = await geminiService.generateQuiz(content);
      setQuestions(generatedQuestions);
      setIsLoading(false);
    };
    loadQuiz();
  }, [content]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === questions[currentIndex].correctIndex) {
      setScore(score + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-bold text-slate-800">Generating AI Quiz...</h3>
        <p className="text-slate-500">Wait a moment while our AI analyzes the lesson content.</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="p-8 text-center text-slate-500">Failed to generate quiz. Please try again.</div>;
  }

  if (isFinished) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
        <p className="text-slate-500 mb-8">You scored {score} out of {questions.length}</p>
        <button 
          onClick={onComplete}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
        >
          Finish Lesson
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Question {currentIndex + 1} of {questions.length}</span>
        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800">{currentQ.question}</h2>

      <div className="space-y-4">
        {currentQ.options.map((option, idx) => {
          let optionStyles = "bg-white border-2 border-slate-100 hover:border-indigo-200";
          if (selectedOption !== null) {
            if (idx === currentQ.correctIndex) optionStyles = "bg-emerald-50 border-emerald-500 text-emerald-700";
            else if (idx === selectedOption) optionStyles = "bg-rose-50 border-rose-500 text-rose-700";
            else optionStyles = "bg-slate-50 border-slate-100 opacity-60";
          }

          return (
            <button
              key={idx}
              disabled={selectedOption !== null}
              onClick={() => handleOptionSelect(idx)}
              className={`w-full text-left p-5 rounded-2xl transition-all font-medium flex items-center justify-between ${optionStyles}`}
            >
              <span>{option}</span>
              {selectedOption !== null && idx === currentQ.correctIndex && (
                <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              )}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
          <h4 className="font-bold text-indigo-900 mb-2">Explanation</h4>
          <p className="text-indigo-800 text-sm leading-relaxed">{currentQ.explanation}</p>
          <button 
            onClick={handleNext}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md"
          >
            {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPlayer;
