
export type DentalProblem = 'Tooth Pain' | 'Gum Bleeding' | 'Sensitivity' | 'General Care' | 'Crown' | 'Bridges' | 'Post extraction care' | 'Implant' | 'Braces';

export type ToothIssue = 'Cavity / Decay' | 'Gum Bleeding' | 'Sensitivity' | 'Sharp Pain' | 'Broken / Chipped' | 'None';

export interface ToothStatus {
  id: string;
  issue: ToothIssue;
  severity: number; // 0 to 100
}

export interface UserProfile {
  fullName: string;
  age: number;
  gender: string;
  mobile: string;
  currentPlan: DentalProblem;
}

export interface Tip {
  id: string;
  title: string;
  description: string;
}

export interface PlanData {
  problem: DentalProblem;
  tips: Tip[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizData {
  plan: DentalProblem;
  badge: string;
  questions: QuizQuestion[];
}

export interface ScanResult {
  status: 'GREEN' | 'YELLOW' | 'RED';
  title: string;
  message: string;
  date: string;
  score: number;
  breakdown?: {
    hygiene: number;
    gums: number;
    structure: number;
  };
}

export interface AppointmentData {
  name: string;
  phone: string;
  gender: string;
  address: string;
  notes: string;
  preferredDoctor?: string;
  source?: string;
}

export interface NexusError {
  title: string;
  message: string;
  code: string;
  canRetry?: boolean;
}

export enum AppState {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  REGISTRATION = 'REGISTRATION',
  DASHBOARD = 'DASHBOARD'
}
