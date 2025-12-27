import React, { useState, useMemo } from 'react';
import { ToothStatus, ToothIssue } from '../types.ts';
import { storage } from '../services/storage.ts';

interface Props {
  onClose: () => void;
  onBookConsultation: () => void;
}

const ISSUE_OPTIONS: ToothIssue[] = [
  'Cavity / Decay',
  'Gum Bleeding',
  'Sensitivity',
  'Sharp Pain',
  'Broken / Chipped'
];

interface Solution {
  action: string;
  homeCare: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  label: string;
}

const GET_ISSUE_SOLUTION = (issue: ToothIssue, severity: number): Solution => {
  if (issue === 'Cavity / Decay') {
    if (severity < 40) return { 
      label: 'LOW PRIORITY',
      action: 'Remineralization Therapy', 
      homeCare: 'Use high-fluoride toothpaste (5000ppm) and increase flossing frequency.', 
      urgency: 'Low' 
    };
    if (severity < 75) return { 
      label: 'MEDIUM PRIORITY',
      action: 'Composite Resin Restoration', 
      homeCare: 'Avoid fermentable carbohydrates; schedule filling within 2 weeks.', 
      urgency: 'Medium' 
    };
    return { 
      label: 'HIGH PRIORITY',
      action: 'Endodontic Evaluation / Crown', 
      homeCare: 'Avoid pressure on the tooth; risk of pulp infection is high.', 
      urgency: 'High' 
    };
  }

  if (issue === 'Gum Bleeding') {
    if (severity < 40) return { 
      label: 'LOW PRIORITY',
      action: 'Prophylaxis & OHI Refinement', 
      homeCare: 'Warm salt water rinses; use extra-soft bristles and interdental brushes.', 
      urgency: 'Low' 
    };
    if (severity < 75) return { 
      label: 'MEDIUM PRIORITY',
      action: 'Scaling & Root Planing (SRP)', 
      homeCare: 'Use antiseptic mouthwash (Chlorhexidine); target Vitamin C intake.', 
      urgency: 'Medium' 
    };
    return { 
      label: 'HIGH PRIORITY',
      action: 'Periodontal Surgical Consult', 
      homeCare: 'Deep infection suspected. Risk of bone loss. Professional intervention required.', 
      urgency: 'High' 
    };
  }

  if (issue === 'Sensitivity') {
    if (severity < 40) return { 
      label: 'LOW PRIORITY',
      action: 'Stannous Fluoride Application', 
      homeCare: 'Switch to potassium nitrate toothpaste; avoid ice-cold beverages.', 
      urgency: 'Low' 
    };
    if (severity < 75) return { 
      label: 'MEDIUM PRIORITY',
      action: 'Gingival Recession Bonding', 
      homeCare: 'Use a straw for acidic drinks; apply desensitizing gel before bed.', 
      urgency: 'Medium' 
    };
    return { 
      label: 'HIGH PRIORITY',
      action: 'Pulp Vitality Testing', 
      homeCare: 'Persistent nerve inflammation suspected. Avoid extreme thermal changes.', 
      urgency: 'High' 
    };
  }

  if (issue === 'Sharp Pain') {
    if (severity < 50) return { 
      label: 'HIGH PRIORITY',
      action: 'Emergency Diagnostic X-Ray', 
      homeCare: 'Take OTC anti-inflammatories; avoid chewing on the affected side.', 
      urgency: 'High' 
    };
    return { 
      label: 'EMERGENCY',
      action: 'Urgent Pulpectomy (Root Canal)', 
      homeCare: 'Signs of irreversible pulpitis. Keep head elevated to reduce throbbing.', 
      urgency: 'Emergency' 
    };
  }

  if (issue === 'Broken / Chipped') {
    if (severity < 30) return { 
      label: 'LOW PRIORITY',
      action: 'Enamel Contouring', 
      homeCare: 'Cover sharp edges with dental wax to prevent soft tissue laceration.', 
      urgency: 'Low' 
    };
    if (severity < 75) return { 
      label: 'MEDIUM PRIORITY',
      action: 'Full-Coverage Bonding / Inlay', 
      homeCare: 'Avoid hard or sticky foods. Seal the dentin as soon as possible.', 
      urgency: 'Medium' 
    };
    return { 
      label: 'EMERGENCY',
      action: 'Core Buildup / Crown Consult', 
      homeCare: 'Severe structural loss. If the fragment is kept, place it in milk.', 
      urgency: 'Emergency' 
    };
  }

  return { 
    label: 'GENERAL CARE',
    action: 'Standard Clinical Exam', 
    homeCare: 'Continue daily brushing and flossing protocols.', 
    urgency: 'Low' 
  };
};

