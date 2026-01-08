
export type TabType = 'home' | 'record' | 'analytics' | 'routine' | 'aicare';

export interface SleepRecord {
  id: string;
  date: string;
  score: number;
  duration: number; // in minutes
  deepSleep: number; // percentage
  lightSleep: number; // percentage
  remSleep: number; // percentage
  mood: string;
  satisfaction: number; // 1-5
  title: string;
  memo: string;
  tags: string[];
}

export interface RoutineItem {
  id: string;
  name: string;
  icon: string;
  time?: string;
  enabled: boolean;
  isCustom: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
