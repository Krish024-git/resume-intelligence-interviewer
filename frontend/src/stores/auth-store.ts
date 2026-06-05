import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      version: 1,
      migrate: (persisted) => {
        const state = persisted as Partial<AuthState> | undefined;
        if (!state || state.token === "demo-token") {
          return { user: null, token: null, isAuthenticated: false };
        }
        return {
          user: state.user ?? null,
          token: state.token ?? null,
          isAuthenticated: Boolean(state.user && state.token && state.isAuthenticated),
        };
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
