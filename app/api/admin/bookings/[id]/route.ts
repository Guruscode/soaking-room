import { NextResponse } from "next/server"
import { updateMinistryBookingStatus } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { BookingStatusPayload } from "@/lib/types"

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminSession()

    const { id } = await context.params
    const payload = (await request.json()) as BookingStatusPayload

    const booking = await updateMinistryBookingStatus(id, payload, admin.fullName)
    return NextResponse.json({ data: booking })
  } catch (error) {
    return handleRouteError(error)
  }
}
