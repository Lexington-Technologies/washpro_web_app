import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ReactNode } from "react";
import { createZitadelAuth, ZitadelConfig } from "@zitadel/react";

interface User {
  // Add user properties here
  id: string;
  name: string;
  email: string;
  roles: string[];
  emailVerified: boolean;
  
  // ... other user properties
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean | null;
  zitadel: ReturnType<typeof createZitadelAuth> | null;
  initializeZitadel: (config: ZitadelConfig) => void;
  login: () => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string, refreshToken: string) => void;
  setAuthenticated: (authenticated: boolean | null) => void;
  checkAuth: () => Promise<void>;
}

// Create a Zustand store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: null,
      zitadel: null,
      initializeZitadel: (config: ZitadelConfig) => {
        const zitadel = createZitadelAuth(config);
        set({ zitadel });
      },
      login: () => {
        const { zitadel } = get();
        if (zitadel) {
          zitadel.authorize();
        }
      },
      logout: () => {
        const { zitadel } = get();
        if (zitadel) {
          zitadel.signout();
        }
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },
      setToken: (token: string, refreshToken: string) => set({ token, refreshToken }),
      setUser: (user: User) => set({ user }),
      setAuthenticated: (authenticated: boolean | null) => set({ isAuthenticated: authenticated }),
      checkAuth: async () => {
        const { zitadel } = get();
        if (zitadel) {
          const user = await zitadel.userManager.getUser();
          set({ isAuthenticated: !!user });
        }
      },
    }),
    {
      name: "washpro-kudan",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['zitadel'].includes(key))
        ),
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