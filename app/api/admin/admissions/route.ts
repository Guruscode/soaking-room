import { NextResponse } from "next/server"
import { createAdmission, listAdmissions } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { AdminStudentPayload } from "@/lib/types"

export async function GET() {
  try {
    await requireAdminSession()
    const admissions = await listAdmissions()
    return NextResponse.json({ data: admissions })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession()
    const payload = (await request.json()) as AdminStudentPayload
    const admission = await createAdmission(payload)
    return NextResponse.json({ data: admission })
  } catch (error) {
    return handleRouteError(error)
  }
}
