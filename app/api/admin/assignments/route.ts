import { NextResponse } from "next/server"
import { createAssignment, listAssignmentsForAdmin } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { AssignmentPayload } from "@/lib/types"

export async function GET() {
  try {
    await requireAdminSession()
    return NextResponse.json({ data: await listAssignmentsForAdmin() })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession()
    const payload = (await request.json()) as AssignmentPayload
    return NextResponse.json({ data: await createAssignment(payload) })
  } catch (error) {
    return handleRouteError(error)
  }
}
