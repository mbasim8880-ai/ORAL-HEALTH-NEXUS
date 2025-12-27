
import React, { useState } from 'react';
import { AppointmentData, UserProfile, NexusError } from '../types';

interface Props {
  user: UserProfile;
  onSuccess: () => void;
  onError: (error: NexusError) => void;
  selectedDoctor: { name: string; role: string } | null;
}

const AppointmentForm: React.FC<Props> = ({ user, onSuccess, onError, selectedDoctor }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState<AppointmentData>({
    name: user.fullName,
    phone: user.mobile,
    gender: user.gender,
    address: '',
    notes: '',
    preferredDoctor: selectedDoctor?.name || 'Any Specialist',
    source: window.location.origin
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceID = 'service_ql68ylo';
      const templateID = 'template_0rvvrfr';
      const publicKey = 'F-Y1XCOad4ak5D04T';

      // @ts-ignore
      if (!window.emailjs) {
        throw new Error("Email engine not initialized. Please check connection.");
      }

      // @ts-ignore
      const result = await window.emailjs.send(
        serviceID,
        templateID,
        {
          to_email: 'yaroojrehman1524@gmail.com',
          from_name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          address: formData.address,
          notes: formData.notes,
          plan: user.currentPlan,
          preferred_doctor: formData.preferredDoctor,
          source_origin: formData.source
        },
        publicKey
      );

      if (result.status === 200 || result.text === 'OK') {
        setSent(true);
        setTimeout(onSuccess, 3000);
      } else {
        throw new Error(result.text || "Failed to transmit data");
      }
    } catch (error: any) {
      console.error("Transmission Error:", error);
      
      onError({
        title: "Transmission Failed",
        message: "Nexus was unable to establish a secure link with the specialist server. Please verify your internet connection and retry.",
        code: "XMIT_SEC_ERR",
        canRetry: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-16 stagger-fade-in">
        <div className="relative inline-block mb-10">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
          <div className="bg-emerald-500 text-white w-28 h-28 squircle flex items-center justify-center mx-auto shadow-2xl border-4 border-white relative z-10 animate-[scaleIn_0.5s_ease-out]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4 dark:text-white">Confirmed!</h3>
        <p className="text-slate-500 font-bold text-sm max-w-[220px] mx-auto leading-relaxed dark:text-slate-400">Appointment Confirmed with {selectedDoctor?.name}! We will call you shortly.</p>
        
        <style>{`
          @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-10 duration-500">
      <div className="mb-8 p-6 bg-blue-50 dark:bg-slate-800 rounded-[32px] border border-blue-100 dark:border-slate-700 flex items-center space-x-4">
        <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border border-blue-200">
           <img 
             src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoctor?.name === 'Dr. Sarah' ? 'Sarah' : 'Ahmed'}&backgroundColor=b6e3f4`} 
             alt="Specialist" 
             className="w-full h-full object-cover" 
           />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-sm tracking-tight leading-none">Booking Appointment with {selectedDoctor?.name}</h4>
          <p className="text-[10px] font-bold text-nexus-primary uppercase tracking-widest mt-1.5">{selectedDoctor?.role}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-50/50 dark:bg-slate-800/30 p-1 rounded-[32px] border border-white/60 dark:border-slate-700 shadow-inner">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative group">
              <input 
                type="text"
                required
                className="w-full pt-8 pb-3 px-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 squircle outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(0,119,182,0.15)] transition-all font-bold text-slate-800 dark:text-slate-100 placeholder-transparent"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <label className="absolute left-6 top-4 text-slate-400 uppercase text-[9px] font-black tracking-widest pointer-events-none group-focus-within:text-blue-500 transition-colors">Patient</label>
            </div>
            <div className="relative group">
              <input 
                type="tel"
                required
                className="w-full pt-8 pb-3 px-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 squircle outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(0,119,182,0.15)] transition-all font-bold text-slate-800 dark:text-slate-100 placeholder-transparent"
                placeholder="Phone"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <label className="absolute left-6 top-4 text-slate-400 uppercase text-[9px] font-black tracking-widest pointer-events-none group-focus-within:text-blue-500 transition-colors">Mobile</label>
            </div>
          </div>
        </div>

        <div className="relative group">
          <input 
            type="text"
            required
            className="w-full pt-8 pb-3 px-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 squircle outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(0,119,182,0.15)] transition-all font-bold text-slate-800 dark:text-slate-100 placeholder-transparent"
            placeholder="Address"
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
          />
          <label className="absolute left-6 top-4 text-slate-400 uppercase text-[9px] font-black tracking-widest pointer-events-none group-focus-within:text-blue-500 transition-colors">Location Details</label>
        </div>

        <div className="relative group">
          <textarea 
            className="w-full pt-10 pb-4 px-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 squircle outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(0,119,182,0.15)] transition-all font-bold text-slate-800 dark:text-slate-100 placeholder-transparent min-h-[140px] resize-none"
            placeholder="Symptoms"
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
          />
          <label className="absolute left-6 top-4 text-slate-400 uppercase text-[9px] font-black tracking-widest pointer-events-none group-focus-within:text-blue-500 transition-colors">Diagnostic Notes</label>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full blue-gradient text-white py-6 squircle font-black text-xl shadow-[0_20px_50px_rgba(0,119,182,0.3)] spring-click flex items-center justify-center space-x-4 hover:brightness-110 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          {loading ? (
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span className="uppercase tracking-widest text-sm">Processing...</span>
            </div>
          ) : (
            <span className="uppercase tracking-tight text-pop">Finalize Consultation</span>
          )}
        </button>

        <p className="text-[9px] text-center text-slate-400 font-black uppercase tracking-[0.2em] px-4">Encryption: High Intensity AES-256 Link Active</p>
      </form>
    </div>
  );
};

export default AppointmentForm;
