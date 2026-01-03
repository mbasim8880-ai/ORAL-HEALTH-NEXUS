
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { UserProfile, DentalProblem, Tip, ScanResult, NexusError } from '../types.ts';
import { TIPS_BY_PLAN } from '../constants.tsx';
import { storage } from '../services/storage.ts';
import Modal from './Modal.tsx';
import AppointmentForm from './AppointmentForm.tsx';
import DentalScanner from './DentalScanner.tsx';
import DentalMap from './DentalMap.tsx';
import DoctorSelection from './DoctorSelection.tsx';
import { GoogleGenAI, Type } from '@google/genai';
import { mapError } from '../services/errorMapper';

const TipItem = React.memo(({ tip, idx, isLearned, onClick }: { tip: Tip, idx: number, isLearned: boolean, onClick: (t: Tip) => void }) => (
  <div 
    onClick={() => onClick(tip)} 
    className={`flex items-center p-5 rounded-squircle cursor-pointer transition-all border spring-click relative overflow-hidden group
      ${isLearned 
        ? 'bg-blue-900/10 border-blue-800/20 opacity-70' 
        : 'bg-white dark:bg-slate-900 border-white dark:border-slate-800 shadow-sm hover:shadow-md'} 
      hover:-translate-y-0.5`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-all shadow-sm ${isLearned ? 'bg-emerald-500 text-white' : 'bg-blue-50 dark:bg-slate-800 text-nexus-primary dark:text-blue-400 border dark:border-slate-700'}`}>
      {isLearned ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <span className="font-extrabold text-base">{idx + 1}</span>
      )}
    </div>
    <div className="flex-1">
      <h4 className="font-bold leading-tight text-slate-800 dark:text-white group-hover:text-nexus-primary transition-colors">{tip.title}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Care Standard</p>
    </div>
    <div className="text-slate-300 dark:text-slate-700 group-hover:text-nexus-primary transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
));

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  options?: string[];
}

interface Props {
  user: UserProfile;
  onUpdateUser: (profile: UserProfile) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Dashboard: React.FC<Props> = ({ user, onUpdateUser, theme, onToggleTheme }) => {
  const [learnedTips, setLearnedTips] = useState<string[]>([]);
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [showPlanSwitcher, setShowPlanSwitcher] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showDoctorSelection, setShowDoctorSelection] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<{ name: string; role: string } | null>(null);
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [isTipsExpanded, setIsTipsExpanded] = useState(false);
  const [modalError, setModalError] = useState<NexusError | null>(null);
  const [latestScan, setLatestScan] = useState<ScanResult | null>(storage.getLatestScan());

  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<any>(null);

  const [showScanner, setShowScanner] = useState(false);
  const [scannerInitialResult, setScannerInitialResult] = useState<ScanResult | null>(null);
  const [showDentalMap, setShowDentalMap] = useState(false);
  const [showRepair, setShowRepair] = useState(false);
  const [repairStep, setRepairStep] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  const [repairProgress, setRepairProgress] = useState(0);

  useEffect(() => {
    setLearnedTips(storage.getPlanProgress(user.currentPlan));
  }, [user.currentPlan]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const clearModalState = () => setModalError(null);

  const handleChat = async (input?: string) => {
    const message = input || chatInput.trim();
    if (!message || isAiLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', text: message };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput('');
    setIsAiLoading(true);
    setModalError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const historyText = chatMessages.slice(-4).map(m => `${m.role === 'user' ? 'Patient' : 'AI'}: ${m.text}`).join('\n');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { 
          parts: [{ 
            text: `Conversation History:\n${historyText}\n\nCurrent Patient Message: ${message}\n\nPatient Profile: Age ${user.age}, Gender ${user.gender}, Care Plan: ${user.currentPlan}. Provide expert dental guidance. Be precise but empathetic.` 
          }] 
        },
        config: {
          systemInstruction: 'You are the Nexus Intelligent Assistant. Provide expert dental guidance. Return your response as a JSON object with "text" (string) and "options" (array of strings).',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              }
            }
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      if (result.text) {
        setChatMessages(prev => [...prev, { 
          role: 'ai', 
          text: result.text, 
          options: result.options 
        }]);
      }
    } catch (err: any) {
      setModalError(mapError(err, 'AI'));
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleMarkAsLearned = useCallback((tipId: string) => {
    storage.savePlanProgress(user.currentPlan, tipId);
    setLearnedTips(storage.getPlanProgress(user.currentPlan));
    setSelectedTip(null);
    triggerConfetti();
  }, [user.currentPlan]);

  const handleAutoRepair = () => {
    setRepairStep('PROCESSING');
    setRepairProgress(0);
    
    const interval = setInterval(() => {
      setRepairProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          storage.clearDentalMap();
          const repairedScan: ScanResult = {
            status: 'GREEN',
            title: 'Anatomical Reset Successful',
            message: 'AI molecular repair has synchronized all dental structures to baseline health.',
            date: new Date().toLocaleDateString(),
            score: 100
          };
          storage.saveScanResult(repairedScan);
          setLatestScan(repairedScan);
          setRepairStep('SUCCESS');
          triggerConfetti();
          return 100;
        }
        return prev + 1;
      });
    }, 40);
  };

  const totalDisplayProgress = useMemo(() => {
    return Math.min(100, Math.round((learnedTips.length / 10) * 100));
  }, [learnedTips]);

  const features = useMemo(() => [
    { id: 'scan', label: 'AI VISION', color: 'bg-blue-600', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z', action: () => { clearModalState(); setScannerInitialResult(null); setShowScanner(true); } },
    { id: 'map', label: 'ANATOMY', color: 'bg-indigo-600', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', action: () => { clearModalState(); setShowDentalMap(true); } },
    { id: 'chat', label: 'AI LINK', color: 'bg-sky-500', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', action: () => { clearModalState(); setShowChat(true); } },
    { id: 'timer', label: 'TIMER', color: 'bg-cyan-500', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', action: () => { clearModalState(); setShowTimer(true); } },
    { id: 'repair', label: 'REPAIR', color: 'bg-emerald-500', icon: 'M13 10V3L4 14h7v7l9-11h-7z', action: () => { clearModalState(); setRepairStep('IDLE'); setShowRepair(true); } },
  ], []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTimerActive(false);
    setTimeLeft(120);
  }, []);

  const startTimer = useCallback(() => {
    setIsTimerActive(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsTimerActive(false);
          triggerConfetti();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const ALL_PLAN_OPTIONS: DentalProblem[] = [
    'General Care', 'Tooth Pain', 'Gum Bleeding', 'Sensitivity',
    'Crown', 'Bridges', 'Post extraction care', 'Implant', 'Braces'
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 transition-colors duration-500 overflow-y-auto no-scrollbar pb-32">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center">
          <div className="animate-bounce absolute">
             <svg width="240" height="240" viewBox="0 0 200 200">
               <circle cx="100" cy="100" r="12" fill="#00B4D8" />
               <circle cx="130" cy="70" r="6" fill="#0077B6" />
               <circle cx="70" cy="130" r="10" fill="#CAF0F8" />
             </svg>
          </div>
        </div>
      )}

      {/* Optimized Header Section */}
      <div className="blue-gradient text-white px-8 pt-10 pb-20 rounded-b-[56px] shadow-[0_20px_60px_-15px_rgba(0,119,182,0.3)] relative transition-all duration-700 flex-shrink-0">
        <div className="flex justify-between items-start mb-10">
          <div className="animate-in slide-in-from-left duration-700">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Nexus Portal</p>
            <h1 className="text-4xl font-black tracking-tighter leading-none">Hey, {user.fullName.split(' ')[0]}!</h1>
          </div>
          <div className="flex items-center space-x-3 animate-in slide-in-from-right duration-700">
            <button 
              onClick={onToggleTheme}
              className="w-11 h-11 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center transition-all spring-click border border-white/20"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              )}
            </button>
            <div className="w-14 h-14 rounded-2xl border-2 border-white/30 overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[44px] p-8 shadow-2xl relative overflow-hidden transition-all duration-700 animate-in zoom-in-95 delay-150">
          <div className="flex justify-between items-center mb-10">
            <div className="max-w-[75%]">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-2 block">Active Strategy</span>
              <h3 className="font-black text-2xl text-white tracking-tight truncate">{user.currentPlan}</h3>
            </div>
            <button onClick={() => setShowPlanSwitcher(true)} className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center transition-all spring-click hover:bg-white/50 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-5xl font-black text-white leading-none">{totalDisplayProgress}%</span>
                <span className="text-white/60 text-[10px] font-black ml-3 uppercase tracking-widest">Protocol Index</span>
              </div>
              <div className="flex space-x-1" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-6 w-1 rounded-full transition-all duration-500 ${i < Math.floor(totalDisplayProgress/20) ? 'bg-white' : 'bg-white/20'}`}></div>
                ))}
              </div>
            </div>
            <div className="h-4 bg-black/10 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-white transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
                style={{ width: `${totalDisplayProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 mt-12 mb-8 z-10 animate-in slide-in-from-bottom duration-700 delay-300">
         <div className="glass-card bg-white/10 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[28px] p-6 flex items-center justify-between border-2 border-white/20 dark:border-slate-800 shadow-[0_12px_48px_rgba(0,119,182,0.1)] relative overflow-visible">
            <div className="flex items-center space-x-6">
               <div className="relative flex items-center justify-center w-[72px] h-[72px]">
                  <div className={`absolute inset-0 rounded-full border-4 animate-pulse shadow-[0_0_25px_rgba(6,182,212,0.6)] ${latestScan?.status === 'RED' ? 'border-red-500 shadow-red-500/50' : 'border-nexus-cyan shadow-nexus-cyan/50'}`}></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="font-black text-slate-900 dark:text-white text-xl leading-none">{latestScan?.score || 85}</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">pts</span>
                  </div>
               </div>
               
               <div className="flex flex-col">
                  <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight leading-none mb-2">Last AI Scan Analysis</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse"></div>
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{latestScan?.date || '12/27/2025'}</p>
                  </div>
               </div>
            </div>
            
            <button 
              onClick={() => { clearModalState(); setScannerInitialResult(latestScan); setShowScanner(true); }} 
              className="px-5 py-3.5 bg-nexus-primary hover:bg-nexus-vibrant text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-[0_12px_24px_rgba(0,119,182,0.3)] spring-click transition-all"
            >
              Details
            </button>
         </div>
      </div>

      {/* Fix: Pass children to satisfy required prop even in error state */}
      {modalError && (
        <Modal isOpen={!!modalError} onClose={clearModalState} title="System Error" error={modalError} onRetry={clearModalState}>
          <React.Fragment />
        </Modal>
      )}

      <div className="mt-2 flex-shrink-0">
        <div className="px-8 mb-6 flex items-center justify-between">
           <span className="text-[11px] font-black uppercase tracking-[0.25em] text-nexus-primary dark:text-blue-400">Diagnostic Suite</span>
           <div className="flex-1 h-px bg-slate-100 dark:bg-slate-900 ml-4"></div>
        </div>
        
        <div className="overflow-x-auto no-scrollbar px-6 pb-2">
          <div className="grid grid-rows-2 grid-flow-col gap-x-12 gap-y-4 py-2 w-max px-2">
            {features.map((feat) => (
              <button 
                key={feat.id} 
                onClick={feat.action} 
                className="flex flex-col items-center space-y-3 w-24 spring-click group"
              >
                <div className={`w-16 h-16 ${feat.color} rounded-[24px] flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-all duration-300 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={feat.icon} />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight text-slate-500 dark:text-slate-400 text-center leading-none">{feat.label}</span>
              </button>
            ))}
            <div className="w-1 px-4"></div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-12 flex-shrink-0">
        <div 
          onClick={() => setIsTipsExpanded(!isTipsExpanded)} 
          className="flex items-center justify-between p-7 rounded-[40px] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 cursor-pointer spring-click transition-all hover:border-nexus-primary/30"
        >
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-nexus-primary rounded-[20px] flex items-center justify-center text-white shadow-xl animate-float">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Care Protocols</h2>
              <p className="text-[10px] font-bold text-nexus-primary/60 dark:text-blue-400/60 uppercase tracking-[0.2em] mt-1.5">{learnedTips.length}/10 Synchronized</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-300 dark:text-slate-700 transition-transform duration-500 ${isTipsExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className={`space-y-4 transition-all duration-700 ease-in-out overflow-hidden ${isTipsExpanded ? 'max-h-[3000px] opacity-100 py-8' : 'max-h-0 opacity-0'}`}>
          {TIPS_BY_PLAN[user.currentPlan].tips.map((tip, idx) => (
            <TipItem 
              key={tip.id} 
              tip={tip} 
              idx={idx} 
              isLearned={learnedTips.includes(tip.id)} 
              onClick={setSelectedTip} 
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-50 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 pointer-events-none">
        <button 
          onClick={() => { clearModalState(); setShowDoctorSelection(true); }} 
          className="w-full bg-nexus-vibrant text-white py-6 rounded-[32px] font-black text-xl shadow-[0_24px_48px_-12px_rgba(0,119,182,0.5)] spring-click hover:brightness-105 tracking-tight uppercase flex items-center justify-center group pointer-events-auto"
        >
          <span>Consult Specialist</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 ml-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {showDoctorSelection && (
        <DoctorSelection 
          onBack={() => setShowDoctorSelection(false)} 
          onSelect={(doctor) => {
            setSelectedDoctor(doctor);
            setShowDoctorSelection(false);
            setShowAppointmentForm(true);
          }}
        />
      )}

      <Modal isOpen={showScanner} onClose={() => setShowScanner(false)} title="AI Diagnostics">
        <DentalScanner 
          initialResult={scannerInitialResult}
          onResult={(res) => { 
            setLatestScan(res); 
            triggerConfetti(); 
          }} 
          onClose={() => setShowScanner(false)} 
          onBookEmergency={() => { setShowScanner(false); setShowDoctorSelection(true); }} 
        />
      </Modal>

      <Modal isOpen={showDentalMap} onClose={() => setShowDentalMap(false)} title="Dental Atlas">
        <DentalMap onClose={() => setShowDentalMap(false)} onBookConsultation={() => { setShowDentalMap(false); setShowDoctorSelection(true); }} />
      </Modal>

      <Modal isOpen={showRepair} onClose={() => setShowRepair(false)} title="Nexus Repair">
        <div className="space-y-8 py-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse"></div>
              <div className="relative w-full h-full bg-emerald-900/30 rounded-[40px] border-2 border-emerald-800/50 flex items-center justify-center text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tighter">
              {repairStep === 'IDLE' ? 'Structural Synchronization' : repairStep === 'PROCESSING' ? 'Molecular Realignment' : 'Repair Complete'}
            </h3>
          </div>

          {repairStep === 'IDLE' && (
            <div className="space-y-6">
              <p className="text-slate-400 font-bold text-center px-4">AI Molecular Repair will reset all dental structures recorded in your map to baseline healthy states.</p>
              <button onClick={handleAutoRepair} className="w-full blue-gradient text-white py-6 rounded-[28px] font-black text-xl shadow-xl spring-click uppercase">Initialize Repair</button>
            </div>
          )}

          {repairStep === 'PROCESSING' && (
            <div className="space-y-8">
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full blue-gradient transition-all duration-300" style={{ width: `${repairProgress}%` }}></div>
              </div>
              <p className="text-center text-[10px] font-black text-nexus-primary uppercase tracking-[0.4em] animate-pulse">Processing... {repairProgress}%</p>
            </div>
          )}

          {repairStep === 'SUCCESS' && (
            <div className="space-y-6">
              <div className="bg-emerald-900/20 p-6 rounded-[32px] border border-emerald-800/50">
                <p className="text-emerald-400 font-bold text-sm leading-relaxed text-center">Your anatomical map has been synchronized with the Nexus Health Baseline. All structures are now categorized as Optimal.</p>
              </div>
              <button onClick={() => setShowRepair(false)} className="w-full bg-white text-slate-900 py-6 rounded-[28px] font-black text-xl spring-click uppercase">Dismiss</button>
            </div>
          )}
        </div>
      </Modal>

      <Modal isOpen={showChat} onClose={() => setShowChat(false)} title="Nexus Intelligence">
         <div className="h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-5 pr-2 no-scrollbar mb-4 pb-4">
            {chatMessages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-start pt-10 text-center px-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4 text-slate-700 dark:text-sky-900/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-xs font-black uppercase tracking-widest leading-relaxed text-slate-400 dark:text-slate-500">Awaiting Command Input...<br/>Ask me about pain, cleaning, or your plan.</p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-5 rounded-[28px] shadow-sm ${msg.role === 'user' ? 'bg-nexus-primary text-white rounded-tr-none' : 'bg-slate-800 text-white rounded-tl-none border border-slate-700 shadow-lg'}`}>
                  <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                </div>
                
                {msg.role === 'ai' && msg.options && msg.options.length > 0 && i === chatMessages.length - 1 && (
                  <div className="mt-4 flex flex-wrap gap-2 w-full">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleChat(opt)}
                        disabled={isAiLoading}
                        className="px-5 py-2.5 bg-slate-900 border-2 border-nexus-primary/30 text-sky-400 rounded-full text-xs font-black uppercase tracking-tight hover:bg-nexus-primary hover:text-white transition-all spring-click"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isAiLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-5 rounded-[28px] rounded-tl-none border border-slate-700 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-nexus-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-nexus-primary rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-nexus-primary rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleChat(); }} className="relative">
            <input 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about your oral health..."
              disabled={isAiLoading}
              className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-3xl py-6 pl-6 pr-20 outline-none focus:border-nexus-primary transition-all font-bold text-white placeholder-slate-500 disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isAiLoading || !chatInput.trim()}
              className="absolute right-3 top-3 bottom-3 px-5 bg-nexus-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </Modal>

      <Modal isOpen={showTimer} onClose={() => { setShowTimer(false); resetTimer(); }} title="Care Timer">
         <div className="py-8 space-y-12">
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
              <circle 
                cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={2 * Math.PI * 110}
                strokeDashoffset={2 * Math.PI * 110 * (1 - timeLeft / 120)}
                className="text-nexus-cyan transition-all duration-1000 ease-linear"
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-6xl font-black text-white tracking-tighter">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Time Remaining</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={isTimerActive ? resetTimer : startTimer}
              className={`py-6 rounded-[28px] font-black text-xl uppercase tracking-tight shadow-xl transition-all ${isTimerActive ? 'bg-slate-800 text-slate-400' : 'blue-gradient text-white'}`}
            >
              {isTimerActive ? 'Stop' : 'Start'}
            </button>
            <button 
              onClick={resetTimer}
              className="py-6 rounded-[28px] font-black text-xl uppercase tracking-tight bg-slate-800 text-slate-500"
            >
              Reset
            </button>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-[32px] border border-slate-800">
            <p className="text-center text-xs font-bold text-slate-400 italic">"Brushing for exactly 2 minutes ensures 99% plaque removal compared to the average 45-second brush."</p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!selectedTip} onClose={() => setSelectedTip(null)} title={selectedTip?.title || ''}>
        <div className="space-y-8 py-4">
          <div className="bg-slate-900/50 p-8 rounded-[40px] border border-slate-800">
            <p className="text-lg font-bold text-slate-200 leading-relaxed mb-6">{selectedTip?.description}</p>
            <div className="flex items-center space-x-3 text-nexus-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Medical Standard Protocol</span>
            </div>
          </div>
          
          <button 
            onClick={() => selectedTip && handleMarkAsLearned(selectedTip.id)}
            disabled={learnedTips.includes(selectedTip?.id || '')}
            className={`w-full py-6 rounded-[28px] font-black text-xl uppercase tracking-tight shadow-xl transition-all ${learnedTips.includes(selectedTip?.id || '') ? 'bg-emerald-500 text-white opacity-50' : 'blue-gradient text-white'}`}
          >
            {learnedTips.includes(selectedTip?.id || '') ? 'Already Learned' : 'Mark as Learned'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={showPlanSwitcher} onClose={() => setShowPlanSwitcher(false)} title="Core Strategy">
        <div className="grid gap-3 py-4 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
          {ALL_PLAN_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => {
                onUpdateUser({ ...user, currentPlan: p });
                setShowPlanSwitcher(false);
              }}
              className={`w-full text-left p-6 rounded-[32px] border-2 transition-all spring-click flex items-center justify-between ${user.currentPlan === p ? 'border-nexus-primary bg-blue-900/10 text-blue-400' : 'border-slate-800 bg-slate-900 text-slate-500'}`}
            >
              <span className="font-black uppercase text-sm tracking-tight">{p}</span>
              {user.currentPlan === p && (
                <div className="w-6 h-6 bg-nexus-primary text-white rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </Modal>

      <Modal isOpen={showAppointmentForm} onClose={() => { setShowAppointmentForm(false); setSelectedDoctor(null); }} title="Consultation">
        <AppointmentForm 
          user={user} 
          onSuccess={() => { setShowAppointmentForm(false); triggerConfetti(); }} 
          onError={setModalError}
          selectedDoctor={selectedDoctor}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
