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

  // Only try to get/resume exam if it's active AND proctoring is not required
  // When proctoring is required, the exam starts only after the student grants permissions
  if (config.status === "active" && !config.requiresProctoring) {
    try {
      answer = await startOrResumeExamForStudent(sessionUser.id)
    } catch {
      answer = null
    }
  }

  // If proctoring is required and there's an existing draft, still resume it
  if (config.status === "active" && config.requiresProctoring) {
    try {
      // Only resume if there's already an answer (draft) — don't create a new one
      const existing = await startOrResumeExamForStudent(sessionUser.id).catch(() => null)
      if (existing && existing.isSubmitted) {
        answer = existing
      } else if (existing && !existing.isSubmitted) {
        // There's an existing draft — the student had already started with proctoring
        answer = existing
      }
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
