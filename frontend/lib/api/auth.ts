/* ==========  frontend/lib/api/auth.ts  ===============*/
import type { ApiResponse } from "@/lib/api/types";
import type { AuthPayload } from "@/types/auth";

import { apiClient } from "./client";

export interface LoginInput {
  login: string;
  password: string;
}

export interface RegisterInput {
  full_name: string;
  email: string;
  user_id_login: string;
  password: string;
  role: "student" | "teacher";
}

export async function login(payload: LoginInput) {
  const { data } = await apiClient.post<ApiResponse<AuthPayload>>(
    "/auth/login",
    payload,
  );
  return data;
}

export async function register(payload: RegisterInput) {
  const { data } = await apiClient.post<ApiResponse<AuthPayload>>(
    "/auth/register",
    payload,
  );
  return data;
}

export async function getMe() {
  const { data } = await apiClient.get<ApiResponse<AuthPayload["user"]>>(
    "/auth/me",
  );
  return data;
}
