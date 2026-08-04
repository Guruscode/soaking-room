import { NextResponse } from "next/server"
import { createMinistryBooking, getAcademySettings } from "@/lib/db"
import { env } from "@/lib/env"
import { sendNewBookingNotificationEmail } from "@/lib/email"
import { handleRouteError } from "@/lib/route-helpers"
import type { MinistryBookingPayload } from "@/lib/types"

function splitEmails(value: string) {
  return [...new Set(
    value
      .split(/[\n,;]+/)
      .map((email) => email.trim().toLowerCase())
      .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  )]
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as MinistryBookingPayload

    if (!payload.fullName?.trim() || !payload.email?.trim() || !payload.phone?.trim()) {
      return NextResponse.json({ error: "Full name, email, and phone are required." }, { status: 400 })
    }

    const booking = await createMinistryBooking(payload)

    // Notify the admin + configured notification emails (non-blocking, best effort)
    try {
      const settings = await getAcademySettings()
      const recipients = [...new Set([
        env.adminEmail,
        ...splitEmails(settings.bookingNotificationEmails),
      ].filter(Boolean))] as string[]

      await sendNewBookingNotificationEmail(recipients, {
        eventName: booking.eventName,
        eventType: booking.eventType,
        eventDates: booking.eventDates
          .map((date) => new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }))
          .join(", "),
        venue: booking.venue,
        bookerName: booking.fullName,
        bookerEmail: booking.email,
        bookerPhone: booking.phone,
      })
    } catch (emailError) {
      console.error("Failed to send booking notification email:", emailError)
    }

    return NextResponse.json(
      {
        success: true,
        bookingId: booking.id,
        message: "Your booking request has been received. We will email you once it is approved.",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Booking creation error:", error)
    return handleRouteError(error)
  }
}