const DentalMap: React.FC<Props> = ({ onClose, onBookConsultation }) => {
  const [dentalData, setDentalData] = useState<Record<string, ToothStatus>>(storage.getDentalMap());
  const [selectedToothId, setSelectedToothId] = useState<string | null>(null);
  const [step, setStep] = useState<'IDLE' | 'ISSUE' | 'SEVERITY' | 'RESULT'>('IDLE');
  const [pendingIssue, setPendingIssue] = useState<ToothIssue | null>(null);
  const [pendingSeverity, setPendingSeverity] = useState<number>(50);

  const teethLayout = useMemo(() => {
    const layout: { id: string, x: number, y: number, width: number, height: number, type: 'MOLAR' | 'INCISOR' }[] = [];
    
    // Upper Arch (T1 - T16)
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * (i + 0.5)) / 16;
      const x = 150 - Math.cos(angle) * 115;
      const y = 140 - Math.sin(angle) * 85;
      const isFront = i >= 6 && i <= 9;
      layout.push({
        id: `T${i + 1}`,
        x, y,
        width: isFront ? 14 : 20,
        height: isFront ? 24 : 20,
        type: isFront ? 'INCISOR' : 'MOLAR'
      });
    }

    // Lower Arch (T32 - T17)
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * (i + 0.5)) / 16;
      const x = 150 - Math.cos(angle) * 105;
      const y = 210 + Math.sin(angle) * 75;
      const isFront = i >= 6 && i <= 9;
      layout.push({
        id: `T${32 - i}`,
        x, y,
        width: isFront ? 12 : 18,
        height: isFront ? 22 : 18,
        type: isFront ? 'INCISOR' : 'MOLAR'
      });
    }
    return layout;
  }, []);

  const handleToothClick = (id: string) => {
    setSelectedToothId(id);
    setStep('ISSUE');
  };

  const handleToothKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToothClick(id);
    }
  };

  const handleIssueSelect = (issue: ToothIssue) => {
    setPendingIssue(issue);
    setStep('SEVERITY');
  };

  const getToothGradientId = (status?: ToothStatus) => {
    if (!status || status.issue === 'None') return 'url(#gradHealthy)';
    if (status.severity >= 80) return 'url(#gradAcute)';
    if (status.severity >= 50) return 'url(#gradMid)';
    if (status.severity >= 20) return 'url(#gradMild)';
    return 'url(#gradHealthy)';
  };

  const saveAssessment = () => {
    if (selectedToothId && pendingIssue) {
      const newStatus: ToothStatus = { id: selectedToothId, issue: pendingIssue, severity: pendingSeverity };
      storage.saveToothStatus(newStatus);
      setDentalData(storage.getDentalMap());
      setStep('RESULT');
    }
  };

  const solution = pendingIssue ? GET_ISSUE_SOLUTION(pendingIssue, pendingSeverity) : null;

  return (
    <div className="h-full flex flex-col bg-white rounded-[40px] overflow-hidden min-h-[550px] stagger-fade-in relative">
      {/* Assessment UI */}
      {selectedToothId && step !== 'IDLE' && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6" role="none">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setStep('IDLE')} aria-hidden="true"></div>
          <div 
            className="relative w-full max-w-sm bg-white rounded-t-[40px] sm:rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assessment-title"
          >
            {step === 'ISSUE' && (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Select Condition</span>
                  <h3 id="assessment-title" className="text-2xl font-black text-slate-900 mt-1">Tooth #{selectedToothId.substring(1)}</h3>
                </div>
                <div className="grid gap-2">
                  {ISSUE_OPTIONS.map((opt) => (
                    <button key={opt} onClick={() => handleIssueSelect(opt)} className="w-full text-left p-4 rounded-2xl border-2 border-slate-50 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-slate-700 spring-click focus:ring-2 focus:ring-blue-500 outline-none">
                      {opt}
                    </button>
                  ))}
                  <button onClick={() => {
                    storage.saveToothStatus({ id: selectedToothId!, issue: 'None', severity: 0 });
                    setDentalData(storage.getDentalMap());
                    setStep('IDLE');
                  }} className="w-full text-center p-4 mt-2 text-red-500 font-black text-[10px] uppercase tracking-widest focus:underline outline-none">Mark as Healthy</button>
                </div>
              </div>
            )}

            {step === 'SEVERITY' && (
              <div className="space-y-8">
                <div className="text-center">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{pendingIssue}</span>
                  <h3 id="assessment-title" className="text-2xl font-black text-slate-900 mt-1">Severity Level</h3>
                </div>
                <div className="space-y-6">
                  <label htmlFor="severity-slider" className="sr-only">Adjust Severity Level</label>
                  <input id="severity-slider" type="range" min="20" max="100" step="10" value={pendingSeverity} onChange={(e) => setPendingSeverity(parseInt(e.target.value))} className="w-full h-4 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:ring-2 focus:ring-blue-500 outline-none" />
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 px-1" aria-hidden="true">
                    <span>Mild</span>
                    <span>Mod</span>
                    <span>High</span>
                    <span>Alert</span>
                  </div>
                  <div className="text-center text-6xl font-black text-slate-900" aria-live="polite">{pendingSeverity}%</div>
                </div>
                <button onClick={saveAssessment} className="w-full blue-gradient text-white py-5 rounded-2xl font-black text-lg spring-click uppercase shadow-lg focus:ring-2 focus:ring-blue-500 outline-none">Generate Plan</button>
              </div>
            )}

            {step === 'RESULT' && solution && (
              <div className="space-y-6">
                <div className={`px-4 py-2 rounded-full inline-block text-[10px] font-black uppercase tracking-widest transition-colors ${solution.urgency === 'Emergency' ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
                  {solution.label}
                </div>
                <div className="text-left">
                  <h3 id="assessment-title" className="text-2xl font-black text-slate-900 tracking-tighter">AI Diagnosis</h3>
                  <p className="text-slate-500 font-bold text-[10px] uppercase mt-1">Tooth #{selectedToothId!.substring(1)} • {pendingIssue}</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                    <p className="text-[9px] font-black text-blue-500 uppercase mb-2 tracking-widest">Clinical Action</p>
                    <p className="text-slate-800 font-bold text-base leading-snug">{solution.action}</p>
                  </div>
                  <div className="bg-blue-50/50 p-6 rounded-[24px] border border-blue-100">
                    <p className="text-[9px] font-black text-indigo-500 uppercase mb-2 tracking-widest">Home Support</p>
                    <p className="text-slate-700 font-medium text-sm italic leading-relaxed">"{solution.homeCare}"</p>
                  </div>
                </div>
                <div className="grid gap-3 pt-4">
                  <button onClick={onBookConsultation} className="w-full blue-gradient text-white py-6 rounded-[24px] font-black text-xl shadow-xl spring-click uppercase tracking-tight focus:ring-2 focus:ring-blue-500 outline-none">Book Appointment</button>
                  <button onClick={() => setStep('IDLE')} className="w-full text-slate-500 font-black text-[10px] uppercase py-3 text-center tracking-widest focus:underline outline-none">Return to Map</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Map View */}
      <div className="flex-1 flex flex-col p-8 space-y-4" role="main">
        <div className="text-center mb-4">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Mouth Diagnostic</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Anatomical Arch</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Select a tooth for health tracking</p>
        </div>

        {/* Anatomical SVG Arch */}
        <div className="flex-1 flex items-center justify-center relative min-h-[350px]">
          <svg 
            viewBox="0 0 300 400" 
            className="w-full h-full max-w-[340px] drop-shadow-xl overflow-visible"
            role="img"
            aria-label="Interactive Dental Map showing all 32 teeth. Use Tab to navigate and Enter to select a tooth."
          >
            <defs>
              {/* Healthy gradient */}
              <linearGradient id="gradHealthy" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F8FAFC" />
              </linearGradient>
              {/* Mild issues gradient (Yellow) */}
              <linearGradient id="gradMild" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
              {/* Mid issues gradient (Orange) */}
              <linearGradient id="gradMid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFEDD5" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
              {/* Acute issues gradient (Red) */}
              <linearGradient id="gradAcute" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEE2E2" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
              {/* Gum gradient */}
              <radialGradient id="gumGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#FFB7B2" />
                <stop offset="100%" stopColor="#FF8E8E" />
              </radialGradient>

              <filter id="toothShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="2" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.2" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Gingival Arches (Gums) */}
            <path d="M30,145 Q150,5 270,145" fill="none" stroke="url(#gumGradient)" strokeWidth="35" strokeLinecap="round" opacity="0.3" aria-hidden="true" />
            <path d="M40,205 Q150,335 260,205" fill="none" stroke="url(#gumGradient)" strokeWidth="30" strokeLinecap="round" opacity="0.3" aria-hidden="true" />

            {teethLayout.map((tooth) => {
              const status = dentalData[tooth.id];
              const isSelected = selectedToothId === tooth.id;
              const fillGrad = getToothGradientId(status);
              const toothLabel = `Tooth ${tooth.id.substring(1)}: ${status?.issue || 'Healthy'}`;
              
              return (
                <g 
                  key={tooth.id} 
                  onClick={() => handleToothClick(tooth.id)} 
                  onKeyDown={(e) => handleToothKeyDown(e, tooth.id)}
                  className="cursor-pointer transition-all duration-300 focus:outline-none group/tooth"
                  style={{ filter: isSelected ? 'url(#toothShadow)' : 'none' }}
                  role="button"
                  tabIndex={0}
                  aria-label={toothLabel}
                  aria-pressed={isSelected}
                >
                  <rect
                    x={tooth.x - tooth.width / 2}
                    y={tooth.y - tooth.height / 2}
                    width={tooth.width}
                    height={tooth.height}
                    rx={tooth.type === 'INCISOR' ? 4 : 8}
                    fill={fillGrad}
                    stroke={isSelected ? '#0077B6' : (status?.issue && status.issue !== 'None' ? 'rgba(0,0,0,0.1)' : '#F1F5F9')}
                    strokeWidth={isSelected ? 3 : 1}
                    className="transition-all duration-300 transform-gpu group-hover/tooth:scale-110 group-focus/tooth:stroke-blue-500 group-focus/tooth:stroke-[3px]"
                  />
                  <text
                    x={tooth.x}
                    y={tooth.y + 2}
                    textAnchor="middle"
                    fontSize="7"
                    fontFamily="Plus Jakarta Sans"
                    fontWeight="800"
                    fill={fillGrad === 'url(#gradHealthy)' ? '#94A3B8' : 'rgba(0,0,0,0.5)'}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                    aria-hidden="true"
                  >
                    {tooth.id.substring(1)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex justify-between items-center mt-4" aria-label="Health Legend">
          {[
            { label: 'Healthy', color: 'bg-white border border-slate-200' },
            { label: 'Mild', color: 'bg-yellow-400' },
            { label: 'Mid', color: 'bg-orange-500' },
            { label: 'Acute', color: 'bg-red-500' }
          ].map(item => (
            <div key={item.label} className="flex items-center space-x-1.5">
              <div className={`w-3.5 h-3.5 rounded-full shadow-sm ${item.color}`} aria-hidden="true"></div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex space-x-3 pt-6">
          <button onClick={() => { if(confirm("Reset all tooth health data?")) { storage.clearDentalMap(); setDentalData({}); } }} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest spring-click focus:ring-2 focus:ring-slate-300 outline-none">Clear Arch</button>
          <button onClick={onClose} className="flex-1 blue-gradient text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg spring-click focus:ring-2 focus:ring-blue-500 outline-none">Save Scan</button>
        </div>
      </div>
    </div>
  );
};

export default DentalMap;