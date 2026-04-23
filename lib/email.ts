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

type EmailTemplateOptions = {
  eyebrow?: string
  title: string
  greeting?: string
  intro: string
  body?: string[]
  accentColor?: string
  accentSoft?: string
  panelHtml?: string
  ctaLabel?: string
  ctaUrl?: string
  closing?: string
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

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://www.thesoakingroom.com"
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function buildEmailTemplate({
  eyebrow = "TSR Academy",
  title,
  greeting,
  intro,
  body = [],
  accentColor = "#0f766e",
  accentSoft = "#ccfbf1",
  panelHtml,
  ctaLabel,
  ctaUrl,
  closing = "The TSR Academy Team",
}: EmailTemplateOptions) {
  const safeTitle = escapeHtml(title)
  const safeEyebrow = escapeHtml(eyebrow)
  const safeIntro = escapeHtml(intro)
  const safeGreeting = greeting ? `<p style="margin: 0 0 16px; font-size: 16px; color: #334155;">${escapeHtml(greeting)}</p>` : ""
  const bodyHtml = body
    .map((paragraph) => `<p style="margin: 0 0 14px; font-size: 15px; line-height: 1.7; color: #475569;">${escapeHtml(paragraph)}</p>`)
    .join("")
  const ctaHtml =
    ctaLabel && ctaUrl
      ? `
        <div style="margin: 28px 0 8px;">
          <a href="${ctaUrl}" style="display: inline-block; padding: 14px 22px; border-radius: 999px; background: ${accentColor}; color: #ffffff; text-decoration: none; font-weight: 600;">
            ${escapeHtml(ctaLabel)}
          </a>
        </div>
      `
      : ""

  return `
    <div style="margin: 0; padding: 32px 16px; background: #f8fafc; font-family: Arial, sans-serif;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden;">
        <div style="padding: 32px 32px 24px; background: linear-gradient(135deg, ${accentColor}, #0f172a);">
          <p style="margin: 0 0 10px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: ${accentSoft};">${safeEyebrow}</p>
          <h1 style="margin: 0; font-size: 30px; line-height: 1.2; color: #ffffff;">${safeTitle}</h1>
        </div>
        <div style="padding: 32px;">
          ${safeGreeting}
          <p style="margin: 0 0 14px; font-size: 15px; line-height: 1.7; color: #475569;">${safeIntro}</p>
          ${bodyHtml}
          ${panelHtml || ""}
          ${ctaHtml}
          <p style="margin: 28px 0 0; font-size: 15px; line-height: 1.7; color: #475569;">
            Best regards,<br>${escapeHtml(closing)}
          </p>
        </div>
      </div>
    </div>
  `
}

export async function sendWelcomeEmail(to: string, userName: string) {
  const subject = "Welcome to TSR Academy!"
  const html = buildEmailTemplate({
    title: "Welcome to TSR Academy",
    greeting: `Dear ${userName},`,
    intro: "Thank you for joining TSR Academy. We're excited to have you on board.",
    body: ["You can now access your student dashboard and start your learning journey."],
    ctaLabel: "Open Dashboard",
    ctaUrl: `${getAppUrl()}/student-dashboard`,
  })

  return sendEmail({ to, subject, html })
}

export async function sendPasswordResetOtpEmail(to: string, userName: string, otp: string) {
  const subject = "Your TSR Academy password reset code"
  const html = buildEmailTemplate({
    title: "Reset your password",
    greeting: `Dear ${userName},`,
    intro: "Use the one-time password below to reset your TSR Academy account password.",
    panelHtml: `
      <div style="margin: 24px 0; padding: 18px; text-align: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #0f172a;">${escapeHtml(otp)}</span>
      </div>
    `,
    body: ["This code expires in 10 minutes.", "If you did not request a password reset, you can ignore this email."],
    accentColor: "#2563eb",
    accentSoft: "#bfdbfe",
  })

  return sendEmail({ to, subject, html, text: `Your TSR Academy password reset code is ${otp}. It expires in 10 minutes.` })
}

export async function sendRegistrationOtpEmail(to: string, userName: string, otp: string) {
  const subject = "Your TSR Academy verification code"
  const html = buildEmailTemplate({
    title: "Verify your registration",
    greeting: `Dear ${userName},`,
    intro: "Use the one-time password below to complete your account creation.",
    panelHtml: `
      <div style="margin: 24px 0; padding: 18px; text-align: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #0f172a;">${escapeHtml(otp)}</span>
      </div>
    `,
    body: ["This code expires in 10 minutes.", "If you did not start this registration, you can ignore this email."],
  })

  return sendEmail({ to, subject, html, text: `Your TSR Academy verification code is ${otp}. It expires in 10 minutes.` })
}

export async function sendRegistrationSubmittedEmail(to: string, userName: string) {
  const subject = "Your TSR Academy application has been received"
  const html = buildEmailTemplate({
    title: "Application received",
    greeting: `Dear ${userName},`,
    intro: "Your TSR Academy account has been created successfully and your application is now under review.",
    body: [
      "You can sign in to your student dashboard while you wait for the admin decision.",
      "We will email you again as soon as your admission status changes.",
    ],
    ctaLabel: "Go to Login",
    ctaUrl: `${getAppUrl()}/tsr-academy/login`,
  })

  return sendEmail({ to, subject, html })
}

export async function sendAdmissionApprovedEmail(to: string, userName: string) {
  const subject = "Your TSR Academy admission has been approved"
  const html = buildEmailTemplate({
    title: "Admission approved",
    greeting: `Dear ${userName},`,
    intro: "Your TSR Academy admission has been approved.",
    body: [
      "You can now continue from your dashboard and keep up with classes, curriculum, and academy updates.",
      "If you have any questions, reply to this email or contact the academy support team.",
    ],
    accentColor: "#15803d",
    accentSoft: "#bbf7d0",
    ctaLabel: "Open Dashboard",
    ctaUrl: `${getAppUrl()}/student-dashboard`,
  })

  return sendEmail({ to, subject, html })
}

export async function sendAdmissionRejectedEmail(to: string, userName: string) {
  const subject = "Update on your TSR Academy admission"
  const html = buildEmailTemplate({
    title: "Admission update",
    greeting: `Dear ${userName},`,
    intro: "Your TSR Academy admission request was not approved at this time.",
    body: [
      "If you believe this was an error or you need clarification, please contact the academy admin team for the next steps.",
      "Thank you for your interest in TSR Academy.",
    ],
    accentColor: "#b45309",
    accentSoft: "#fde68a",
    ctaLabel: "Contact Support",
    ctaUrl: `mailto:${env.smtpFromEmail}`,
  })

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
  const html = buildEmailTemplate({
    title: payload.title,
    greeting: "Dear student,",
    intro: payload.message,
    panelHtml: classMeta,
    ctaLabel: "Open Dashboard",
    ctaUrl: `${getAppUrl()}/student-dashboard`,
  })

  return sendEmail({
    to: env.smtpFromEmail,
    bcc: recipients,
    subject,
    html,
    text: `${payload.title}\n\n${payload.message}`,
  })
}
