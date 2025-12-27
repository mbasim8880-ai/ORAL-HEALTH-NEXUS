
import React, { useState, useCallback } from 'react';
import { UserProfile, DentalProblem } from '../types';

interface InputGroupProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  id: string;
}

const InputGroup = React.memo(({ label, value, onChange, type = "text", required = false, id }: InputGroupProps) => {
  return (
    <div className="relative mb-6 group">
      <input 
        id={id}
        type={type}
        required={required}
        className="w-full pt-9 pb-3 px-7 bg-slate-50/50 dark:bg-slate-800/30 border-2 border-slate-100 dark:border-slate-800 rounded-[24px] outline-none focus:border-nexus-primary focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_16px_32px_-8px_rgba(0,119,182,0.15)] transition-all font-bold placeholder-transparent text-slate-800 dark:text-slate-100"
        placeholder=" "
        value={value === 0 ? '' : value}
        onChange={onChange}
      />
      <label 
        htmlFor={id}
        className="absolute left-7 top-4 text-slate-500 pointer-events-none transition-all duration-300 uppercase text-[10px] font-black tracking-[0.2em] group-focus-within:text-nexus-primary"
      >
        {label}
      </label>
    </div>
  );
});

const PLANS: { id: DentalProblem; label: string; icon: string }[] = [
  { id: 'General Care', label: 'General', icon: '✨' },
  { id: 'Tooth Pain', label: 'Pain', icon: '⚡' },
  { id: 'Gum Bleeding', label: 'Gum', icon: '🩸' },
  { id: 'Sensitivity', label: 'Sensitivity', icon: '❄️' },
  { id: 'Crown', label: 'Crowns', icon: '👑' },
  { id: 'Bridges', label: 'Bridges', icon: '🌉' },
  { id: 'Post extraction care', label: 'Extraction', icon: '🩹' },
  { id: 'Implant', label: 'Implants', icon: '🔩' },
  { id: 'Braces', label: 'Braces', icon: '🦷' }
];

interface Props {
  onRegister: (profile: UserProfile) => void;
}

const RegistrationForm: React.FC<Props> = ({ onRegister }) => {
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    age: 0,
    gender: 'Male',
    mobile: '',
    currentPlan: 'General Care'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobile || formData.age <= 0) {
      alert("Please ensure all fields are correctly filled.");
      return;
    }
    onRegister(formData);
  };

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, fullName: e.target.value }));
  }, []);

  const handleAgeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setFormData(prev => ({ ...prev, age: val }));
  }, []);

  const handleMobileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, mobile: e.target.value }));
  }, []);

  const selectGender = useCallback((g: string) => {
    setFormData(prev => ({ ...prev, gender: g }));
  }, []);

  const selectPlan = useCallback((p: DentalProblem) => {
    setFormData(prev => ({ ...prev, currentPlan: p }));
  }, []);

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-6 flex flex-col items-center py-10 animate-in fade-in duration-1000 bg-white dark:bg-slate-950 transition-colors" role="main">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[44px] p-8 sm:p-10 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.12)] border border-slate-50 dark:border-slate-800 relative overflow-hidden flex-shrink-0 mb-10">
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 blue-gradient mx-auto rounded-[28px] flex items-center justify-center mb-6 shadow-2xl relative" aria-hidden="true">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Setup Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[11px] mt-3 uppercase tracking-[0.3em]">Initialize Nexus Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 relative z-10">
          <InputGroup 
            id="patient-name" 
            label="Patient Name" 
            value={formData.fullName} 
            onChange={handleNameChange} 
            placeholder=" " 
            required 
          />
          
          <div className="grid grid-cols-2 gap-4 items-end">
            <InputGroup 
              id="patient-age" 
              label="Age" 
              type="number" 
              value={formData.age} 
              onChange={handleAgeChange} 
              placeholder=" " 
              required 
            />
            <fieldset className="bg-slate-50/50 dark:bg-slate-800/30 p-2 rounded-[24px] mb-6 flex border-2 border-slate-100 dark:border-slate-800 relative h-[78px]">
               <legend className="sr-only">Gender Selection</legend>
               {['Male', 'Female'].map((g) => (
                 <button
                   key={g}
                   type="button"
                   onClick={() => selectGender(g)}
                   aria-pressed={formData.gender === g}
                   className={`flex-1 flex items-center justify-center font-black text-[11px] uppercase transition-all rounded-[18px] focus:ring-2 focus:ring-nexus-primary outline-none ${formData.gender === g ? 'bg-white dark:bg-slate-700 shadow-md text-nexus-primary dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                 >
                   {g}
                 </button>
               ))}
            </fieldset>
          </div>

          <InputGroup 
            id="patient-mobile" 
            label="Mobile Number" 
            type="tel" 
            value={formData.mobile} 
            onChange={handleMobileChange} 
            placeholder=" " 
            required 
          />

          <div className="space-y-4 pt-4">
            <h3 className="text-nexus-primary dark:text-blue-400 uppercase text-[10px] font-black tracking-[0.2em] ml-1">Core Health Focus</h3>
            <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Select your dental plan">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPlan(p.id)}
                  aria-pressed={formData.currentPlan === p.id}
                  className={`flex flex-col items-center justify-center py-4 px-2 rounded-[24px] border-2 transition-all spring-click focus:ring-4 focus:ring-blue-500/20 outline-none ${formData.currentPlan === p.id ? 'border-nexus-primary bg-blue-50 dark:bg-blue-900/20 text-nexus-primary dark:text-blue-400 shadow-lg' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-100 dark:hover:border-slate-600'}`}
                >
                  <span className="text-xl mb-1">{p.icon}</span>
                  <span className="font-black text-[9px] uppercase tracking-tight text-center leading-none">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-10">
            <button 
              type="submit" 
              className="w-full blue-gradient text-white py-6 rounded-squircle font-black text-xl shadow-[0_24px_48px_-12px_rgba(0,119,182,0.4)] spring-click hover:brightness-110 tracking-tight uppercase group flex items-center justify-center focus:ring-4 focus:ring-blue-500/50 outline-none"
            >
              <span>Launch Nexus</span>
            </button>
          </div>
        </form>
      </div>
      {/* Visual buffer at the bottom of the scrollable container */}
      <div className="h-8 flex-shrink-0" />
    </div>
  );
};

export default RegistrationForm;
