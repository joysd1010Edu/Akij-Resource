"use client";
/* ==========  frontend/app/teacher/tests/page.tsx  ===============*/

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFileText,
  FiSearch,
  FiUsers,
} from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTeacherTests } from "@/lib/api/teacher";

const PAGE_SIZE_OPTIONS = [4, 8, 12, 20];

export default function TeacherTestsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["teacher", "tests", search, page, limit],
    queryFn: () =>
      getTeacherTests({
        page,
        limit,
        search: search.trim() || undefined,
      }),
  });

  const tests = data?.items || [];
  const meta = data?.meta;
  const currentPage = meta?.page || page;
  const totalPages = meta?.total_pages || 1;
  const canGoPrev = meta ? meta.has_prev : currentPage > 1;
  const canGoNext = meta ? meta.has_next : currentPage < totalPages;

  /* ==========  Function changePage handles pagination movement for teacher tests list.  ===============*/
  function changePage(nextPage: number) {
    if (nextPage < 1) {
      return;
    }

    if (totalPages > 0 && nextPage > totalPages) {
      return;
    }

    setPage(nextPage);
  }

  return (
    <section className="mx-auto min-h-[85vh] w-full max-w-7xl px-4 py-8 animate-page-enter">
      <div className="mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Online Tests
          </h1>
          <p className="text-sm text-slate-600">
            Browse and manage your created exams.
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xl">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by exam title"
            className="h-11 rounded-lg border-indigo-200 pr-10 text-sm focus-visible:ring-indigo-300"
          />
          <FiSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500" />
        </div>

        <Button
          asChild
          className="h-11 rounded-lg bg-indigo-600 px-6 text-white hover:bg-indigo-500"
        >
          <Link href="/teacher/tests/create">Create Online Test</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-slate-200 bg-white shadow-none">
              <CardHeader>
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
                <div className="h-9 w-32 animate-pulse rounded bg-slate-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tests.length === 0 ? (
        <Card className="border-slate-200 bg-white shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <Image
              src="/no-test.png"
              alt="No online test available"
              width={90}
              height={90}
              className="mb-3"
            />
            <h2 className="text-xl font-semibold text-slate-800">
              No Online Test Available
            </h2>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              Currently, there are no online tests available. Please check back
              later for updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {tests.map((test) => (
              <Card
                key={test._id}
                className="rounded-xl border-slate-200 bg-white shadow-none"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold text-slate-800">
                    {test.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-600">
                  <div className="grid grid-cols-1 gap-2 text-xs text-slate-500 sm:grid-cols-3 sm:gap-3 sm:text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <FiUsers size={14} /> Candidates:{" "}
                      {test.total_candidates.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FiFileText size={14} /> Question Set:{" "}
                      {test.total_question_set}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FiClock size={14} /> Exam Slots: {test.total_slots}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      asChild
                      className="h-9 rounded-lg border-indigo-400 text-indigo-700 hover:bg-indigo-50"
                    >
                      <Link
                        href={`/teacher/assign-students?testId=${test._id}`}
                      >
                        View Candidates
                      </Link>
                    </Button>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                      {test.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => changePage(currentPage - 1)}
                disabled={!canGoPrev}
                className="h-8 w-8 rounded border border-slate-200"
              >
                <FiChevronLeft size={14} />
              </Button>

              <span className="min-w-8 text-center font-medium text-slate-700">
                {currentPage}
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => changePage(currentPage + 1)}
                disabled={!canGoNext}
                className="h-8 w-8 rounded border border-slate-200"
              >
                <FiChevronRight size={14} />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 sm:text-sm">
                Online Test Per Page
              </span>
              <select
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
                className="h-8 rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 sm:text-sm"
              >
                {PAGE_SIZE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {isFetching && !isLoading ? (
        <p className="mt-2 text-xs text-slate-500">Updating tests...</p>
      ) : null}
    </section>
  );
}
