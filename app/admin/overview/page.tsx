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
      <section className="border-l-2 border-[#c4a36a] bg-[#201e1a] p-6 text-white sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#d6bc8b]">Academy Operations</p>
        <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
          Overview
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
          Monitor admissions, curriculum delivery, and communication flow from one central dashboard.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="bg-[#c4a36a] text-[#201e1a] hover:bg-[#ddc89f]">
            <Link href="/admin/admissions">Review Admissions</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10 hover:text-white">
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

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold tracking-tight text-ink">Program Pipeline</h3>
          <div className="mt-4 space-y-4">
            {classPipeline.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-1.5 bg-slate-100">
                  <div className="h-1.5 origin-left bg-brand animate-[scale-in_1s_var(--ease-settle)_both]" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold tracking-tight text-ink">Upcoming Items</h3>
          <div className="mt-4 space-y-3">
            <Upcoming icon={Clock3} title="Teachers Guides" detail={`${overview.totalTeachersGuides} guide entries ready for class prep`} />
            <Upcoming icon={CalendarClock} title="Approved Students" detail={`${overview.approvedStudents} students cleared for onboarding`} />
            <Upcoming icon={Activity} title="Rejected Students" detail={`${overview.rejectedStudents} records still need follow-up`} />
          </div>
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold tracking-tight text-ink">Recent Activity</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[0.7rem] uppercase tracking-[0.1em] text-slate-500">
                <th className="py-3 pr-4 font-medium">Activity</th>
                <th className="py-3 pr-4 font-medium">Details</th>
                <th className="py-3 pr-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {overview.recentActivity.map((row) => (
                <tr key={`${row.item}-${row.time}`} className="border-b border-slate-100 text-slate-700 transition-colors hover:bg-slate-50/80">
                  <td className="py-3.5 pr-4">{row.item}</td>
                  <td className="py-3.5 pr-4">{row.detail}</td>
                  <td className="py-3.5 pr-4">{row.time}</td>
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
    <div className="border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <Icon className="size-5 text-brand-strong" />
      </div>
      <p className="mt-4 font-serif text-4xl tracking-tight text-ink tabular-nums">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{trend}</p>
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
    <div className="border-b border-slate-200 py-3 last:border-b-0">
      <div className="flex items-center gap-2 text-ink">
        <Icon className="size-4 text-brand-strong" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="mt-1 text-xs text-slate-600">{detail}</p>
    </div>
  )
}
