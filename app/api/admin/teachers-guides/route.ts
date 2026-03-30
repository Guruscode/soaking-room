import { NextResponse } from "next/server"
import { createTeachersGuide, listTeachersGuides } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { TeachersGuidePayload } from "@/lib/types"

export async function GET() {
  try {
    await requireAdminSession()
    return NextResponse.json({ data: await listTeachersGuides() })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession()
    const payload = (await request.json()) as TeachersGuidePayload
    return NextResponse.json({ data: await createTeachersGuide(payload) })
  } catch (error) {
    return handleRouteError(error)
  }
}
