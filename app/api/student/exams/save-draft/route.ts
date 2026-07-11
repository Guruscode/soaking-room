import { NextResponse } from "next/server"
import { saveExamAnswersDraft } from "@/lib/db"
import { handleRouteError, requireStudentSession } from "@/lib/route-helpers"
import type { ExamSubmitPayload } from "@/lib/types"

async function handleSaveDraft(request: Request) {
  const student = await requireStudentSession()
  const payload = (await request.json()) as ExamSubmitPayload

  const result = await saveExamAnswersDraft(student.id, payload)

  return NextResponse.json({ data: result })
}

export async function PATCH(request: Request) {
  try {
    return await handleSaveDraft(request)
  } catch (error) {
    return handleRouteError(error)
  }
}

// sendBeacon always uses POST, so we need a POST handler too
// for the beforeunload draft save on page/tab close
export async function POST(request: Request) {
  try {
    return await handleSaveDraft(request)
  } catch (error) {
    return handleRouteError(error)
  }
}
