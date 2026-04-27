import { redirect } from "next/navigation"
import { getStudentDashboardData } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

export default async function StudentScoreSheetPage() {
  const sessionUser = await getSessionUser()

  if (!sessionUser || sessionUser.role !== "student") {
    redirect("/tsr-academy/login")
  }

  const { assignments } = await getStudentDashboardData(sessionUser.id)
  const gradedAssignments = assignments.filter((assignment) => assignment.submission)

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-2xl font-semibold">Score Sheet</h2>
        <p className="mt-2 text-sm text-slate-600">
          View assignment scores and comments from the academy team.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        {gradedAssignments.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-4 font-medium">Assignment</th>
                  <th className="py-2 pr-4 font-medium">Submission</th>
                  <th className="py-2 pr-4 font-medium">Score</th>
                  <th className="py-2 pr-4 font-medium">Comment</th>
                  <th className="py-2 pr-4 font-medium">Reviewed</th>
                </tr>
              </thead>
              <tbody>
                {gradedAssignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b border-slate-100 align-top text-slate-700">
                    <td className="py-2 pr-4">{assignment.title}</td>
                    <td className="py-2 pr-4 capitalize">{assignment.submission?.submissionType || "-"}</td>
                    <td className="py-2 pr-4">{assignment.submission?.score ?? "-"}</td>
                    <td className="py-2 pr-4 whitespace-pre-wrap">{assignment.submission?.adminComment || "-"}</td>
                    <td className="py-2 pr-4">
                      {assignment.submission?.reviewedAt
                        ? `${assignment.submission.reviewedByName || "Admin"} · ${new Date(assignment.submission.reviewedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}`
                        : "Pending review"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            No submissions yet. Once you submit an assignment, your scores and comments will appear here.
          </div>
        )}
      </div>
    </div>
  )
}
