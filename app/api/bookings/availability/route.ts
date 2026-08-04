import { NextResponse } from "next/server"
import { getBookingAvailability } from "@/lib/db"
import { handleRouteError } from "@/lib/route-helpers"

export async function GET() {
  try {
    const availability = await getBookingAvailability()
    return NextResponse.json({ data: availability })
  } catch (error) {
    return handleRouteError(error)
  }
}
