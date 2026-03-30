import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getStudentDashboardData } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

export default async function StudentNextClassPage() {
  const sessionUser = await getSessionUser()

  if (!sessionUser || sessionUser.role !== "student") {
    redirect("/tsr-academy/login")
  }

  const { nextClass, classSchedule } = await getStudentDashboardData(sessionUser.id)

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="text-2xl font-semibold">Next Class</h2>
        {nextClass ? (
          <>
            <p className="mt-2 text-sm text-slate-700">{nextClass.className || nextClass.title}</p>
            <p className="mt-1 text-sm text-slate-700">
              {new Date(nextClass.classStartAt!).toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" })}
            </p>
            <p className="mt-1 text-sm text-slate-700 capitalize">{nextClass.classMode || "online"} class</p>
            {nextClass.classMode === "online" && nextClass.meetingLink ? (
              <Button asChild className="mt-3 rounded-xl bg-slate-900">
                <Link href={nextClass.meetingLink} target="_blank" rel="noopener noreferrer">Join Class Link</Link>
              </Button>
            ) : null}
            {nextClass.classMode === "physical" && nextClass.venue ? (
              <p className="mt-3 text-sm text-slate-700">Venue: {nextClass.venue}</p>
            ) : null}
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-700">No upcoming class has been published yet.</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Published Class Schedule</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4 font-medium">Class</th>
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 pr-4 font-medium">Mode</th>
                <th className="py-2 pr-4 font-medium">Access</th>
              </tr>
            </thead>
            <tbody>
              {classSchedule.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                  <td className="py-2 pr-4">{row.className || row.title}</td>
                  <td className="py-2 pr-4">{new Date(row.classStartAt!).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td className="py-2 pr-4 capitalize">{row.classMode || "-"}</td>
                  <td className="py-2 pr-4">{row.classMode === "online" ? row.meetingLink || "-" : row.venue || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
