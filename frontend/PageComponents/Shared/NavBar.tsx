"use client";
/* ==========  frontend/PageComponents/Shared/NavBar.tsx  ===============*/

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut, FiUser } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

type NavLink = {
  href: string;
  label: string;
};

/* ==========  Function dashboardRouteByRole contains reusable module logic used by this feature.  ===============*/
function dashboardRouteByRole(role?: string) {
  if (role === "teacher") {
    return "/teacher/dashboard";
  }

  if (role === "student") {
    return "/student/dashboard";
  }

  return "/";
}

/* ==========  Function getRoleLinks gets get role links data for the current module flow.  ===============*/
function getRoleLinks(pathname: string): NavLink[] {
  if (pathname.startsWith("/student")) {
    return [
      { href: "/student/dashboard", label: "Dashboard" },
      { href: "/student/tests", label: "All Test" },
      { href: "/student/performed-tests", label: "Performed Test" },
    ];
  }

  if (pathname.startsWith("/teacher")) {
    return [
      { href: "/teacher/dashboard", label: "Dashboard" },
      { href: "/teacher/tests", label: "All Test" },
      { href: "/teacher/assign-students", label: "Assign Students" },
    ];
  }

  return [];
}

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const isLoggedIn = hasHydrated && Boolean(token) && Boolean(user);
  const isRoleArea =
    pathname.startsWith("/student") || pathname.startsWith("/teacher");
  const navLinks = getRoleLinks(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform duration-300 hover:scale-[1.01]"
        >
          <Image
            src="/logo.png"
            alt="AKIJ Resource"
            width={120}
            height={36}
            priority
          />
        </Link>

        {navLinks.length > 0 ? (
          <nav className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-1.5 transition-colors duration-200",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        ) : (
          <div className="hidden md:block" />
        )}

        <div className="flex items-center gap-2">
          <Button variant={pathname === "/" ? "default" : "ghost"} asChild>
            <Link href="/">Home</Link>
          </Button>

          {!isLoggedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button
                className="bg-indigo-700 text-white hover:bg-indigo-600"
                asChild
              >
                <Link href="/register">Register</Link>
              </Button>
            </>
          ) : (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 md:flex">
                <FiUser size={14} />
                <span>{user?.full_name}</span>
              </div>

              {!isRoleArea ? (
                <Button variant="outline" asChild>
                  <Link href={dashboardRouteByRole(user?.role)}>Dashboard</Link>
                </Button>
              ) : null}

              <Button
                variant="ghost"
                onClick={() => {
                  clearAuth();
                  router.push("/");
                }}
              >
                <FiLogOut size={16} />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
