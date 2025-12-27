
import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: "Your Dental Future",
      desc: "Nexus uses advanced tracking to ensure your smile stays perfect for a lifetime.",
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Expert Care Plans",
      desc: "Get personalized daily advice tailored specifically to your unique oral health profile.",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800",
    }
  ];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 p-8 sm:p-12 justify-between animate-in fade-in duration-700 overflow-y-auto no-scrollbar transition-colors">
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-10 sm:space-y-14 py-6">
        {/* Image Container matching screenshot style */}
        <div className="w-full max-w-[320px] aspect-square rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white dark:border-slate-800 transform transition-all duration-700 animate-in zoom-in-95 slide-in-from-top-4 flex-shrink-0">
          <img 
            key={slides[slide].image}
            src={slides[slide].image} 
            alt="Onboarding" 
            className="w-full h-full object-cover animate-in fade-in duration-1000" 
          />
        </div>

        {/* Text Section */}
        <div className="text-center space-y-5 px-2 animate-in slide-in-from-bottom-6 duration-700 delay-150">
          <h2 className="text-[32px] font-extrabold text-[#0088CC] dark:text-blue-400 tracking-tight leading-tight">
            {slides[slide].title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto text-lg">
            {slides[slide].desc}
          </p>
        </div>

        {/* Pagination Dots matching screenshot pill style */}
        <div className="flex justify-center items-center space-x-2 animate-in fade-in duration-700 delay-300">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`transition-all duration-500 rounded-full ${
                i === slide 
                  ? 'w-10 h-2 bg-[#0088CC] dark:bg-blue-500' 
                  : 'w-2 h-2 bg-slate-200 dark:bg-slate-800'
              }`}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Action Button Section */}
      <div className="w-full max-w-sm mx-auto pt-6 pb-4 animate-in slide-in-from-bottom-8 duration-700 delay-500 flex-shrink-0">
        <button 
          onClick={handleNext}
          className="w-full bg-[#00A8CC] text-white py-6 rounded-2xl font-black text-xl shadow-xl hover:brightness-105 active:scale-[0.98] transition-all tracking-tight uppercase"
        >
          {slide === slides.length - 1 ? 'Get Started' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
