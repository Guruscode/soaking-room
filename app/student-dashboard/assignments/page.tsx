import { redirect } from "next/navigation"
import { getStudentDashboardData } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

export default async function StudentAssignmentsPage() {
  const sessionUser = await getSessionUser()

  if (!sessionUser || sessionUser.role !== "student") {
    redirect("/tsr-academy/login")
  }

  const { assignments } = await getStudentDashboardData(sessionUser.id)

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h2 className="text-2xl font-semibold">Assignments</h2>
      <p className="mt-2 text-sm text-slate-600">Assignments are published by the academy team. Students can view them here.</p>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-4 font-medium">Title</th>
              <th className="py-2 pr-4 font-medium">Instructions</th>
              <th className="py-2 pr-4 font-medium">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 text-slate-700 align-top">
                <td className="py-2 pr-4">{row.title}</td>
                <td className="py-2 pr-4">{row.instructions}</td>
                <td className="py-2 pr-4">{new Date(row.dueDate).toLocaleDateString("en-NG", { dateStyle: "medium" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
