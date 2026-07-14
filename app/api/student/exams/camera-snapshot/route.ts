import { NextResponse } from "next/server"
import { saveCameraSnapshot } from "@/lib/db"
import { handleRouteError, requireStudentSession } from "@/lib/route-helpers"

export async function POST(request: Request) {
  try {
    const student = await requireStudentSession()
    const { imageBase64 } = (await request.json()) as { imageBase64: string }

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "Invalid snapshot data." }, { status: 400 })
    }

    const result = await saveCameraSnapshot(student.id, imageBase64)

    return NextResponse.json({ data: result })
  } catch (error) {
    return handleRouteError(error)
  }
}
