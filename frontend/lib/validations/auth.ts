/* ==========  frontend/lib/validations/auth.ts  ===============*/
import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().trim().min(1, "Email or user ID is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

export type LoginSchemaInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  user_id_login: z
    .string()
    .trim()
    .min(3, "User ID must be at least 3 characters")
    .max(40, "User ID is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
      "Password must include letter, number and symbol",
    ),
  role: z.enum(["student", "teacher"]),
});

export type RegisterSchemaInput = z.infer<typeof registerSchema>;
