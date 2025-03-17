import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ReactNode } from "react";

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

// Modal store to manage global modal state
interface ModalState {
  isOpen: boolean;
  title?: string;
  content: ReactNode | null;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  showCloseButton?: boolean;
  actions?: ReactNode;
  fullScreen?: boolean;
  openModal: (content: ReactNode, options?: { 
    title?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    showCloseButton?: boolean;
    actions?: ReactNode;
    fullScreen?: boolean;
  }) => void;
  closeModal: () => void;
  updateModal: (options?: { 
    title?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    showCloseButton?: boolean;
    actions?: ReactNode;
    fullScreen?: boolean;
  }) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  title: undefined,
  maxWidth: 'sm',
  showCloseButton: true,
  actions: undefined,
  fullScreen: false,
  openModal: (content, options = {}) => set({ 
    isOpen: true, 
    content,
    title: options.title,
    maxWidth: options.maxWidth || 'lg',
    showCloseButton: options.showCloseButton !== undefined ? options.showCloseButton : true,
    actions: options.actions,
    fullScreen: options.fullScreen || false,
  }),
  closeModal: () => set({ isOpen: false }),
  updateModal: (options = {}) => set((state) => ({ 
    title: options.title !== undefined ? options.title : state.title,
    maxWidth: options.maxWidth !== undefined ? options.maxWidth : state.maxWidth,
    showCloseButton: options.showCloseButton !== undefined ? options.showCloseButton : state.showCloseButton,
    actions: options.actions !== undefined ? options.actions : state.actions,
    fullScreen: options.fullScreen !== undefined ? options.fullScreen : state.fullScreen,
  })),
}));