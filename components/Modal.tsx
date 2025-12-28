
import React, { useEffect, useRef } from 'react';
import { NexusError } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  error?: NexusError | null;
  onRetry?: () => void;
}

const Modal: React.FC<Props> = ({ isOpen, onClose, title, children, error, onRetry }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden"
      role="none"
    >
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity animate-in fade-in duration-500 ease-out" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div 
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md bg-white dark:bg-slate-950 rounded-t-[54px] sm:rounded-[54px] p-8 sm:p-10 shadow-[0_-32px_128px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-500 cubic-bezier(0.16, 1, 0.3, 1) max-h-[94vh] flex flex-col focus:outline-none transition-colors duration-300"
      >
        <div className="w-14 h-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-full mx-auto mb-6 sm:hidden" aria-hidden="true"></div>
        
        <div className="flex justify-between items-start mb-6">
          <div>
             <span className="text-nexus-primary dark:text-sky-400 text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">Nexus Operation</span>
             <h3 id="modal-title" className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{error ? error.title : title}</h3>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close modal"
            className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[20px] transition-all spring-click border border-slate-100 dark:border-slate-800 shadow-sm focus:ring-2 focus:ring-nexus-primary outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar pb-4 px-1">
          {error ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="relative w-20 h-20 mx-auto">
                 <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse"></div>
                 <div className="relative w-full h-full bg-red-100 dark:bg-red-900/30 rounded-[32px] flex items-center justify-center text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                 </div>
              </div>

              <div className="text-center space-y-2">
                 <p className="text-slate-500 dark:text-slate-300 font-bold text-sm leading-relaxed px-4">{error.message}</p>
                 <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Trace: {error.code}</div>
              </div>

              {error.troubleshoot && error.troubleshoot.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 space-y-4">
                  <h4 className="text-[10px] font-black text-nexus-primary uppercase tracking-[0.3em]">Diagnostic Steps</h4>
                  <ul className="space-y-3">
                    {error.troubleshoot.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-xs font-bold text-slate-600 dark:text-slate-400 leading-snug">
                        <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary mt-1 flex-shrink-0"></div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-4 pt-2">
                 {onRetry && error.canRetry && (
                   <button 
                     onClick={onRetry}
                     className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-5 rounded-[28px] font-black text-lg shadow-xl spring-click hover:brightness-110 uppercase tracking-tight"
                   >
                     Retry Operation
                   </button>
                 )}
                 <button 
                   onClick={() => window.open('https://ai.google.dev/gemini-api/docs/billing', '_blank')}
                   className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 py-3 rounded-[24px] font-black text-[10px] uppercase tracking-widest spring-click"
                 >
                   Nexus Support Link
                 </button>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
        
        <div className="pt-2 border-t border-slate-50 dark:border-slate-800/50 text-center">
           <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nexus Secure Environment v4.0</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
