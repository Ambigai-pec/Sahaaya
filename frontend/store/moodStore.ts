import { create } from 'zustand';
import { DEMO_MOOD_ENTRIES } from '../constants/demoData';

interface MoodEntry {
  id: string;
  patientId: string;
  moodScore: number;
  moodLabel: string;
  journalText?: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'distress';
  timestamp: string;
  date: string;
}

interface MoodStore {
  entries: MoodEntry[];
  todayEntry: MoodEntry | null;
  weekEntries: MoodEntry[];
  averageMood: number;
  lowMoodStreak: number;
  addEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  loadDemoData: () => void;
}

export const useMoodStore = create<MoodStore>((set) => ({
  entries: [],
  todayEntry: null,
  weekEntries: [],
  averageMood: 4,
  lowMoodStreak: 0,

  addEntry: (entry) => {
    set((state) => {
      const newEntry = { ...entry, id: Math.random().toString(36).substr(2, 9) } as MoodEntry;
      const newEntries = [...state.entries, newEntry];
      return {
        entries: newEntries,
        todayEntry: newEntry,
        weekEntries: [...state.weekEntries, newEntry].slice(-7)
      };
    });
  },

  loadDemoData: () => {
    set({
      entries: DEMO_MOOD_ENTRIES as MoodEntry[],
      weekEntries: DEMO_MOOD_ENTRIES as MoodEntry[],
      todayEntry: null, // Allow user to enter today
      averageMood: 3.6,
      lowMoodStreak: 2,
    });
  },
}));
