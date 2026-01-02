
import React, { useState, useRef } from 'react';
import { ScanResult, NexusError } from '../types.ts';
import { storage } from '../services/storage.ts';
import { GoogleGenAI, Type } from '@google/genai';
import { mapError } from '../services/errorMapper';

interface Props {
  onResult: (result: ScanResult) => void;
  onBookEmergency: () => void;
  onClose: () => void;
  initialResult?: ScanResult | null;
}

const DentalScanner: React.FC<Props> = ({ onResult, onBookEmergency, onClose, initialResult }) => {
  const [step, setStep] = useState<'IDLE' | 'PREVIEW' | 'PROCESSING' | 'RESULT'>(initialResult ? 'RESULT' : 'IDLE');
  const [scanResult, setScanResult] = useState<ScanResult | null>(initialResult || null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [processText, setProcessText] = useState('Initializing Vision System...');
  const [error, setError] = useState<NexusError | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] || '');
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      try {
        const base64Data = await fileToBase64(file);
        setPreviewImg(`data:${file.type};base64,${base64Data}`);
        setMimeType(file.type);
        setStep('PREVIEW');
      } catch (err) {
        setError(mapError(err, 'AI'));
      }
    }
  };

  const startAiScanning = async () => {
    if (!previewImg) return;
    const base64Data = previewImg.split(',')[1];
    
    setStep('PROCESSING');
    setError(null);
    
    const steps = [
      "Calibrating Neural Feed...",
      "Segmenting Enamel Geometry...",
      "Detecting Microbial Biomarkers...",
      "Analyzing Structural Integrity...",
      "Synthesizing Diagnostic Report..."
    ];

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      setProcessText(steps[stepIdx % steps.length]);
      stepIdx++;
    }, 1200);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: "Perform a Professional Dental Audit. Provide a short Title. In the 'message', explain findings in simple patient terms. Focus on next steps. Provide scores (0-100) for 'hygiene', 'gum_health', and 'structural_integrity'. Return JSON." }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, enum: ['GREEN', 'YELLOW', 'RED'] },
              title: { type: Type.STRING },
              message: { type: Type.STRING },
              score: { type: Type.NUMBER },
              hygiene_score: { type: Type.NUMBER },
              gum_health_score: { type: Type.NUMBER },
              structural_integrity_score: { type: Type.NUMBER }
            }
          }
        }
      });

      const resultData = JSON.parse(response.text || '{}');

      const finalResult: ScanResult = {
        status: (resultData.status || 'GREEN') as any,
        title: resultData.title || 'Oral Health Scan',
        message: resultData.message || 'Analysis complete. Your oral health baseline is being established.',
        date: new Date().toLocaleDateString(),
        score: resultData.score || 85,
        breakdown: {
          hygiene: resultData.hygiene_score || 80,
          gums: resultData.gum_health_score || 85,
          structure: resultData.structural_integrity_score || 90
        }
      };

      setScanResult(finalResult);
      storage.saveScanResult(finalResult);
      onResult(finalResult);
      setStep('RESULT');
    } catch (err: any) {
      setError(mapError(err, 'AI'));
      setStep('IDLE');
    } finally {
      clearInterval(stepInterval);
    }
  };

  const ScoreBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="py-2">
      {step === 'IDLE' && (
        <div className="space-y-6 text-center animate-in fade-in duration-500">
          <div className="relative w-full aspect-square rounded-[48px] border-4 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center group overflow-hidden transition-all duration-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-nexus-primary mb-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
               <circle cx="12" cy="13" r="3" strokeWidth={1.5} />
             </svg>
             <p className="text-nexus-primary font-black text-[10px] uppercase tracking-[0.4em]">Neural Optical Input</p>
          </div>
          
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          <button onClick={() => fileInputRef.current?.click()} className="w-full blue-gradient text-white py-7 rounded-[32px] font-black text-xl shadow-2xl spring-click uppercase tracking-tight">Access Optical Lens</button>
        </div>
      )}

      {step === 'PREVIEW' && previewImg && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
           <div className="relative aspect-square rounded-[44px] overflow-hidden border-4 border-nexus-primary shadow-2xl">
              <img src={previewImg} alt="Capture Preview" className="w-full h-full object-cover" />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setStep('IDLE')} className="py-5 bg-slate-800 text-slate-400 rounded-3xl font-black text-xs uppercase tracking-widest spring-click">Retake</button>
              <button onClick={startAiScanning} className="py-5 blue-gradient text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl spring-click">Start Analysis</button>
           </div>
        </div>
      )}

      {step === 'PROCESSING' && (
        <div className="text-center py-20 space-y-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="relative inline-block">
             <div className="w-64 h-64 rounded-[56px] border-4 border-slate-800 flex items-center justify-center bg-slate-900 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[80px] bg-gradient-to-b from-nexus-primary/40 to-transparent animate-[scan_2s_ease-in-out_infinite] z-10"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-44 w-44 text-nexus-primary opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
             </div>
          </div>
          <div className="px-10">
            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">{processText}</h3>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-8">
               <div className="h-full blue-gradient animate-[progress_3s_linear_infinite] w-1/3 rounded-full"></div>
            </div>
          </div>
          <style>{`
            @keyframes scan { 0%, 100% { transform: translateY(-80px); } 100% { transform: translateY(280px); } }
            @keyframes progress { from { transform: translateX(-100%); } to { transform: translateX(300%); } }
          `}</style>
        </div>
      )}

      {step === 'RESULT' && scanResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className={`p-8 rounded-[44px] border-2 shadow-2xl ${scanResult.status === 'RED' ? 'bg-red-950/20 border-red-500/30' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
             <div className="flex justify-between items-center mb-10">
                <div>
                   <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${scanResult.status === 'RED' ? 'text-red-400' : 'text-emerald-400'}`}>System Status: {scanResult.status}</span>
                   <h3 className="text-3xl font-black text-white tracking-tighter mt-1">{scanResult.title}</h3>
                </div>
                <div className={`w-20 h-20 rounded-[28px] flex flex-col items-center justify-center shadow-2xl border-4 border-slate-800 ${scanResult.status === 'RED' ? 'bg-red-500' : 'bg-emerald-500'} text-white`}>
                   <span className="text-2xl font-black leading-none">{scanResult.score}</span>
                   <span className="text-[9px] font-bold uppercase mt-1">Global</span>
                </div>
             </div>

             <div className="bg-slate-900/60 p-6 rounded-[32px] border border-white/5 grid gap-4 mb-6">
               <ScoreBar label="Hygiene Protocol" value={scanResult.breakdown?.hygiene || 0} color="bg-blue-500" />
               <ScoreBar label="Gingival Health" value={scanResult.breakdown?.gums || 0} color="bg-cyan-500" />
               <ScoreBar label="Structural Integrity" value={scanResult.breakdown?.structure || 0} color="bg-indigo-500" />
             </div>

             <div className="bg-slate-900 p-7 rounded-[32px] border border-white/10">
                <p className="text-white font-bold text-[14px] leading-relaxed">
                   {scanResult.message}
                </p>
             </div>
          </div>

          <div className="grid gap-4">
            <button onClick={onClose} className="w-full blue-gradient text-white py-6 rounded-[32px] font-black text-xl shadow-2xl spring-click uppercase tracking-tight">Finalize Report</button>
            {scanResult.status === 'RED' && (
              <button onClick={onBookEmergency} className="w-full bg-red-600 text-white py-6 rounded-[32px] font-black text-lg spring-click uppercase shadow-xl">Emergency Link</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DentalScanner;
