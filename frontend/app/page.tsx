/* ==========  frontend/app/page.tsx  ===============*/
import Image from "next/image";
import { FiBarChart2, FiBookOpen, FiShield, FiUsers } from "react-icons/fi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "Secure Assessment",
    description:
      "Role-based access, exam-slot mapping, and controlled publishing make every assessment workflow trusted.",
    icon: FiShield,
  },
  {
    title: "Teacher Productivity",
    description:
      "Create tests, assign students, monitor progress, and review text answers from one unified workflow.",
    icon: FiBookOpen,
  },
  {
    title: "Student Focus",
    description:
      "Students get clean dashboards for assigned tests, performance history, and result visibility.",
    icon: FiUsers,
  },
  {
    title: "Live Metrics",
    description:
      "Track attendance, attempts, submissions, and outcome quality through concise operational dashboards.",
    icon: FiBarChart2,
  },
];

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 animate-page-enter">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-100 p-6 shadow-sm sm:p-10">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-100 blur-3xl" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <p className="font-[family-name:var(--font-space-grotesk)] text-xs uppercase tracking-[0.2em] text-slate-600">
              AKIJ IBOS Platform
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              Smart Online Test Management for Teachers and Students
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              AKIJ IBOS is a complete online test ecosystem for creating exams,
              assigning candidates, conducting timed attempts, and tracking
              performance through actionable dashboards. It helps academic and
              training teams run structured assessments with speed, clarity, and
              control.
            </p>
          </div>

          <Image
            src="/logo.png"
            alt="AKIJ Resource logo"
            width={210}
            height={76}
            className="animate-soft-pulse"
            priority
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              className="transition-transform duration-300 hover:-translate-y-1"
            >
              <CardHeader className="pb-2">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                  <Icon size={17} />
                </div>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Why AKIJ IBOS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-600">
              Built for real-world exam operations where teacher workflows,
              student experience, and reporting reliability all matter equally.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Online Test Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-600">
              Create test, assign slot and question set, publish to students,
              collect attempts, evaluate results, and track performance metrics.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Result & Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-600">
              MCQ is auto-evaluated instantly and text answers can be reviewed
              manually with updated final result snapshots.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-300/70 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Quick AKIJ IBOS Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-slate-200 md:grid-cols-3">
          <div>
            <p className="text-xl font-semibold text-white">Role Aware</p>
            <p>
              Teacher and student dashboards stay separated with strict route
              access rules.
            </p>
          </div>
          <div>
            <p className="text-xl font-semibold text-white">Time Controlled</p>
            <p>
              Slot windows and attempt timers keep every online test session
              fair and consistent.
            </p>
          </div>
          <div>
            <p className="text-xl font-semibold text-white">Insight Driven</p>
            <p>
              Real-time metrics for attendance, attempts, and outcome quality
              help improve future tests.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
