/* ==========  frontend/types/auth.ts  ===============*/
export type UserRole = "teacher" | "student" | "admin";

export interface AuthUser {
  id: string;
  ref_id?: string;
  full_name: string;
  email: string;
  user_id_login: string;
  role: UserRole;
  status?: string;
  profile_image?: string | null;
  phone?: string | null;
  last_login_at?: string | null;
}

export interface AuthPayload {
  token?: string;
  access_token?: string;
  refresh_token?: string;
  access_expires_in?: string;
  refresh_expires_in?: string;
  user: AuthUser;
}
