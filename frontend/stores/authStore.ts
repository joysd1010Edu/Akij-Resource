"use client";
/* ==========  frontend/stores/authStore.ts  ===============*/

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthUser } from "@/types/auth";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  setAuth: (payload: {
    token: string;
    refreshToken?: string | null;
    user: AuthUser;
  }) => void;
  clearAuth: () => void;
  setHasHydrated: (value: boolean) => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,
      setAuth: ({ token, refreshToken, user }) =>
        set({
          token,
          refreshToken: refreshToken ?? null,
          user,
        }),
      clearAuth: () =>
        set({
          token: null,
          refreshToken: null,
          user: null,
        }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "ibos-auth",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : localStorage,
      ),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
