import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { getExamConfig, getExamQuestions, startOrResumeExamForStudent } from "@/lib/db"
import { StudentExamClient } from "@/components/student-exam-client"

export default async function StudentExamsPage() {
  const sessionUser = await getSessionUser()

  if (!sessionUser || sessionUser.role !== "student") {
    redirect("/tsr-academy/login")
  }

  const [config, questions] = await Promise.all([
    getExamConfig(),
    getExamQuestions(),
  ])

  let answer = null

  // Only try to get/resume exam if it's active
  if (config.status === "active") {
    try {
      answer = await startOrResumeExamForStudent(sessionUser.id)
    } catch {
      answer = null
    }
  }

  return (
    <StudentExamClient
      initialData={{ config, questions, answer }}
    />
  )
}
