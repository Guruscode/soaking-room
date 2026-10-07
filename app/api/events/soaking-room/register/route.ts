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
      eventSlug: "soaking-room",
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    })

    // Send ticket email (non-blocking)
    try {
      await sendEventTicketEmail(registration.email, registration.name, {
        slug: "soaking-room",
        title: "The Soaking Room",
        date: "Sunday 18th October, 2026",
        venue: "Charis Hub, Atlantic Mall, Utako, Abuja",
        time: "4:00 PM Prompt",
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
