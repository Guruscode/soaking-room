import Link from "next/link"
import { redirect } from "next/navigation"
import { getStudentDashboardData } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

export default async function StudentNotificationsPage() {
  const sessionUser = await getSessionUser()

  if (!sessionUser || sessionUser.role !== "student") {
    redirect("/tsr-academy/login")
  }

  const { notifications } = await getStudentDashboardData(sessionUser.id)

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h2 className="text-2xl font-semibold">Notifications</h2>
      <p className="mt-2 text-sm text-slate-600">Broadcasts from the academy appear here automatically.</p>
      <div className="mt-4 space-y-4">
        {notifications.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <span className="text-xs text-slate-500">
                {new Date(item.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{item.message}</p>
            {item.classStartAt ? (
              <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <p className="font-medium">{item.className || "Upcoming class"}</p>
                <p className="mt-1">{new Date(item.classStartAt).toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" })}</p>
                <p className="mt-1 capitalize">{item.classMode || "online"}</p>
                {item.classMode === "online" && item.meetingLink ? (
                  <Link href={item.meetingLink} className="mt-2 inline-block text-sm font-medium text-slate-900 underline" target="_blank" rel="noopener noreferrer">
                    Open class link
                  </Link>
                ) : null}
                {item.classMode === "physical" && item.venue ? <p className="mt-1">Venue: {item.venue}</p> : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
