import { NextResponse } from "next/server"
import { getAcademySettings, updateAcademySettings } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { SettingsPayload } from "@/lib/types"

export async function GET() {
  try {
    await requireAdminSession()
    return NextResponse.json({ data: await getAcademySettings() })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdminSession()
    const payload = (await request.json()) as SettingsPayload
    return NextResponse.json({ data: await updateAcademySettings(payload) })
  } catch (error) {
    return handleRouteError(error)
  }
}
