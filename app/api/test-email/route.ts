import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { to } = await request.json()

    if (!to) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 })
    }

    await sendEmail({
      to,
      subject: "Test Email from TSR Academy",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Test Email</h1>
          <p>This is a test email from TSR Academy to verify that the email service is working correctly.</p>
          <p>If you received this email, the Gmail SMTP configuration is successful!</p>
          <p>Best regards,<br>The TSR Academy Team</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, message: "Test email sent successfully" })
  } catch (error) {
    console.error("Failed to send test email:", error)
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
  }
}