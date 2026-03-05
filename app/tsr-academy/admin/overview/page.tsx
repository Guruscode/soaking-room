export default function AdminOverviewPage() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Stat label="Total Students" value="128" />
      <Stat label="Pending Approvals" value="14" />
      <Stat label="Classes This Week" value="4" />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}
