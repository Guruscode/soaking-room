import { NextResponse } from "next/server"
import { AppError } from "@/lib/errors"
import { registerForEvent, markEventTicketSent } from "@/lib/db"
import { sendEventTicketEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone } = body

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 },
      )
    }

    const registration = await registerForEvent({
      eventSlug: "spirit-spa",
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    })

    // Send ticket email (non-blocking)
    try {
      await sendEventTicketEmail(registration.email, registration.name, {
        title: "TSR presents the Spirit Spa",
        date: "August 29th, 2026",
        venue: "ATW Center, CBD Abuja",
        time: "To be announced",
      })

      await markEventTicketSent(registration.id)
    } catch (emailError) {
      console.error("Failed to send event ticket email:", emailError)
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful! Check your email for your ticket.",
    })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode || 400 })
    }

    console.error("Event registration error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
