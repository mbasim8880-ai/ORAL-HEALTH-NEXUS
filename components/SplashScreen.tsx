
import React, { useEffect, useState } from 'react';

interface Props {
  onFinish: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(onFinish, 2800);
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, 20);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 blue-gradient flex flex-col items-center justify-center text-white p-6 z-[999] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-sky-300/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="relative flex flex-col items-center stagger-fade-in">
        {/* Professional Logo SVG */}
        <div className="relative mb-10 group">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/20 shadow-2xl relative transition-transform duration-700 hover:scale-105">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white drop-shadow-lg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" opacity="0.4"/>
              <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="currentColor"/>
              <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor" className="animate-pulse"/>
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-black tracking-[-0.05em] mb-3 text-pop">ORAL HEALTH</h1>
          <div className="flex items-center justify-center space-x-3">
             <div className="h-[2px] w-8 bg-white/30 rounded-full"></div>
             <h2 className="text-xl font-medium tracking-[0.4em] text-white/80 uppercase">Nexus</h2>
             <div className="h-[2px] w-8 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Progress Loader */}
      <div className="absolute bottom-20 left-12 right-12">
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-[2px] border border-white/5">
           <div 
             className="h-full bg-white rounded-full transition-all duration-300 ease-out"
             style={{ width: `${progress}%` }}
           ></div>
        </div>
        <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] mt-4 opacity-40">Initializing Neural Link</p>
      </div>
    </div>
  );
};

export default SplashScreen;
