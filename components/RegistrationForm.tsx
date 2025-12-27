
import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile, DentalProblem } from '../types';
import { storage } from '../services/storage';
import { checkSupabaseConnection } from '../services/supabase';

interface InputGroupProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  id: string;
  autoComplete?: string;
}

const InputGroup = React.memo(({ label, value, onChange, type = "text", required = false, id, autoComplete }: InputGroupProps) => {
  return (
    <div className="relative mb-6 group">
      <input 
        id={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
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
  const [cloudStatus, setCloudStatus] = useState<{ online: boolean; message: string }>({ online: true, message: 'Checking Cloud...' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restoredUser, setRestoredUser] = useState<UserProfile | null>(null);

  // Check cloud connectivity and existing users
  useEffect(() => {
    const diagnostic = async () => {
      const res = await checkSupabaseConnection();
      setCloudStatus({ online: res.success, message: res.message });
      
      if (formData.mobile.length >= 10 && res.success) {
        const profile = await storage.restoreFromCloud(formData.mobile);
        if (profile) {
          setRestoredUser(profile);
          // Auto-fill form with cloud data if found
          setFormData(profile);
        } else {
          setRestoredUser(null);
        }
      }
    };
    diagnostic();
  }, [formData.mobile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (restoredUser) {
      setIsSubmitting(true);
      await storage.setUserProfile(restoredUser);
      onRegister(restoredUser);
      return;
    }

    // Register Mode
    if (!formData.fullName || !formData.mobile || formData.age <= 0) {
      alert("Please ensure all profile fields are correctly filled.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onRegister(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMobileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, mobile: e.target.value }));
  }, []);

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-6 flex flex-col items-center py-10 animate-in fade-in duration-1000 bg-white dark:bg-slate-950 transition-colors" role="main">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[44px] p-8 sm:p-10 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.12)] border border-slate-50 dark:border-slate-800 relative overflow-hidden flex-shrink-0 mb-10">
        
        {/* Cloud Status Badge */}
        <div className={`absolute top-6 right-8 flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all ${cloudStatus.online ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
           <div className={`w-2 h-2 rounded-full animate-pulse ${cloudStatus.online ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
           <span className="text-[9px] font-black uppercase tracking-widest">{cloudStatus.message}</span>
        </div>

        <div className="text-center mb-10 relative z-10 pt-4">
          <div className="w-20 h-20 blue-gradient mx-auto rounded-[28px] flex items-center justify-center mb-6 shadow-2xl relative">
             {isSubmitting ? (
               <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
             ) : (
               <div className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
               </div>
             )}
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            {restoredUser ? 'Account Found' : 'Nexus Identity'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] mt-3 uppercase tracking-[0.3em]">
            {restoredUser ? `Welcome back, ${restoredUser.fullName.split(' ')[0]}` : 'Secure Clinical Registration'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 relative z-10">
          <InputGroup 
            id="patient-mobile" 
            label="Mobile Number" 
            type="tel" 
            value={formData.mobile} 
            onChange={handleMobileChange} 
            placeholder=" " 
            required 
            autoComplete="tel"
          />

          <div className={`transition-all duration-500 overflow-hidden ${restoredUser ? 'max-h-0 opacity-0 mb-0' : 'max-h-[800px] opacity-100 mb-6'}`}>
            <InputGroup 
              id="patient-name" 
              label="Patient Name" 
              value={formData.fullName} 
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))} 
              placeholder=" " 
              required={!restoredUser}
              autoComplete="name"
            />
            
            <div className="grid grid-cols-2 gap-4 items-end">
              <InputGroup 
                id="patient-age" 
                label="Age" 
                type="number" 
                value={formData.age} 
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))} 
                placeholder=" " 
                required={!restoredUser}
              />
              <fieldset className="bg-slate-50/50 dark:bg-slate-800/30 p-2 rounded-[24px] mb-6 flex border-2 border-slate-100 dark:border-slate-800 relative h-[78px]">
                 {['Male', 'Female'].map((g) => (
                   <button
                     key={g}
                     type="button"
                     onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                     className={`flex-1 flex items-center justify-center font-black text-[11px] uppercase transition-all rounded-[18px] ${formData.gender === g ? 'bg-white dark:bg-slate-700 shadow-md text-nexus-primary' : 'text-slate-500'}`}
                   >
                     {g}
                   </button>
                 ))}
              </fieldset>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-nexus-primary uppercase text-[10px] font-black tracking-[0.2em] ml-1">Care Focus</h3>
              <div className="grid grid-cols-3 gap-3">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, currentPlan: p.id }))}
                    className={`flex flex-col items-center justify-center py-4 px-2 rounded-[24px] border-2 transition-all ${formData.currentPlan === p.id ? 'border-nexus-primary bg-blue-50 text-nexus-primary shadow-lg' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500'}`}
                  >
                    <span className="text-xl mb-1">{p.icon}</span>
                    <span className="font-black text-[9px] uppercase tracking-tight text-center leading-none">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting || !cloudStatus.online}
              className="w-full blue-gradient text-white py-6 rounded-squircle font-black text-xl shadow-xl spring-click hover:brightness-110 tracking-tight uppercase disabled:opacity-50 disabled:grayscale flex items-center justify-center space-x-3"
            >
              <span>{isSubmitting ? 'Syncing...' : (restoredUser ? 'Access Account' : 'Initialize Nexus')}</span>
            </button>
          </div>
        </form>
      </div>
      <div className="h-8 flex-shrink-0" />
    </div>
  );
};

export default RegistrationForm;
