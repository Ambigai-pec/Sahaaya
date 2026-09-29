import { create } from 'zustand';
import { DEMO_RISK } from '../constants/demoData';
import { calculateRisk } from '../services/riskEngine';

interface RiskAssessment {
  id: string;
  patientId: string;
  supportPriority: 'low' | 'moderate' | 'high';
  medicationRisk: number;
  moodRisk: number;
  stockRisk: number;
  totalScore: number;
  factors: string[];
  assessedAt: string;
}

interface RiskStore {
  currentAssessment: RiskAssessment | null;
  history: RiskAssessment[];
  runAssessment: (params: any) => void;
  loadDemoData: () => void;
}

export const useRiskStore = create<RiskStore>((set) => ({
  currentAssessment: null,
  history: [],

  runAssessment: (params) => {
    const result = calculateRisk(params);
    const assessment: RiskAssessment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: 'patient-1',
      ...result,
      assessedAt: new Date().toISOString(),
    };
    
    set((state) => ({
      currentAssessment: assessment,
      history: [assessment, ...state.history]
    }));
  },

  loadDemoData: () => {
    set({
      currentAssessment: DEMO_RISK as RiskAssessment,
      history: [DEMO_RISK as RiskAssessment],
    });
  },
}));
