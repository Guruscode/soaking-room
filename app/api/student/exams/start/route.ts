import { NextResponse } from "next/server"
import { getExamConfig, getExamQuestions, startOrResumeExamForStudent } from "@/lib/db"
import { handleRouteError, requireStudentSession } from "@/lib/route-helpers"

export async function POST() {
  try {
    const student = await requireStudentSession()

    // Start or resume the exam for this student
    const answer = await startOrResumeExamForStudent(student.id)

    const [config, questions] = await Promise.all([
      getExamConfig(),
      getExamQuestions(),
    ])

    return NextResponse.json({ data: { config, questions, answer } })
  } catch (error) {
    return handleRouteError(error)
  }
}
