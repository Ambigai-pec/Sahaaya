import { Platform } from 'react-native';

const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_HOST;

async function request<T>(endpoint: string, options?: RequestInit): Promise<{ success: boolean; data: T | null; error?: string }> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options?.headers || {})
      },
      ...options
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, data: null, error: `HTTP ${response.status}: ${errText}` };
    }

    const json = await response.json();
    return { success: true, data: json };
  } catch (err: any) {
    // Graceful offline fallback
    console.warn(`[Sahaaya API] Offline/Fallback notice for ${endpoint}:`, err.message);
    return { success: false, data: null, error: err.message };
  }
}

export const api = {
  baseUrl: API_BASE_URL,

  auth: {
    login: (username: string, role: string) =>
      request<{ message: string; user: { id: number; username: string; role: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, role })
      }),
    getMe: (userId: number) => request<any>(`/auth/me?user_id=${userId}`)
  },

  medications: {
    getMedications: (patientId: number) => request<any[]>(`/medications/${patientId}`),
    createMedication: (med: any) =>
      request<any>('/medications/', {
        method: 'POST',
        body: JSON.stringify(med)
      }),
    getTodaySchedule: (patientId: number) => request<any[]>(`/medications/${patientId}/today`),
    recordDose: (dose: any) =>
      request<any>('/doses/', {
        method: 'POST',
        body: JSON.stringify(dose)
      }),
    updateDose: (doseId: number | string, status: string) =>
      request<any>(`/doses/${doseId}?status=${status}`, {
        method: 'PUT'
      }),
    getHistory: (patientId: number) => request<any[]>(`/doses/${patientId}/history`),
    getWeekStats: (patientId: number) => request<{ adherence_pct: number; missed: number; taken: number; delayed: number; total: number }>(`/doses/${patientId}/week-stats`)
  },

  mood: {
    createMood: (entry: any) =>
      request<any>('/mood/', {
        method: 'POST',
        body: JSON.stringify(entry)
      }),
    createJournal: (patientId: number, text: string, moodEntryId?: number) =>
      request<any>('/mood/journal', {
        method: 'POST',
        body: JSON.stringify({ patient_id: patientId, text, mood_entry_id: moodEntryId })
      }),
    getHistory: (patientId: number) => request<any[]>(`/mood/${patientId}/history`),
    getWeek: (patientId: number) => request<any[]>(`/mood/${patientId}/week`),
    getJournals: (patientId: number) => request<any[]>(`/mood/${patientId}/journals`),
    getStats: (patientId: number) => request<{ avg_mood: number; total_entries: number; sentiment_distribution: any; low_mood_days: number }>(`/mood/${patientId}/stats`)
  },

  risk: {
    assess: (patientId: number) =>
      request<any>(`/risk/${patientId}/assess`, {
        method: 'POST'
      }),
    getLatest: (patientId: number) => request<any>(`/risk/${patientId}/latest`),
    getHistory: (patientId: number) => request<any[]>(`/risk/${patientId}/history`)
  },

  stock: {
    getPatientStock: (patientId: number) => request<any[]>(`/stock/${patientId}`),
    getStockOverview: (patientId: number) => request<any[]>(`/stock/${patientId}/overview`),
    updateStock: (medicationId: number, stock: { remaining_tablets: number; refill_threshold: number }) =>
      request<any>(`/stock/${medicationId}`, {
        method: 'PUT',
        body: JSON.stringify(stock)
      }),
    refill: (medicationId: number, addedTablets: number = 30) =>
      request<any>(`/stock/${medicationId}/refill?added_tablets=${addedTablets}`, {
        method: 'POST'
      }),
    getPrediction: (medicationId: number) => request<{ days_remaining: number; medication_name: string; daily_consumption: number; needs_refill: boolean }>(`/stock/${medicationId}/prediction`)
  },

  chat: {
    sendMessage: (message: string, patientId?: number, sessionId?: string) =>
      request<{ text: string; suggestions?: string[]; show_emergency?: boolean }>('/chat/', {
        method: 'POST',
        body: JSON.stringify({ message, patient_id: patientId || 1, session_id: sessionId || 'default' })
      })
  },

  caregiver: {
    getPatients: (caregiverId: number) => request<any[]>(`/caregiver/${caregiverId}/patients`),
    getPatientOverview: (caregiverId: number, patientId: number) => request<any>(`/caregiver/${caregiverId}/patient/${patientId}/overview`),
    getAlerts: (caregiverId: number) => request<any[]>(`/caregiver/${caregiverId}/alerts`)
  },

  notifications: {
    getNotifications: (userId: number) => request<any[]>(`/notifications/${userId}`),
    markRead: (notifId: number) =>
      request<any>(`/notifications/${notifId}/read`, {
        method: 'PUT'
      }),
    createNotification: (notif: any) =>
      request<any>('/notifications/', {
        method: 'POST',
        body: JSON.stringify(notif)
      })
  },

  admin: {
    getStats: () => request<any>('/admin/stats'),
    getUsers: () => request<any[]>('/admin/users'),
    getActivity: () => request<any[]>('/admin/activity'),
    getAlerts: () => request<any[]>('/admin/alerts')
  }
};
