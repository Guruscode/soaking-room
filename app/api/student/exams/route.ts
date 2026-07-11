import { NextResponse } from "next/server"
import { getExamConfig, getExamQuestions, startOrResumeExamForStudent } from "@/lib/db"
import { handleRouteError, requireStudentSession } from "@/lib/route-helpers"

export async function GET() {
  try {
    const student = await requireStudentSession()
    const [config, questions, answer] = await Promise.all([
      getExamConfig(),
      getExamQuestions(),
      startOrResumeExamForStudent(student.id).catch(() => null),
    ])

    return NextResponse.json({ data: { config, questions, answer } })
  } catch (error) {
    return handleRouteError(error)
  }
}
