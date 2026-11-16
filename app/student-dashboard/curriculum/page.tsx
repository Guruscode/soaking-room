import { redirect } from "next/navigation"
import { getStudentDashboardData } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

export default async function StudentCurriculumPage() {
  const sessionUser = await getSessionUser()

  if (!sessionUser || sessionUser.role !== "student") {
    redirect("/tsr-academy/login")
  }

  const { curriculum } = await getStudentDashboardData(sessionUser.id)

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">Curriculum</h2>
      <p className="mt-2 text-sm text-slate-600">View the published text modules prepared for your category and academy-wide classes.</p>
      <div className="mt-4 space-y-4">
        {curriculum.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">{item.week}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{item.category}</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{item.content}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
