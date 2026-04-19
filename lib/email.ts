import { createTransport } from "nodemailer"
import { env } from "./env"

export const transporter = createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpSecure,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
})

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP configuration error:", error)
  } else {
    console.log("SMTP server is ready to send emails")
  }
})

export interface EmailOptions {
  to: string
  bcc?: string | string[]
  subject: string
  html?: string
  text?: string
}

const EMAIL_RETRY_DELAYS_MS = [1500, 4000, 8000] as const

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isTransientEmailError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false
  }

  const candidate = error as {
    responseCode?: number
    code?: string
  }

  return (
    candidate.responseCode === 421 ||
    candidate.responseCode === 450 ||
    candidate.responseCode === 451 ||
    candidate.responseCode === 452 ||
    candidate.code === "ETIMEDOUT" ||
    candidate.code === "ECONNECTION" ||
    candidate.code === "ESOCKET"
  )
}

export async function sendEmail(options: EmailOptions) {
  let lastError: unknown = null

  for (let attempt = 0; attempt <= EMAIL_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const info = await transporter.sendMail({
        from: `"${env.smtpFromName}" <${env.smtpFromEmail}>`,
        to: options.to,
        bcc: options.bcc,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })

      console.log("Email sent successfully:", info.messageId)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      lastError = error
      const shouldRetry = attempt < EMAIL_RETRY_DELAYS_MS.length && isTransientEmailError(error)

      console.error(
        shouldRetry ? "Transient email send failure, retrying:" : "Failed to send email:",
        error,
      )

      if (!shouldRetry) {
        break
      }

      await sleep(EMAIL_RETRY_DELAYS_MS[attempt])
    }
  }

  throw new Error("Failed to send email", { cause: lastError })
}

export async function sendWelcomeEmail(to: string, userName: string) {
  const subject = "Welcome to TSR Academy!"
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Welcome to TSR Academy!</h1>
      <p>Dear ${userName},</p>
      <p>Thank you for joining TSR Academy. We're excited to have you on board!</p>
      <p>You can now access your student dashboard and start your learning journey.</p>
      <p>Best regards,<br>The TSR Academy Team</p>
    </div>
  `

  return sendEmail({ to, subject, html })
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const subject = "Password Reset - TSR Academy"
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Password Reset</h1>
      <p>You requested a password reset for your TSR Academy account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
      <p>Best regards,<br>The TSR Academy Team</p>
    </div>
  `

  return sendEmail({ to, subject, html })
}

export async function sendRegistrationOtpEmail(to: string, userName: string, otp: string) {
  const subject = "Your TSR Academy verification code"
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Verify your TSR Academy registration</h1>
      <p>Dear ${userName},</p>
      <p>Use the one-time password below to complete your account creation.</p>
      <div style="margin: 24px 0; padding: 18px; text-align: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #0f172a;">${otp}</span>
      </div>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not start this registration, you can ignore this email.</p>
      <p>Best regards,<br>The TSR Academy Team</p>
    </div>
  `

  return sendEmail({ to, subject, html, text: `Your TSR Academy verification code is ${otp}. It expires in 10 minutes.` })
}

export async function sendRegistrationSubmittedEmail(to: string, userName: string) {
  const subject = "Your TSR Academy application has been received"
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Application received</h1>
      <p>Dear ${userName},</p>
      <p>Your TSR Academy account has been created successfully and your application is now under review.</p>
      <p>You can sign in to your student dashboard while you wait for approval.</p>
      <p>We will send you another email as soon as your admission is approved.</p>
      <p>Best regards,<br>The TSR Academy Team</p>
    </div>
  `

  return sendEmail({ to, subject, html })
}

export async function sendAdmissionApprovedEmail(to: string, userName: string) {
  const subject = "Your TSR Academy admission has been approved"
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Admission approved</h1>
      <p>Dear ${userName},</p>
      <p>Your TSR Academy admission has been approved. You can now continue from your dashboard and keep up with classes and academy updates.</p>
      <p>Best regards,<br>The TSR Academy Team</p>
    </div>
  `

  return sendEmail({ to, subject, html })
}

export async function sendBroadcastEmail(recipients: string[], payload: {
  title: string
  message: string
  className?: string | null
  classStartAt?: string | null
  classMode?: string | null
  meetingLink?: string | null
  venue?: string | null
}) {
  if (!recipients.length) {
    return { success: true, messageId: null }
  }

  const classMeta = payload.classStartAt
    ? `
      <div style="margin-top: 18px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
        <p style="margin: 0 0 8px; font-weight: 600;">${payload.className || "Upcoming class"}</p>
        <p style="margin: 0 0 8px;">Starts: ${new Date(payload.classStartAt).toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" })}</p>
        ${payload.classMode ? `<p style="margin: 0 0 8px; text-transform: capitalize;">Mode: ${payload.classMode}</p>` : ""}
        ${payload.classMode === "online" && payload.meetingLink ? `<p style="margin: 0;"><a href="${payload.meetingLink}">Open class link</a></p>` : ""}
        ${payload.classMode === "physical" && payload.venue ? `<p style="margin: 0;">Venue: ${payload.venue}</p>` : ""}
      </div>
    `
    : ""

  const subject = `TSR Academy: ${payload.title}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">${payload.title}</h1>
      <p>Dear student,</p>
      <p>${payload.message}</p>
      ${classMeta}
      <p style="margin-top: 24px;">Best regards,<br>The TSR Academy Team</p>
    </div>
  `

  return sendEmail({
    to: env.smtpFromEmail,
    bcc: recipients,
    subject,
    html,
    text: `${payload.title}\n\n${payload.message}`,
  })
}
