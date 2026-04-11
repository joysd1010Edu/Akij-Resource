"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getApiErrorMessage,
  useLoginMutation,
} from "@/PageComponents/Hooks/useAuth";
import { showTaskError, showTaskSuccess } from "@/lib/alerts/appAlert";
import { loginSchema, type LoginSchemaInput } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/authStore";

/* ==========  routing based on role  ===============*/
function routeByRole(role?: string) {
  if (role === "teacher") {
    return "/teacher/dashboard";
  }

  if (role === "student") {
    return "/student/dashboard";
  }

  return "/";
}

export default function Login() {
  const router = useRouter();
  const mutation = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
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
      await showTaskSuccess(
        "Login",
        `Welcome back ${res.data.user.full_name}. Redirecting to your dashboard.`,
      );
      router.push(routeByRole(res.data.user.role));
    } catch (error) {
      await showTaskError("Login", getApiErrorMessage(error));
    }
  });

  return (
    <section className="mx-auto min-h-[85vh] flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-10 animate-page-enter">
      <Card className="w-full max-w-md shadow-lg shadow-slate-300/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-slate-800">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="login"
              >
                Email / User ID
              </label>
              <Input
                id="login"
                placeholder="Enter your email/User ID"
                {...register("login")}
              />
              {errors.login ? (
                <p className="text-xs text-red-600">{errors.login.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Enter your password"
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
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            {mutation.isError ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {getApiErrorMessage(mutation.error)}
              </p>
            ) : null}

            <Button
              type="submit"
              className="h-11 w-full bg-indigo-700 text-white hover:bg-indigo-600"
              disabled={mutation.isPending}
            >
              <FiLogIn size={16} />
              {mutation.isPending ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Do not have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-700 hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
