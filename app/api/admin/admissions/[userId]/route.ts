import { NextResponse } from "next/server"
import { deleteAdmission, updateAdmission } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { AdminStudentPayload } from "@/lib/types"

type RouteContext = {
  params: Promise<{
    userId: string
  }>
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdminSession()
    const { userId } = await context.params
    const payload = (await request.json()) as Partial<AdminStudentPayload>
    const user = await updateAdmission(userId, payload)
    return NextResponse.json({ data: user })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdminSession()
    const { userId } = await context.params
    await deleteAdmission(userId)
    return NextResponse.json({ data: null })
  } catch (error) {
    return handleRouteError(error)
  }
}
