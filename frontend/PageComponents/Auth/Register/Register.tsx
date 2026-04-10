"use client";
/* ==========  frontend/PageComponents/Auth/Register/Register.tsx  ===============*/

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff, FiUserPlus } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage, useRegisterMutation } from "@/PageComponents/Hooks/useAuth";
import {
  registerSchema,
  type RegisterSchemaInput,
} from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/authStore";

/* ==========  Function routeByRole contains reusable module logic used by this feature.  ===============*/
function routeByRole(role?: string) {
  if (role === "teacher") {
    return "/teacher/dashboard";
  }

  if (role === "student") {
    return "/student/dashboard";
  }

  return "/";
}

export default function Register() {
  const router = useRouter();
  const mutation = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      user_id_login: "",
      password: "",
      role: "student",
    },
  });

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (token && user) {
      router.replace(routeByRole(user.role));
    }
  }, [hasHydrated, router, token, user]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await mutation.mutateAsync(values);
      router.push(routeByRole(res.data.user.role));
    } catch {
      // Error is handled in UI.
    }
  });

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-10 animate-page-enter">
      <Card className="w-full max-w-xl shadow-lg shadow-slate-300/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-slate-800">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="full_name">
                Full Name
              </label>
              <Input id="full_name" placeholder="Enter full name" {...register("full_name")} />
              {errors.full_name ? (
                <p className="text-xs text-red-600">{errors.full_name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                Email
              </label>
              <Input id="email" placeholder="Enter email" {...register("email")} />
              {errors.email ? (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="user_id_login">
                User ID
              </label>
              <Input
                id="user_id_login"
                placeholder="Enter user id"
                {...register("user_id_login")}
              />
              {errors.user_id_login ? (
                <p className="text-xs text-red-600">{errors.user_id_login.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                {...register("role")}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              {errors.role ? (
                <p className="text-xs text-red-600">{errors.role.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Create password"
                  type={showPassword ? "text" : "password"}
                  className="pr-11"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition-colors hover:text-slate-800"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              ) : null}
            </div>

            {mutation.isError ? (
              <p className="sm:col-span-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {getApiErrorMessage(mutation.error)}
              </p>
            ) : null}

            <Button
              type="submit"
              className="sm:col-span-2 h-11 w-full bg-indigo-700 text-white hover:bg-indigo-600"
              disabled={mutation.isPending}
            >
              <FiUserPlus size={16} />
              {mutation.isPending ? "Creating account..." : "Register"}
            </Button>

            <p className="sm:col-span-2 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-indigo-700 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
