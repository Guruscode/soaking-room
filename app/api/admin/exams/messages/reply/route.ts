import { NextResponse } from "next/server"
import { adminReplyToExamMessage } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"

export async function POST(request: Request) {
  try {
    const admin = await requireAdminSession()
    const payload = (await request.json()) as { parentId: string; message: string }

    const result = await adminReplyToExamMessage(admin.fullName, payload)

    return NextResponse.json({ data: result })
  } catch (error) {
    return handleRouteError(error)
  }
}
