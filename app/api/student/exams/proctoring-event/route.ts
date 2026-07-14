import { NextResponse } from "next/server"
import { saveProctoringEvent } from "@/lib/db"
import { handleRouteError, requireStudentSession } from "@/lib/route-helpers"

export async function POST(request: Request) {
  try {
    const student = await requireStudentSession()
    const { eventType, eventData } = (await request.json()) as {
      eventType: string
      eventData?: string | null
    }

    if (!eventType || typeof eventType !== "string") {
      return NextResponse.json({ error: "Invalid event type." }, { status: 400 })
    }

    const result = await saveProctoringEvent(student.id, eventType, eventData)

    return NextResponse.json({ data: result })
  } catch (error) {
    return handleRouteError(error)
  }
}
