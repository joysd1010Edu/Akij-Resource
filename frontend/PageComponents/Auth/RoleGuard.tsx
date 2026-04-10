"use client";
/* ==========  frontend/PageComponents/Auth/RoleGuard.tsx  ===============*/

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import type { UserRole } from "@/types/auth";
import { useAuthStore } from "@/stores/authStore";

/* ==========  Function dashboardByRole contains reusable module logic used by this feature.  ===============*/
function dashboardByRole(role?: UserRole) {
  if (role === "teacher") {
    return "/teacher/dashboard";
  }

  if (role === "student") {
    return "/student/dashboard";
  }

  return "/";
}

export default function RoleGuard({
  requiredRole,
  children,
}: {
  requiredRole: Extract<UserRole, "teacher" | "student">;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== requiredRole) {
      router.replace(dashboardByRole(user.role));
    }
  }, [hasHydrated, requiredRole, router, token, user, pathname]);

  if (!hasHydrated || !token || !user || user.role !== requiredRole) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-16">
        <p className="text-sm text-slate-500">Checking access permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}
