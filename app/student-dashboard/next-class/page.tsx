import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getStudentDashboardData } from "@/lib/db"
import { getSessionUser } from "@/lib/session"
import { normalizeExternalUrl } from "@/lib/utils"

export default async function StudentNextClassPage() {
  const sessionUser = await getSessionUser()

  if (!sessionUser || sessionUser.role !== "student") {
    redirect("/tsr-academy/login")
  }

  const { nextClass, classSchedule } = await getStudentDashboardData(sessionUser.id)
  const nextClassMeetingUrl = normalizeExternalUrl(nextClass?.meetingLink)

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">Next Class</h2>
        {nextClass ? (
          <>
            <p className="mt-2 text-sm text-slate-700">{nextClass.className || nextClass.title}</p>
            <p className="mt-1 text-sm text-slate-700">
              {new Date(nextClass.classStartAt!).toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" })}
            </p>
            <p className="mt-1 text-sm text-slate-700 capitalize">{nextClass.classMode || "online"} class</p>
            {nextClass.classMode === "online" && nextClassMeetingUrl ? (
              <Button asChild className="mt-3 bg-ink">
                <Link href={nextClassMeetingUrl} target="_blank" rel="noopener noreferrer">Join Class Link</Link>
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

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-shadow hover:shadow-[0_18px_40px_-28px_rgb(15_23_42/0.35)]">
        <h3 className="text-lg font-semibold tracking-tight text-ink">Class Schedule</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[0.7rem] uppercase tracking-[0.1em] text-slate-500">
                <th className="py-3 pr-4 font-medium">Class</th>
                <th className="py-3 pr-4 font-medium">Date</th>
                <th className="py-3 pr-4 font-medium">Mode</th>
                <th className="py-3 pr-4 font-medium">Access</th>
              </tr>
            </thead>
            <tbody>
              {classSchedule.map((row) => {
                const meetingUrl = normalizeExternalUrl(row.meetingLink)

                return (
                  <tr key={row.id} className="border-b border-slate-100 text-slate-700 transition-colors hover:bg-slate-50/80">
                    <td className="py-3.5 pr-4">{row.className || row.title}</td>
                    <td className="py-3.5 pr-4">{new Date(row.classStartAt!).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</td>
                    <td className="py-3.5 pr-4 capitalize">{row.classMode || "-"}</td>
                    <td className="py-3.5 pr-4">
                      {row.classMode === "online" && meetingUrl ? (
                        <Link href={meetingUrl} className="font-medium underline" target="_blank" rel="noopener noreferrer">
                          Open class link
                        </Link>
                      ) : row.classMode === "online" ? "-" : row.venue || "-"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
