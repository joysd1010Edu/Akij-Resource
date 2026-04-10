/* ==========  frontend/lib/api/student.ts  ===============*/
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

import { apiClient } from "./client";

export interface StudentDashboardMetrics {
  assigned_tests: number;
  completed_tests: number;
  pending_tests: number;
  total_correct: number;
  total_wrong: number;
  total_skipped: number;
  average_marks: number;
  highest_marks: number;
  accuracy_rate: number;
  total_negative_marks: number;
  best_test_score: number;
  last_test_score: number;
}

export interface AssignedTest {
  candidate_id: string;
  test_id: string;
  title: string;
  duration_minutes: number;
  total_questions: number;
  negative_mark_per_wrong: number;
  start_time: string;
  end_time: string;
  status: string;
  attendance_status: string;
}

export interface PerformedAttempt {
  attempt_id: string;
  test_id: string;
  slot_id: string;
  question_set_id: string;
  attempt_no: number;
  attempt_status: string;
  started_at: string;
  submitted_at: string | null;
  auto_submitted: boolean;
  totals: {
    total_questions: number;
    answered: number;
    skipped: number;
    correct: number;
    wrong: number;
    text_pending_review_count: number;
    total_marks: number;
    obtained_marks: number;
  };
  test: {
    test_id: string;
    title: string;
    slug: string;
    status: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
  };
  result_available: boolean;
  result_summary: {
    final_marks: number;
    percentage: number;
    grade: string;
    result_status: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export async function getStudentDashboardMetrics() {
  const { data } =
    await apiClient.get<ApiResponse<StudentDashboardMetrics>>(
      "/student/dashboard/metrics",
    );
  return data;
}

export async function getAssignedTests(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { data } = await apiClient.get<ApiResponse<AssignedTest[]>>(
    "/student/tests",
    {
      params,
    },
  );

  return {
    items: data.data,
    meta: data.meta as PaginationMeta | undefined,
  };
}

export async function getPerformedExamsHistory(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "submitted" | "timeout" | "all";
}) {
  const { data } = await apiClient.get<ApiResponse<PerformedAttempt[]>>(
    "/student/attempts/history",
    {
      params,
    },
  );

  return {
    items: data.data,
    meta: data.meta as PaginationMeta | undefined,
  };
}
