import { NextResponse } from "next/server"
import { listExamMessagesForStudent } from "@/lib/db"
import { handleRouteError, requireStudentSession } from "@/lib/route-helpers"

export async function GET() {
  try {
    const student = await requireStudentSession()
    const messages = await listExamMessagesForStudent(student.id)

    return NextResponse.json({ data: messages })
  } catch (error) {
    return handleRouteError(error)
  }
}
