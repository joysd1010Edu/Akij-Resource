"use client";
/* ==========  frontend/app/student/tests/page.tsx  ===============*/

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAssignedTests } from "@/lib/api/student";

export default function StudentTestsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["student", "assigned-tests", search],
    queryFn: () => getAssignedTests({ page: 1, limit: 20, search }),
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 animate-page-enter">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">All Test</h1>
          <p className="text-sm text-slate-600">Assigned exams available for your account.</p>
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assigned exam"
          className="sm:w-72"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data?.items || []).map((item) => (
          <Card key={item.candidate_id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <span>{item.title}</span>
                <Badge variant="secondary">{item.attendance_status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-600">
              <p>Total Questions: {item.total_questions}</p>
              <p>Duration: {item.duration_minutes} min</p>
              <p>Status: {item.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && (data?.items || []).length === 0 ? (
        <p className="mt-5 text-sm text-slate-500">No assigned tests found.</p>
      ) : null}
    </section>
  );
}
