import { NextResponse } from "next/server"
import { deleteStudentProctoringData, getExamConfig, getExamQuestions, getProctoringDataForStudent, listProctoringSummariesByExam } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"

export async function GET(request: Request) {
  try {
    await requireAdminSession()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      // Return detailed proctoring data for a specific student
      const data = await getProctoringDataForStudent(userId)
      return NextResponse.json({ data })
    }

    // Return summary for all students
    const [config, questions, summaries] = await Promise.all([
      getExamConfig(),
      getExamQuestions(),
      listProctoringSummariesByExam(),
    ])

    return NextResponse.json({ data: { config, questions, summaries } })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminSession()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 })
    }

    await deleteStudentProctoringData(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleRouteError(error)
  }
}
