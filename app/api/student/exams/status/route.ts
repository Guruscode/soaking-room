import { NextResponse } from "next/server"
import { getExamConfig } from "@/lib/db"
import { handleRouteError, requireStudentSession } from "@/lib/route-helpers"

export async function GET() {
  try {
    await requireStudentSession()
    const config = await getExamConfig()

    return NextResponse.json({ data: { status: config.status } })
  } catch (error) {
    return handleRouteError(error)
  }
}
