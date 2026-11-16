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
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-shadow hover:shadow-[0_18px_40px_-28px_rgb(15_23_42/0.35)]">
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">Score Sheet</h2>
        <p className="mt-2 text-sm text-slate-600">
          View assignment scores and comments from the academy team.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-shadow hover:shadow-[0_18px_40px_-28px_rgb(15_23_42/0.35)]">
        {gradedAssignments.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[0.7rem] uppercase tracking-[0.1em] text-slate-500">
                  <th className="py-3 pr-4 font-medium">Assignment</th>
                  <th className="py-3 pr-4 font-medium">Submission</th>
                  <th className="py-3 pr-4 font-medium">Score</th>
                  <th className="py-3 pr-4 font-medium">Comment</th>
                  <th className="py-3 pr-4 font-medium">Reviewed</th>
                </tr>
              </thead>
              <tbody>
                {gradedAssignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b border-slate-100 align-top text-slate-700">
                    <td className="py-3.5 pr-4">{assignment.title}</td>
                    <td className="py-3.5 pr-4 capitalize">{assignment.submission?.submissionType || "-"}</td>
                    <td className="py-3.5 pr-4">{assignment.submission?.score ?? "-"}</td>
                    <td className="py-2 pr-4 whitespace-pre-wrap">{assignment.submission?.adminComment || "-"}</td>
                    <td className="py-3.5 pr-4">
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
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-10 text-center text-sm text-slate-500">
            No submissions yet. Once you submit an assignment, your scores and comments will appear here.
          </div>
        )}
      </div>
    </div>
  )
}
