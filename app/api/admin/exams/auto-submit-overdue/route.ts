import { NextResponse } from "next/server"
import { autoSubmitOverdueExams } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"

export async function POST() {
  try {
    await requireAdminSession()
    const count = await autoSubmitOverdueExams()
    return NextResponse.json({ data: { count } })
  } catch (error) {
    return handleRouteError(error)
  }
}
