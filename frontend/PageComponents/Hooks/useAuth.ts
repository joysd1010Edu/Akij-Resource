"use client";
/* ==========  frontend/PageComponents/Hooks/useAuth.ts  ===============*/

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

import { getMe, login, register } from "@/lib/api/auth";
import type { LoginInput, RegisterInput } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/authStore";

/* ==========  Function toMessage contains reusable module logic used by this feature.  ===============*/
function toMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ||
      "Something went wrong"
    );
  }

  return "Something went wrong";
}

/* ==========  Function useLoginMutation is a reusable hook used to manage UI state and data flow.  ===============*/
export function useLoginMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginInput) => login(payload),
    onSuccess: (res) => {
      const data = res.data;
      const token = data.access_token || data.token;

      if (!token || !data.user) {
        return;
      }

      setAuth({
        token,
        refreshToken: data.refresh_token || null,
        user: data.user,
      });
    },
    meta: {
      errorMessage: "Login failed",
    },
  });
}

/* ==========  Function useRegisterMutation is a reusable hook used to manage UI state and data flow.  ===============*/
export function useRegisterMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterInput) => register(payload),
    onSuccess: (res) => {
      const data = res.data;
      const token = data.access_token || data.token;

      if (!token || !data.user) {
        return;
      }

      setAuth({
        token,
        refreshToken: data.refresh_token || null,
        user: data.user,
      });
    },
    meta: {
      errorMessage: "Registration failed",
    },
  });
}

/* ==========  Function useMeQuery is a reusable hook used to manage UI state and data flow.  ===============*/
export function useMeQuery(enabled = true) {
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: enabled && Boolean(token),
    retry: false,
  });

  useEffect(() => {
    if (!token || !query.data?.data) {
      return;
    }

    setAuth({
      token,
      user: query.data.data,
      refreshToken: useAuthStore.getState().refreshToken,
    });
  }, [query.data?.data, setAuth, token]);

  useEffect(() => {
    if (query.isError) {
      clearAuth();
    }
  }, [clearAuth, query.isError]);

  return query;
}

/* ==========  Function getApiErrorMessage gets get api error message data for the current module flow.  ===============*/
export function getApiErrorMessage(error: unknown) {
  return toMessage(error);
}
