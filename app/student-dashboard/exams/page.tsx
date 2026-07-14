import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { getExamConfig, getExamQuestions, getExistingExamAnswerForStudent, startOrResumeExamForStudent } from "@/lib/db"
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

  // If proctoring is required and there's an existing draft, load it without starting the timer
  // The exam answer will be created only after the student grants camera permissions
  if (config.status === "active" && config.requiresProctoring) {
    try {
      const existing = await getExistingExamAnswerForStudent(sessionUser.id)
      if (existing) {
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
