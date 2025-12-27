
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
