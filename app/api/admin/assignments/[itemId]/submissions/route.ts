import { NextResponse } from "next/server"
import { listAssignmentSubmissionsForAdmin } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"

type RouteContext = {
  params: Promise<{
    itemId: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdminSession()
    const { itemId } = await context.params

    return NextResponse.json({
      data: await listAssignmentSubmissionsForAdmin(itemId),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
