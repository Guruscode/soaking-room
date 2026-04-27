import { redirect } from "next/navigation"
import { StudentAssignmentsClient } from "@/components/student-assignments-client"
import { getStudentDashboardData } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

export default async function StudentAssignmentsPage() {
  const sessionUser = await getSessionUser()

  if (!sessionUser || sessionUser.role !== "student") {
    redirect("/tsr-academy/login")
  }

  const { assignments } = await getStudentDashboardData(sessionUser.id)

  return (
    <StudentAssignmentsClient assignments={assignments} />
  )
}
