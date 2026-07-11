import { NextResponse } from "next/server"
import { listExamMessages } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"

export async function GET() {
  try {
    await requireAdminSession()
    const messages = await listExamMessages()
    return NextResponse.json({ data: messages })
  } catch (error) {
    return handleRouteError(error)
  }
}
