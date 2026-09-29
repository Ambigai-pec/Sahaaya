import { create } from 'zustand';
import { DEMO_MEDICATIONS, DEMO_STOCKS, DEMO_DOSES } from '../constants/demoData';

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  tabletsPerDose: number;
  foodInstruction: string;
  startDate: string;
  isActive: boolean;
}

export interface MedicationDose {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  date: string;
  status: 'taken' | 'missed' | 'delayed' | 'pending';
  takenAt?: string;
}

export interface MedicineStock {
  medicationId: string;
  medicationName: string;
  remainingTablets: number;
  dailyConsumption: number;
  refillThreshold: number;
  daysRemaining: number;
  needsRefill: boolean;
}

interface MedicationStore {
  medications: Medication[];
  doses: MedicationDose[];
  stocks: MedicineStock[];
  todayDoses: MedicationDose[];
  weeklyAdherence: number;
  missedThisWeek: number;
  delayedThisWeek: number;
  markDose: (doseId: string, status: 'taken' | 'missed' | 'delayed') => void;
  addMedication: (med: Omit<Medication, 'id'>) => void;
  updateStock: (medicationId: string, tablets: number) => void;
  loadDemoData: () => void;
}

function calcAdherence(doses: MedicationDose[]): number {
  if (doses.length === 0) return 100;
  const resolved = doses.filter(d => d.status !== 'pending');
  if (resolved.length === 0) return 71; // demo default
  const taken = resolved.filter(d => d.status === 'taken').length;
  return Math.round((taken / resolved.length) * 100);
}

export const useMedicationStore = create<MedicationStore>((set, get) => ({
  medications: [],
  doses: [],
  stocks: [],
  todayDoses: [],
  weeklyAdherence: 71,
  missedThisWeek: 3,
  delayedThisWeek: 1,

  markDose: (doseId, status) => {
    set((state) => {
      const updatedToday = state.todayDoses.map(dose =>
        dose.id === doseId ? { ...dose, status, takenAt: new Date().toISOString() } : dose
      );

      // Update stock if taken
      let updatedStocks = state.stocks;
      if (status === 'taken') {
        const dose = state.todayDoses.find(d => d.id === doseId);
        if (dose) {
          const med = state.medications.find(m => m.id === dose.medicationId);
          const tabletsUsed = med?.tabletsPerDose || 1;
          updatedStocks = state.stocks.map(s => {
            if (s.medicationId === dose.medicationId) {
              const newRemaining = Math.max(0, s.remainingTablets - tabletsUsed);
              const daysRemaining = s.dailyConsumption > 0 ? newRemaining / s.dailyConsumption : 0;
              return {
                ...s,
                remainingTablets: newRemaining,
                daysRemaining,
                needsRefill: daysRemaining <= s.refillThreshold,
              };
            }
            return s;
          });
        }
      }

      // Recount missed/delayed from today's doses
      const newMissed = state.missedThisWeek + (status === 'missed' ? 1 : 0);
      const newDelayed = state.delayedThisWeek + (status === 'delayed' ? 1 : 0);
      // Recount adherence
      const allResolved = [...updatedToday.filter(d => d.status !== 'pending'), ...state.doses];
      const adherence = calcAdherence(allResolved);

      return {
        todayDoses: updatedToday,
        stocks: updatedStocks,
        missedThisWeek: newMissed,
        delayedThisWeek: newDelayed,
        weeklyAdherence: adherence,
      };
    });
  },

  addMedication: (med) => {
    const newMed: Medication = { ...med, id: `med-${Date.now()}` };
    const newStock: MedicineStock = {
      medicationId: newMed.id,
      medicationName: newMed.name,
      remainingTablets: 30,
      dailyConsumption: newMed.tabletsPerDose,
      refillThreshold: 7,
      daysRemaining: 30 / newMed.tabletsPerDose,
      needsRefill: false,
    };
    set((state) => ({
      medications: [...state.medications, newMed],
      stocks: [...state.stocks, newStock],
    }));
  },

  updateStock: (medicationId, tablets) => {
    set((state) => {
      const updatedStocks = state.stocks.map(stock => {
        if (stock.medicationId === medicationId) {
          const newRemaining = stock.remainingTablets + tablets;
          const daysRemaining = stock.dailyConsumption > 0 ? newRemaining / stock.dailyConsumption : newRemaining;
          return {
            ...stock,
            remainingTablets: newRemaining,
            daysRemaining,
            needsRefill: daysRemaining <= stock.refillThreshold,
          };
        }
        return stock;
      });
      return { stocks: updatedStocks };
    });
  },

  loadDemoData: () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const hour = now.getHours();

    // Create today's doses — 8AM dose is pending if before 8AM, else pending
    const initialTodayDoses: MedicationDose[] = DEMO_MEDICATIONS.map((med, index) => ({
      id: `dose-today-${index}`,
      medicationId: med.id,
      medicationName: med.name,
      scheduledTime: med.times[0],
      date: today,
      status: 'pending',
    }));

    set({
      medications: DEMO_MEDICATIONS as Medication[],
      stocks: DEMO_STOCKS,
      doses: DEMO_DOSES as any,
      todayDoses: initialTodayDoses,
      weeklyAdherence: 71,
      missedThisWeek: 3,
      delayedThisWeek: 1,
    });
  },
}));
