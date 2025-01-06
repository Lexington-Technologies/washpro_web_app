import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  // Add user properties here
  id: string;
  name: string;
  // ... other user properties
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  logIn: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
}

// Create a Zustand store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      logIn: (user, token, refreshToken) => set({ user, token, refreshToken }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: "washpro-kudan",
    }
  )
);

export const useSnackStore = create((set) => ({
  message: null,
  variant: null as 'success' | 'error' | 'info' | 'warning' | null,
  isLoading: false,
  setLoading: (bool: boolean) => set({ isLoading: bool }),
  setAlert: async ({ variant, message }: { variant: 'success' | 'error' | 'info' | 'warning', message: string }) => {
    set({ variant, message });
  },
}));