import { NextResponse } from "next/server"
import { AppError } from "@/lib/errors"
import { markEventTicketSent, registerForEvent } from "@/lib/db"
import { sendEventTicketEmail } from "@/lib/email"

const eventDetails = {
  slug: "worship-night-moses-akoh",
  title: "Worship Night with Moses Akoh",
  date: "Sunday, 29th November 2026",
  time: "4:00 PM WAT",
  venue: "Celeb8 Centre, Utako, Abuja, Nigeria",
  pagePath: "/worship-night",
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Please submit valid registration details." }, { status: 400 })
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Please submit valid registration details." }, { status: 400 })
  }

  const values = body as Record<string, unknown>
  const name = typeof values.name === "string" ? values.name.trim() : ""
  const email = typeof values.email === "string" ? values.email.trim() : ""
  const phone = typeof values.phone === "string" ? values.phone.trim() : ""

  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }

  try {
    const registration = await registerForEvent({
      eventSlug: eventDetails.slug,
      name,
      email,
      phone,
    })

    let ticketEmailSent = false
    try {
      await sendEventTicketEmail(registration.email, registration.name, eventDetails)
      await markEventTicketSent(registration.id)
      ticketEmailSent = true
    } catch (emailError) {
      console.error("Failed to send Worship Night ticket email:", emailError)
    }

    return NextResponse.json({ success: true, ticketEmailSent })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode || 400 })
    }

    console.error("Worship Night registration error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
