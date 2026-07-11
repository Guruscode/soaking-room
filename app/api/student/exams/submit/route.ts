import { NextResponse } from "next/server"
import { submitExamAnswers } from "@/lib/db"
import { handleRouteError, requireStudentSession } from "@/lib/route-helpers"
import type { ExamSubmitPayload } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const student = await requireStudentSession()
    const payload = (await request.json()) as ExamSubmitPayload

    const result = await submitExamAnswers(student.id, payload)

    return NextResponse.json({ data: result })
  } catch (error) {
    return handleRouteError(error)
  }
}
