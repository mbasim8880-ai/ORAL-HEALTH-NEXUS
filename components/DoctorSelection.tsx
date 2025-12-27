
import React from 'react';

interface Doctor {
  id: string;
  name: string;
  role: string;
  avatarSeed: string;
  gender: 'female' | 'male';
}

const DOCTORS: Doctor[] = [
  { 
    id: 'sarah', 
    name: 'Dr. Sarah', 
    role: 'General Dentist', 
    avatarSeed: 'Sarah', 
    gender: 'female'
  },
  { 
    id: 'ahmed', 
    name: 'Dr. Ahmed', 
    role: 'Oral Surgeon', 
    avatarSeed: 'Ahmed', 
    gender: 'male'
  }
];

interface Props {
  onSelect: (doctor: Doctor) => void;
  onBack: () => void;
}

const DoctorSelection: React.FC<Props> = ({ onSelect, onBack }) => {
  return (
    <div className="fixed inset-0 z-[150] bg-white dark:bg-slate-950 overflow-hidden flex flex-col animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="p-8 pb-12 text-center relative">
        <button 
          onClick={onBack}
          className="absolute top-10 left-8 p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400 hover:text-nexus-primary transition-all spring-click border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="pt-16 space-y-4">
          <p className="text-nexus-primary dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.5em] animate-in slide-in-from-top duration-700">Medical Network</p>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none animate-in slide-in-from-top duration-700 delay-75">Select Specialist</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-xs mx-auto animate-in slide-in-from-top duration-700 delay-150">Our expert clinicians are ready to analyze your Nexus diagnostic data.</p>
        </div>
      </div>

      {/* Specialist Grid */}
      <div className="flex-1 px-8 pb-20 overflow-y-auto no-scrollbar">
        <div className="max-w-md mx-auto space-y-6">
          {DOCTORS.map((doc, idx) => (
            <div 
              key={doc.id}
              onClick={() => onSelect(doc)}
              className="group relative bg-slate-50 dark:bg-slate-900/50 rounded-[44px] p-8 border-2 border-transparent hover:border-nexus-primary hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 spring-click cursor-pointer shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,119,182,0.15)] overflow-hidden animate-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${200 + idx * 100}ms` }}
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex items-center space-x-8 relative z-10">
                <div className="w-24 h-24 rounded-[28px] bg-white dark:bg-slate-800 shadow-xl border-4 border-white dark:border-slate-700 overflow-hidden flex-shrink-0 group-hover:rotate-3 transition-transform duration-500">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.avatarSeed}&backgroundColor=b6e3f4`} 
                    alt={doc.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <span className="text-nexus-primary dark:text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mb-2 block">{doc.role}</span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">{doc.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Now</span>
                  </div>
                </div>

                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-nexus-primary transition-colors border border-slate-100 dark:border-slate-700">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                   </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Hint */}
      <div className="p-8 text-center animate-in fade-in duration-1000 delay-500">
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Encrypted Nexus Specialist Link</p>
      </div>
    </div>
  );
};

export default DoctorSelection;
