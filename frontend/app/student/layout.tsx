/* ==========  frontend/app/student/layout.tsx  ===============*/
import RoleGuard from "@/PageComponents/Auth/RoleGuard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard className="" requiredRole="student">{children}</RoleGuard>;
}
