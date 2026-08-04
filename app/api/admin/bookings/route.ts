import { NextResponse } from "next/server"
import { listMinistryBookings } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { MinistryBookingStatus } from "@/lib/types"

export async function GET(request: Request) {
  try {
    await requireAdminSession()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as MinistryBookingStatus | null

    const bookings = await listMinistryBookings(status || undefined)
    return NextResponse.json({ data: bookings })
  } catch (error) {
    return handleRouteError(error)
  }
}
