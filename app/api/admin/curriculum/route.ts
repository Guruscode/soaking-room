import { NextResponse } from "next/server"
import { createCurriculumItem, listCurriculumItems } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { CurriculumPayload } from "@/lib/types"

export async function GET() {
  try {
    await requireAdminSession()
    return NextResponse.json({ data: await listCurriculumItems() })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession()
    const payload = (await request.json()) as CurriculumPayload
    return NextResponse.json({ data: await createCurriculumItem(payload) })
  } catch (error) {
    return handleRouteError(error)
  }
}
