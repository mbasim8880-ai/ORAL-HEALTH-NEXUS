
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, UserProfile } from './types.ts';
import { storage } from './services/storage.ts';
import SplashScreen from './components/SplashScreen.tsx';
import Onboarding from './components/Onboarding.tsx';
import RegistrationForm from './components/RegistrationForm.tsx';
import Dashboard from './components/Dashboard.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.SPLASH);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(storage.getTheme());
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Comprehensive Key Check for ORAL HEALTH NEXUS Link
  useEffect(() => {
    const checkKey = async () => {
      // Use the provided environment key
      const activeKey = process.env.API_KEY;
      const keyIsValid = activeKey && activeKey !== 'undefined' && activeKey.length > 10;
      
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected || !!keyIsValid);
      } else {
        setHasKey(!!keyIsValid);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true); 
    } else {
      alert("NEXUS LINK ERROR: API_KEY environment variable is required for neural features.");
    }
  };

  useEffect(() => {
    const profile = storage.getUserProfile();
    if (profile) {
      setUser(profile);
      setIsSyncing(true);
      storage.restoreFromCloud(profile.mobile).then((syncedProfile) => {
        if (syncedProfile) {
          setUser(syncedProfile);
        }
        setIsSyncing(false);
      });
    }
  }, []);

  const handleSplashFinish = () => {
    const profile = storage.getUserProfile();
    if (profile) {
      setUser(profile);
      setView(AppState.DASHBOARD);
    } else {
      setView(AppState.ONBOARDING);
    }
  };

  const handleOnboardingComplete = () => {
    setView(AppState.REGISTRATION);
  };

  const handleRegistration = async (profile: UserProfile) => {
    await storage.setUserProfile(profile);
    setUser(profile);
    setView(AppState.DASHBOARD);
  };

  const handleUpdateUser = async (profile: UserProfile) => {
    await storage.setUserProfile(profile);
    setUser(profile);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storage.setTheme(newTheme);
  };

  return (
    <div className={`fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[700px] bg-white dark:bg-slate-950 rounded-none sm:rounded-[44px] shadow-[0_32px_128px_rgba(0,0,0,0.4)] z-[10000] overflow-hidden transition-all duration-500 border-0 sm:border-4 sm:border-slate-100 dark:sm:border-slate-900 animate-in slide-in-from-bottom-20`}>
      
      {!hasKey && (
        <div className="absolute inset-0 z-[10002] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center text-white">
          <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center mb-10 shadow-[0_20px_40px_rgba(37,99,235,0.4)] animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black mb-4 tracking-tight leading-none">AI Link Offline</h2>
          <p className="text-slate-400 font-bold text-sm mb-12 leading-relaxed">
            The Nexus Neural Engine requires an active API key to process optical diagnostics and chat intelligence.
          </p>
          <button 
            onClick={handleSelectKey} 
            className="w-full blue-gradient py-6 rounded-3xl font-black text-xl uppercase tracking-tight shadow-2xl spring-click hover:brightness-110"
          >
            Activate Nexus Link
          </button>
        </div>
      )}

      {view === AppState.SPLASH && <SplashScreen onFinish={handleSplashFinish} />}
      {view === AppState.ONBOARDING && <Onboarding onComplete={handleOnboardingComplete} />}
      {view === AppState.REGISTRATION && <RegistrationForm onRegister={handleRegistration} />}
      {view === AppState.DASHBOARD && user && (
        <Dashboard 
          user={user} 
          onUpdateUser={handleUpdateUser}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      
      {isSyncing && (
        <div className="fixed top-6 right-6 z-[10001] flex items-center space-x-2">
           <span className="text-[8px] font-black text-nexus-cyan uppercase tracking-widest animate-pulse">Syncing</span>
           <div className="w-2 h-2 rounded-full bg-nexus-cyan shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default App;
