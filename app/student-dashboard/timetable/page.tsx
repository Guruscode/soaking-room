import { redirect } from "next/navigation"
import { getStudentDashboardData } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

export default async function StudentTimetablePage() {
  const sessionUser = await getSessionUser()

  if (!sessionUser || sessionUser.role !== "student") {
    redirect("/tsr-academy/login")
  }

  const { classSchedule } = await getStudentDashboardData(sessionUser.id)

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h2 className="text-2xl font-semibold">Weekly Timetable</h2>
      <p className="mt-2 text-sm text-slate-600">Published class schedule from academy broadcasts. This view is read-only.</p>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-4 font-medium">Class</th>
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Time</th>
              <th className="py-2 pr-4 font-medium">Mode</th>
              <th className="py-2 pr-4 font-medium">Venue / Link</th>
            </tr>
          </thead>
          <tbody>
            {classSchedule.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                <td className="py-2 pr-4">{row.className || row.title}</td>
                <td className="py-2 pr-4">{new Date(row.classStartAt!).toLocaleDateString("en-NG", { dateStyle: "medium" })}</td>
                <td className="py-2 pr-4">
                  {new Date(row.classStartAt!).toLocaleTimeString("en-NG", { timeStyle: "short" })}
                  {row.classEndAt ? ` - ${new Date(row.classEndAt).toLocaleTimeString("en-NG", { timeStyle: "short" })}` : ""}
                </td>
                <td className="py-2 pr-4 capitalize">{row.classMode || "-"}</td>
                <td className="py-2 pr-4">{row.classMode === "online" ? row.meetingLink || "-" : row.venue || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
