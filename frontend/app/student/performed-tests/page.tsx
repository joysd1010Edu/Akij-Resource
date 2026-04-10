"use client";
/* ==========  frontend/app/student/performed-tests/page.tsx  ===============*/

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPerformedExamsHistory } from "@/lib/api/student";

export default function PerformedTestsPage() {
  const [status, setStatus] = useState<"submitted" | "timeout" | "all">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["student", "performed-tests", status],
    queryFn: () =>
      getPerformedExamsHistory({
        page: 1,
        limit: 20,
        status,
      }),
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 animate-page-enter">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Performed Test</h1>
          <p className="text-sm text-slate-600">
            Review all completed attempts with score and result snapshots.
          </p>
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "submitted" | "timeout" | "all")}
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/20"
        >
          <option value="all">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="timeout">Timeout</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data?.items || []).map((attempt) => (
          <Card key={attempt.attempt_id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <span>{attempt.test.title}</span>
                <Badge variant="secondary">{attempt.attempt_status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-600">
              <p>Attempt No: {attempt.attempt_no}</p>
              <p>
                Marks: {attempt.result_summary?.final_marks ?? attempt.totals.obtained_marks} /
                {" "}
                {attempt.totals.total_marks}
              </p>
              <p>Grade: {attempt.result_summary?.grade || "Pending"}</p>
              <p>Result Visible: {attempt.result_available ? "Yes" : "No"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && (data?.items || []).length === 0 ? (
        <p className="mt-5 text-sm text-slate-500">No performed tests yet.</p>
      ) : null}
    </section>
  );
}
