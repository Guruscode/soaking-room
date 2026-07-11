import { NextResponse } from "next/server"
import { sendExamMessage } from "@/lib/db"
import { handleRouteError, requireStudentSession } from "@/lib/route-helpers"

export async function POST(request: Request) {
  try {
    const student = await requireStudentSession()
    const payload = (await request.json()) as { message: string }

    const result = await sendExamMessage(student.id, payload)

    return NextResponse.json({ data: result })
  } catch (error) {
    return handleRouteError(error)
  }
}
