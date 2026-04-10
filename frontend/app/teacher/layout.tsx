/* ==========  frontend/app/teacher/layout.tsx  ===============*/
import RoleGuard from "@/PageComponents/Auth/RoleGuard";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard requiredRole="teacher">{children}</RoleGuard>;
}
