
import React, { useState } from 'react';
import { QuizData, DentalProblem } from '../types';
import { QUIZ_BY_PLAN } from '../constants';
import { storage } from '../services/storage';

interface Props {
  plan: DentalProblem;
  onSuccess: () => void;
  onClose: () => void;
}

const Quiz: React.FC<Props> = ({ plan, onSuccess, onClose }) => {
  const quizData = QUIZ_BY_PLAN[plan];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index: number) => {
    const isCorrect = index === quizData.questions[currentQuestion].correctIndex;
    if (isCorrect) setScore(prev => prev + 1);

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
      if (score + (isCorrect ? 1 : 0) === quizData.questions.length) {
        storage.setQuizCompleted(plan);
        storage.addBadge(quizData.badge);
      }
    }
  };

  if (showResult) {
    const passed = score === quizData.questions.length;
    return (
      <div className="text-center py-10 space-y-8 animate-in zoom-in duration-500">
        <div className={`w-32 h-32 mx-auto rounded-[40px] flex items-center justify-center text-white shadow-2xl relative ${passed ? 'bg-emerald-500' : 'bg-slate-200'}`}>
          {passed ? (
            <>
              <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-50 animate-pulse"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
            {passed ? 'Nexus Certification' : 'Evaluation Failed'}
          </h3>
          <p className="text-slate-500 font-bold mt-2">
            {passed 
              ? `You've earned the "${quizData.badge}" badge!` 
              : `You scored ${score}/${quizData.questions.length}. Precision is required for certification.`}
          </p>
        </div>

        {passed ? (
          <button onClick={onSuccess} className="w-full bg-emerald-500 text-white py-6 rounded-[28px] font-black text-xl spring-click uppercase shadow-lg">Claim Badge</button>
        ) : (
          <button onClick={onClose} className="w-full bg-slate-900 text-white py-6 rounded-[28px] font-black text-xl spring-click uppercase">Try Again Later</button>
        )}
      </div>
    );
  }

  const q = quizData.questions[currentQuestion];

  return (
    <div className="space-y-8 py-4">
      <div className="flex justify-between items-center px-2">
        <span className="text-[10px] font-black text-nexus-primary uppercase tracking-[0.3em]">Knowledge Verification</span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {currentQuestion + 1} of {quizData.questions.length}</span>
      </div>

      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-nexus-primary transition-all duration-500" 
          style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="min-h-[100px] flex items-center">
        <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{q.question}</h4>
      </div>

      <div className="grid gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className="w-full text-left p-6 rounded-[24px] border-2 border-slate-50 hover:border-nexus-primary hover:bg-blue-50 transition-all font-bold text-slate-700 spring-click group"
          >
            <div className="flex items-center space-x-4">
              <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-nexus-primary group-hover:text-white flex items-center justify-center text-[11px] font-black transition-colors">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
