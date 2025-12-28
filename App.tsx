
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

  // Widget Security & Context
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const nexusApiKey = urlParams.get('nexus-api-key') || 'NEXUS-DEMO-2025';

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Check for API Key presence for AI features
  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true); // Assume success after triggering
    }
  };

  // Handle background sync when profile exists
  useEffect(() => {
    const profile = storage.getUserProfile();
    if (profile) {
      setUser(profile);
      // Background Sync
      setIsSyncing(true);
      storage.restoreFromCloud(profile.mobile).then((syncedProfile) => {
        if (syncedProfile) {
          setUser(syncedProfile);
          console.log("Nexus: Background Cloud Sync Complete");
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
    // Await the cloud sync
    const success = await storage.setUserProfile(profile);
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
    <div className={`fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[700px] bg-white dark:bg-slate-900 rounded-none sm:rounded-[44px] shadow-[0_32px_128px_rgba(0,0,0,0.3)] z-[10000] overflow-hidden transition-all duration-500 border-0 sm:border-4 sm:border-slate-100 dark:sm:border-slate-800 animate-in slide-in-from-bottom-20`}>
      
      {!hasKey && (
        <div className="absolute inset-0 z-[10002] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center text-white">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black mb-4 tracking-tight">AI Key Required</h2>
          <p className="text-slate-400 font-bold text-sm mb-10 leading-relaxed">To enable Nexus Vision and Intelligent Diagnostics, please select a paid Google Cloud Project key.</p>
          <button onClick={handleSelectKey} className="w-full blue-gradient py-6 rounded-3xl font-black text-xl uppercase tracking-tight shadow-xl spring-click">Select Key</button>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="mt-6 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">Billing Documentation</a>
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
      
      {/* Background Sync Indicator */}
      {isSyncing && (
        <div className="fixed top-4 right-4 z-[10001] animate-pulse">
           <div className="w-2 h-2 rounded-full bg-nexus-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
        </div>
      )}
    </div>
  );
};

export default App;
