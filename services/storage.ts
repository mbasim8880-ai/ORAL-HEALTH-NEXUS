
import { UserProfile, DentalProblem, ScanResult, ToothStatus } from '../types';
import { supabase } from './supabase.ts';
import { mapError } from './errorMapper';

const STORAGE_KEYS = {
  USER_PROFILE: 'ohn_user_profile',
  REGISTERED: 'ohn_is_registered',
  PLAN_PROGRESS: 'ohn_plan_progress',
  LATEST_SCAN: 'ohn_latest_scan',
  DENTAL_MAP: 'ohn_dental_map',
  THEME: 'ohn_theme',
  QUIZ_COMPLETED: 'ohn_quiz_completed',
  BADGES: 'ohn_badges',
};

const safeJsonParse = (data: string | null) => {
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn("NEXUS JSON PARSE ERROR:", e);
    return null;
  }
};

const safeStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn(`NEXUS STORAGE READ ACCESS DENIED FOR ${key}:`, e);
    return null;
  }
};

const safeStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error("NEXUS STORAGE WRITE ACCESS DENIED:", e);
  }
};

const safeStorageRemove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error("NEXUS STORAGE DELETE ACCESS DENIED:", e);
  }
};

export const storage = {
  getUserProfile: (): UserProfile | null => {
    return safeJsonParse(safeStorageGet(STORAGE_KEYS.USER_PROFILE));
  },

  setUserProfile: async (profile: UserProfile): Promise<boolean> => {
    safeStorageSet(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    safeStorageSet(STORAGE_KEYS.REGISTERED, 'true');
    
    try {
      const { error } = await supabase.from('profiles').upsert({
        mobile: profile.mobile,
        full_name: profile.fullName,
        age: profile.age,
        gender: profile.gender,
        current_plan: profile.currentPlan,
        updated_at: new Date().toISOString()
      }, { onConflict: 'mobile' });

      if (error) {
        const mapped = mapError(error, 'DB');
        alert(`${mapped.title}: ${mapped.message}`);
        return false;
      }
      return true;
    } catch (err: any) {
      return true; // Return true to allow offline experience
    }
  },

  isRegistered: (): boolean => {
    return safeStorageGet(STORAGE_KEYS.REGISTERED) === 'true';
  },

  getPlanProgress: (plan: DentalProblem): string[] => {
    const allProgress = safeJsonParse(safeStorageGet(STORAGE_KEYS.PLAN_PROGRESS)) || {};
    return allProgress[plan] || [];
  },

  savePlanProgress: async (plan: DentalProblem, tipId: string) => {
    const allProgress = safeJsonParse(safeStorageGet(STORAGE_KEYS.PLAN_PROGRESS)) || {};
    const currentPlanProgress = allProgress[plan] || [];
    const profile = storage.getUserProfile();
    
    if (!currentPlanProgress.includes(tipId)) {
      allProgress[plan] = [...currentPlanProgress, tipId];
      safeStorageSet(STORAGE_KEYS.PLAN_PROGRESS, JSON.stringify(allProgress));

      if (profile) {
        try {
          await supabase.from('learned_tips').insert({
            mobile: profile.mobile,
            plan: plan,
            tip_id: tipId
          });
        } catch (err) {}
      }
    }
  },

  getLatestScan: (): (ScanResult & { timestamp?: number }) | null => {
    return safeJsonParse(safeStorageGet(STORAGE_KEYS.LATEST_SCAN));
  },

  saveScanResult: async (result: ScanResult) => {
    const resultWithTime = { ...result, timestamp: Date.now() };
    safeStorageSet(STORAGE_KEYS.LATEST_SCAN, JSON.stringify(resultWithTime));
    const profile = storage.getUserProfile();

    if (profile) {
      try {
        await supabase.from('scans').insert({
          mobile: profile.mobile,
          status: result.status,
          title: result.title,
          message: result.message,
          score: result.score,
          hygiene: result.breakdown?.hygiene,
          gums: result.breakdown?.gums,
          structure: result.breakdown?.structure
        });
      } catch (err) {}
    }
  },

  getDentalMap: (): Record<string, ToothStatus> => {
    return safeJsonParse(safeStorageGet(STORAGE_KEYS.DENTAL_MAP)) || {};
  },

  saveToothStatus: async (status: ToothStatus) => {
    const currentMap = storage.getDentalMap();
    currentMap[status.id] = status;
    safeStorageSet(STORAGE_KEYS.DENTAL_MAP, JSON.stringify(currentMap));
    const profile = storage.getUserProfile();

    if (profile) {
      try {
        await supabase.from('dental_map').upsert({
          mobile: profile.mobile,
          tooth_id: status.id,
          issue: status.issue,
          severity: status.severity,
          updated_at: new Date().toISOString()
        }, { onConflict: 'mobile,tooth_id' });
      } catch (err) {}
    }
  },

  clearDentalMap: async () => {
    safeStorageRemove(STORAGE_KEYS.DENTAL_MAP);
    const profile = storage.getUserProfile();
    if (profile) {
      try {
        await supabase.from('dental_map').delete().eq('mobile', profile.mobile);
      } catch (err) {}
    }
  },

  getTheme: (): 'light' | 'dark' => {
    return (safeStorageGet(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'dark';
  },

  setTheme: (theme: 'light' | 'dark') => {
    safeStorageSet(STORAGE_KEYS.THEME, theme);
  },

  restoreFromCloud: async (mobile: string): Promise<UserProfile | null> => {
    try {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('mobile', mobile)
        .single();

      if (profileErr || !profileData) return null;

      const profile: UserProfile = {
        fullName: profileData.full_name,
        age: profileData.age,
        gender: profileData.gender,
        mobile: profileData.mobile,
        currentPlan: profileData.current_plan
      };

      return profile;
    } catch (err) {
      return null;
    }
  },

  setQuizCompleted: async (plan: DentalProblem) => {
    const completed = safeJsonParse(safeStorageGet(STORAGE_KEYS.QUIZ_COMPLETED)) || {};
    completed[plan] = true;
    safeStorageSet(STORAGE_KEYS.QUIZ_COMPLETED, JSON.stringify(completed));
  },

  addBadge: (badge: string) => {
    const currentBadges = safeJsonParse(safeStorageGet(STORAGE_KEYS.BADGES)) || [];
    if (!currentBadges.includes(badge)) {
      safeStorageSet(STORAGE_KEYS.BADGES, JSON.stringify([...currentBadges, badge]));
    }
  }
};
