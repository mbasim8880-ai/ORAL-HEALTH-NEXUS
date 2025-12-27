
import { UserProfile, DentalProblem, ScanResult, ToothStatus } from '../types';

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

const SCAN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

const safeJsonParse = (data: string | null) => {
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn("Storage parse error, resetting key:", e);
    return null;
  }
};

const safeStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error("Critical Storage Error:", e);
  }
};

export const storage = {
  getUserProfile: (): UserProfile | null => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE));
  },
  setUserProfile: (profile: UserProfile) => {
    safeStorageSet(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    safeStorageSet(STORAGE_KEYS.REGISTERED, 'true');
  },
  isRegistered: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.REGISTERED) === 'true';
  },
  getPlanProgress: (plan: DentalProblem): string[] => {
    const allProgress = safeJsonParse(localStorage.getItem(STORAGE_KEYS.PLAN_PROGRESS)) || {};
    return allProgress[plan] || [];
  },
  savePlanProgress: (plan: DentalProblem, tipId: string) => {
    const allProgress = safeJsonParse(localStorage.getItem(STORAGE_KEYS.PLAN_PROGRESS)) || {};
    const currentPlanProgress = allProgress[plan] || [];
    
    if (!currentPlanProgress.includes(tipId)) {
      allProgress[plan] = [...currentPlanProgress, tipId];
      safeStorageSet(STORAGE_KEYS.PLAN_PROGRESS, JSON.stringify(allProgress));
    }
  },
  getLatestScan: (): (ScanResult & { timestamp?: number }) | null => {
    const data = safeJsonParse(localStorage.getItem(STORAGE_KEYS.LATEST_SCAN));
    if (!data) return null;
    
    if (data.timestamp && Date.now() - data.timestamp > SCAN_EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEYS.LATEST_SCAN);
      return null;
    }
    
    return data;
  },
  saveScanResult: (result: ScanResult) => {
    const resultWithTime = { ...result, timestamp: Date.now() };
    safeStorageSet(STORAGE_KEYS.LATEST_SCAN, JSON.stringify(resultWithTime));
  },
  getDentalMap: (): Record<string, ToothStatus> => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEYS.DENTAL_MAP)) || {};
  },
  saveToothStatus: (status: ToothStatus) => {
    const currentMap = storage.getDentalMap();
    currentMap[status.id] = status;
    safeStorageSet(STORAGE_KEYS.DENTAL_MAP, JSON.stringify(currentMap));
  },
  clearDentalMap: () => {
    localStorage.removeItem(STORAGE_KEYS.DENTAL_MAP);
  },
  getTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'dark';
  },
  setTheme: (theme: 'light' | 'dark') => {
    safeStorageSet(STORAGE_KEYS.THEME, theme);
  },
  setQuizCompleted: (plan: DentalProblem) => {
    const completed = safeJsonParse(localStorage.getItem(STORAGE_KEYS.QUIZ_COMPLETED)) || {};
    completed[plan] = true;
    safeStorageSet(STORAGE_KEYS.QUIZ_COMPLETED, JSON.stringify(completed));
  },
  addBadge: (badge: string) => {
    const currentBadges = safeJsonParse(localStorage.getItem(STORAGE_KEYS.BADGES)) || [];
    if (!currentBadges.includes(badge)) {
      safeStorageSet(STORAGE_KEYS.BADGES, JSON.stringify([...currentBadges, badge]));
    }
  }
};
