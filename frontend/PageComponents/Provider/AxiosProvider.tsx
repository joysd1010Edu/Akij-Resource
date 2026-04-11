"use client";
/* ==========  frontend/PageComponents/Provider/AxiosProvider.tsx  ===============*/

import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useEffect, useRef } from "react";

import { showSessionExpiredAlert } from "@/lib/alerts/appAlert";
import { authApiClient, apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/stores/authStore";

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

/*===== axios provider with refresh handling ===========*/
export default function AxiosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshingPromiseRef = useRef<Promise<string> | null>(null);

  useEffect(() => {
    const reqId = apiClient.interceptors.request.use((config) => {
      const accessToken = useAuthStore.getState().token;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    const resId = apiClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryRequestConfig | undefined;
        const status = error.response?.status;
        const requestUrl = originalRequest?.url || "";

        const isAuthPath =
          requestUrl.includes("/auth/login") ||
          requestUrl.includes("/auth/register") ||
          requestUrl.includes("/auth/refresh");

        if (
          !originalRequest ||
          status !== 401 ||
          originalRequest._retry ||
          isAuthPath
        ) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          if (!refreshingPromiseRef.current) {
            /*===== single refresh request even when many calls fail at once ===========*/
            refreshingPromiseRef.current = authApiClient
              .post("/auth/refresh", {
                refresh_token:
                  useAuthStore.getState().refreshToken || undefined,
              })
              .then((res) => {
                const payload = res.data?.data;
                const newAccessToken = payload?.access_token || payload?.token;

                if (!newAccessToken || !payload?.user) {
                  throw new Error("Invalid refresh payload");
                }

                setAuth({
                  token: newAccessToken,
                  refreshToken: payload?.refresh_token || null,
                  user: payload.user,
                });

                return newAccessToken as string;
              })
              .finally(() => {
                refreshingPromiseRef.current = null;
              });
          }

          const latestToken = await refreshingPromiseRef.current;
          originalRequest.headers.Authorization = `Bearer ${latestToken}`;

          return apiClient(originalRequest);
        } catch (refreshError) {
          clearAuth();
          await showSessionExpiredAlert();
          return Promise.reject(refreshError);
        }
      },
    );

    return () => {
      apiClient.interceptors.request.eject(reqId);
      apiClient.interceptors.response.eject(resId);
    };
  }, [token, setAuth, clearAuth]);

  return <>{children}</>;
}
