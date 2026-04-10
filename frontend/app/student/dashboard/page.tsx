"use client";
/* ==========  frontend/app/student/dashboard/page.tsx  ===============*/

import { useQuery } from "@tanstack/react-query";
import { FiActivity, FiCheckCircle, FiClock, FiTarget } from "react-icons/fi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentDashboardMetrics } from "@/lib/api/student";

const widgets = [
  { key: "assigned_tests", label: "Assigned Tests", icon: FiClock },
  { key: "completed_tests", label: "Completed Tests", icon: FiCheckCircle },
  { key: "average_marks", label: "Average Marks", icon: FiTarget },
  { key: "accuracy_rate", label: "Accuracy Rate", icon: FiActivity },
] as const;

export default function StudentDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["student", "dashboard-metrics"],
    queryFn: getStudentDashboardMetrics,
  });

  const metrics = data?.data;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 animate-page-enter">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Student Dashboard</h1>
        <p className="text-sm text-slate-600">
          View your test activity, performance trend, and progress at a glance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {widgets.map((widget) => {
          const Icon = widget.icon;
          const value = metrics?.[widget.key] ?? 0;
          return (
            <Card key={widget.key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600">{widget.label}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-2xl font-semibold text-slate-900">
                  {isLoading ? "..." : typeof value === "number" ? value : 0}
                </p>
                <span className="rounded-lg bg-indigo-50 p-2 text-indigo-700">
                  <Icon size={16} />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
