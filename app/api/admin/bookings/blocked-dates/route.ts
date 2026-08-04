import { NextResponse } from "next/server"
import { blockBookingDate, listBlockedBookingDates, unblockBookingDate } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"

export async function GET() {
  try {
    await requireAdminSession()
    const blockedDates = await listBlockedBookingDates()
    return NextResponse.json({ data: blockedDates })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession()

    const body = (await request.json()) as { date?: string; reason?: string }

    if (!body.date) {
      return NextResponse.json({ error: "A date is required." }, { status: 400 })
    }

    const blockedDates = await blockBookingDate(body.date, body.reason)
    return NextResponse.json({ data: blockedDates }, { status: 201 })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminSession()

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "A date is required." }, { status: 400 })
    }

    await unblockBookingDate(date)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleRouteError(error)
  }
}
