import Link from "next/link"
import { Activity, BookOpenText, CalendarClock, Clock3, GraduationCap, Megaphone, UserCheck2 } from "lucide-react"
import { type ElementType } from "react"
import { Button } from "@/components/ui/button"
import { getOverviewMetrics } from "@/lib/db"

export default async function AdminOverviewPage() {
  const overview = await getOverviewMetrics()
  const totalStudents = overview.totalStudents || 1
  const classPipeline = [
    { label: "Pending approvals", value: Math.round((overview.pendingApprovals / totalStudents) * 100) },
    { label: "Approved students", value: Math.round((overview.approvedStudents / totalStudents) * 100) },
    { label: "Rejected students", value: Math.round((overview.rejectedStudents / totalStudents) * 100) },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Command Center</p>
        <h2 className="mt-2 text-2xl font-semibold">Academy Operations Overview</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-200">
          Monitor admissions, curriculum delivery, and communication flow from one central dashboard.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild className="rounded-xl bg-white text-slate-900 hover:bg-slate-100">
            <Link href="/admin/admissions">Review Admissions</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl bg-slate-900 border-slate-400 text-white hover:bg-slate-700">
            <Link href="/admin/curriculum">Manage Curriculum</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={GraduationCap} label="Total Students" value={String(overview.totalStudents)} trend="Registered student records" />
        <Metric icon={UserCheck2} label="Pending Approvals" value={String(overview.pendingApprovals)} trend="Applications waiting for review" />
        <Metric icon={BookOpenText} label="Curriculum Items" value={String(overview.totalCurriculumItems)} trend="Published learning modules" />
        <Metric icon={Megaphone} label="Broadcasts" value={String(overview.totalBroadcasts)} trend="Announcements sent to students" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Program Pipeline</h3>
          <div className="mt-4 space-y-4">
            {classPipeline.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-slate-900" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Upcoming Items</h3>
          <div className="mt-4 space-y-3">
            <Upcoming icon={Clock3} title="Teachers Guides" detail={`${overview.totalTeachersGuides} guide entries ready for class prep`} />
            <Upcoming icon={CalendarClock} title="Approved Students" detail={`${overview.approvedStudents} students cleared for onboarding`} />
            <Upcoming icon={Activity} title="Rejected Students" detail={`${overview.rejectedStudents} records still need follow-up`} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4 font-medium">Activity</th>
                <th className="py-2 pr-4 font-medium">Details</th>
                <th className="py-2 pr-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {overview.recentActivity.map((row) => (
                <tr key={`${row.item}-${row.time}`} className="border-b border-slate-100 text-slate-700">
                  <td className="py-2 pr-4">{row.item}</td>
                  <td className="py-2 pr-4">{row.detail}</td>
                  <td className="py-2 pr-4">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: ElementType
  label: string
  value: string
  trend: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <Icon className="h-4 w-4 text-slate-700" />
      <p className="mt-2 text-sm text-slate-600">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-emerald-700">{trend}</p>
    </div>
  )
}

function Upcoming({
  icon: Icon,
  title,
  detail,
}: {
  icon: ElementType
  title: string
  detail: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-900">
        <Icon className="h-4 w-4" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="mt-1 text-xs text-slate-600">{detail}</p>
    </div>
  )
}
