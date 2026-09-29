import { create } from 'zustand';

interface User {
  id: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  role: 'patient' | 'caregiver' | 'admin' | null;
  isLoading: boolean;
  login: (username: string, role: string) => Promise<void>;
  switchRole: (role: 'patient' | 'caregiver' | 'admin', name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  role: null,
  isLoading: false,
  login: async (username, role) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({
      user: { id: role === 'patient' ? '1' : role === 'caregiver' ? '2' : '3', name: username },
      role: role as 'patient' | 'caregiver' | 'admin',
      isLoading: false,
    });
  },
  switchRole: (role, name) => {
    set({
      user: { id: role === 'patient' ? '1' : role === 'caregiver' ? '2' : '3', name },
      role: role,
    });
  },
  logout: () => set({ user: null, role: null }),
}));
