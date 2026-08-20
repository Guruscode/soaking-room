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

export async function sendAdminCreatedAccountEmail(
  to: string,
  userName: string,
  password: string,
  admissionStatus: "pending" | "approved" | "rejected",
) {
  const statusMessage =
    admissionStatus === "approved"
      ? "Your admission has already been approved, so you can sign in and start using your dashboard immediately."
      : admissionStatus === "rejected"
        ? "Your account has been created, but your admission is currently marked as rejected. Please contact the academy team if this needs to be reviewed."
        : "Your account has been created successfully. Your admission is currently pending review."

  const subject = "Your TSR Academy account has been created"
  const html = buildEmailTemplate({
    title: "Your account is ready",
    greeting: `Dear ${userName},`,
    intro: "An administrator created your TSR Academy account for you.",
    panelHtml: `
      <div style="margin: 24px 0; padding: 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
        <p style="margin: 0 0 10px; font-size: 14px; color: #475569;">Use these details to sign in:</p>
        <p style="margin: 0 0 8px; font-size: 15px; color: #0f172a;"><strong>Email:</strong> ${escapeHtml(to)}</p>
        <p style="margin: 0; font-size: 15px; color: #0f172a;"><strong>Password:</strong> ${escapeHtml(password)}</p>
      </div>
    `,
    body: [
      statusMessage,
      "For security, please sign in and change your password as soon as possible.",
    ],
    accentColor: "#0f766e",
    accentSoft: "#ccfbf1",
    ctaLabel: "Go to Login",
    ctaUrl: `${getAppUrl()}/tsr-academy/login`,
  })

  return sendEmail({
    to,
    subject,
    html,
    text: `Your TSR Academy account has been created.\nEmail: ${to}\nPassword: ${password}\nStatus: ${admissionStatus}\nLogin: ${getAppUrl()}/tsr-academy/login`,
  })
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

export async function sendEventTicketEmail(to: string, attendeeName: string, eventDetails: {
  title: string
  date: string
  venue: string
  time: string
}) {
  const subject = `Your Ticket: ${eventDetails.title}`
  const html = buildEmailTemplate({
    eyebrow: "You're registered!",
    title: eventDetails.title,
    greeting: `Dear ${attendeeName},`,
    intro: "Thank you for registering! Your ticket is confirmed below.",
    panelHtml: `
      <div style="margin: 24px 0; padding: 28px; background: linear-gradient(135deg, #FDF8F5, #F8F1E9); border: 2px dashed #D8A8A0; border-radius: 16px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 12px;">🌸</div>
        <h2 style="margin: 0 0 8px; font-size: 18px; color: #8B7355; font-weight: 600;">${escapeHtml(eventDetails.title)}</h2>
        <div style="margin: 16px 0; padding: 14px 0; border-top: 1px dashed #E8D5C8; border-bottom: 1px dashed #E8D5C8;">
          <p style="margin: 4px 0; font-size: 14px; color: #B38B6B;"><strong style="color: #8B7355;">📅 Date:</strong> ${escapeHtml(eventDetails.date)}</p>
          <p style="margin: 4px 0; font-size: 14px; color: #B38B6B;"><strong style="color: #8B7355;">⏰ Time:</strong> ${escapeHtml(eventDetails.time)}</p>
          <p style="margin: 4px 0; font-size: 14px; color: #B38B6B;"><strong style="color: #8B7355;">📍 Venue:</strong> ${escapeHtml(eventDetails.venue)}</p>
        </div>
        <p style="margin: 12px 0 0; font-size: 13px; color: #B38B6B;">Present this ticket at the entrance</p>
        <p style="margin: 4px 0 0; font-size: 12px; color: #C9A66B;">Ticket #: ${escapeHtml(to.split("")[0].toUpperCase())}${Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
      </div>
    `,
    body: [
      "We look forward to having you at this powerful event!",
      "Doors will open 30 minutes before the start time.",
    ],
    accentColor: "#D8A8A0",
    accentSoft: "#FDF8F5",
    ctaLabel: "Event Details",
    ctaUrl: `${getAppUrl()}/events/spirit-spa`,
    closing: "The Soaking Room Team",
  })

  return sendEmail({ to, subject, html })
}

export async function sendExamStartedEmail(to: string, studentName: string, examConfig: {
  title: string
  description: string
  courseCode: string
  cohort: string
  durationMinutes: number
  totalMarks: number
}) {
  const subject = `${examConfig.title} is now available - ${examConfig.courseCode}`
  const html = buildEmailTemplate({
    title: "Exam is now open",
    greeting: `Dear ${studentName},`,
    intro: `The ${examConfig.title} (${examConfig.description}) is now available for you to take.`,
    body: [
      `Course: ${examConfig.courseCode} - ${examConfig.cohort}`,
      `Duration: ${examConfig.durationMinutes} minutes`,
      `Total Marks: ${examConfig.totalMarks}`,
      `Number of Questions: 11 across 3 sections`,
      "You can start the exam at any time before it closes. Make sure you have enough uninterrupted time to complete it.",
      "Your answers are automatically saved as you type, so you won't lose your work if you lose connection.",
    ],
    accentColor: "#0f766e",
    accentSoft: "#ccfbf1",
    ctaLabel: "Open Exam",
    ctaUrl: `${getAppUrl()}/student-dashboard/exams`,
  })

  return sendEmail({ to, subject, html })
}

export async function sendExamScoreReleasedEmail(to: string, studentName: string, payload: {
  examTitle: string
  courseCode: string
  totalMarks: number
  score: number
  reviewedBy: string
}) {
  const subject = `Your ${payload.examTitle} score has been released`
  const html = buildEmailTemplate({
    title: "Your exam score is ready",
    greeting: `Dear ${studentName},`,
    intro: `Your score for the ${payload.examTitle} (${payload.courseCode}) has been released.`,
    panelHtml: `
      <div style="margin: 24px 0; padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; text-align: center;">
        <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">Your Score</p>
        <p style="margin: 0; font-size: 48px; font-weight: 700; color: #0f766e;">${payload.score}<span style="font-size: 24px; color: #94a3b8;">/${payload.totalMarks}</span></p>
        <p style="margin: 12px 0 0; font-size: 13px; color: #94a3b8;">Reviewed by ${payload.reviewedBy}</p>
      </div>
    `,
    body: [
      "You can view your score and any feedback in your student dashboard.",
      "If you have any questions about your results, please contact the academy team.",
    ],
    accentColor: "#0f766e",
    accentSoft: "#ccfbf1",
    ctaLabel: "View Results",
    ctaUrl: `${getAppUrl()}/student-dashboard/exams`,
  })

  return sendEmail({ to, subject, html })
}

type BookingEmailDetails = {
  eventName: string
  eventType: string
  eventDates: string
  venue: string
  adminNote?: string
  bookerName?: string
  bookerEmail?: string
  bookerPhone?: string
}

function buildBookingPanel(details: BookingEmailDetails) {
  const rows = [
    ["Event", details.eventName],
    ["Type", details.eventType],
    ["Date(s)", details.eventDates],
    ["Venue", details.venue],
  ]

  if (details.bookerName) {
    rows.push(["Booker", details.bookerName])
  }

  if (details.bookerEmail) {
    rows.push(["Email", details.bookerEmail])
  }

  if (details.bookerPhone) {
    rows.push(["Phone", details.bookerPhone])
  }

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eef2f7; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #94a3b8; white-space: nowrap;">${escapeHtml(label)}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eef2f7; font-size: 14px; color: #0f172a;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("")

  const adminNoteHtml = details.adminNote
    ? `
      <div style="margin-top: 18px; padding: 14px 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px;">
        <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>Note from the team:</strong> ${escapeHtml(details.adminNote)}</p>
      </div>
    `
    : ""

  return `
    <div style="margin: 24px 0; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <table style="width: 100%; border-collapse: collapse;">
        ${rowsHtml}
      </table>
    </div>
    ${adminNoteHtml}
  `
}

export async function sendBookingReceivedEmail(to: string, bookerName: string, details: Omit<BookingEmailDetails, "bookerName" | "bookerEmail" | "bookerPhone">) {
  const subject = "We've received your booking request"
  const html = buildEmailTemplate({
    eyebrow: "Booking request received",
    title: "Thank you, your request is pending",
    greeting: `Dear ${bookerName},`,
    intro: "Your request to host Minister Moses Akoh has been received and is now awaiting approval from the ministry team.",
    panelHtml: buildBookingPanel({ ...details, bookerName }),
    body: [
      "Please note that your date(s) are not confirmed until the ministry team approves your request. You will receive a confirmation email once a decision has been made.",
      "If you have any questions in the meantime, simply reply to this email.",
    ],
    accentColor: "#0891b2",
    accentSoft: "#cffafe",
    closing: "The Soaking Room Team",
  })

  return sendEmail({ to, subject, html })
}

export async function sendNewBookingNotificationEmail(recipients: string[], details: BookingEmailDetails) {
  if (!recipients.length) {
    return { success: true, messageId: null }
  }

  const subject = `New booking request: ${details.eventName}`
  const html = buildEmailTemplate({
    eyebrow: "New booking request",
    title: "A new ministry booking needs review",
    intro: `${details.bookerName || "Someone"} has submitted a new hosting request. Review the details below and approve or decline it from the admin dashboard.`,
    panelHtml: buildBookingPanel(details),
    accentColor: "#0f766e",
    accentSoft: "#ccfbf1",
    closing: "The Soaking Room Team",
  })

  const [primary = "", ...rest] = recipients.filter(Boolean)

  if (!primary) {
    return { success: true, messageId: null }
  }

  return sendEmail({
    to: primary,
    bcc: rest.length ? rest : undefined,
    subject,
    html,
  })
}

export async function sendBookingApprovedEmail(to: string, bookerName: string, details: Omit<BookingEmailDetails, "bookerName" | "bookerEmail" | "bookerPhone">) {
  const subject = `Booking confirmed: ${details.eventName}`
  const html = buildEmailTemplate({
    eyebrow: "Booking confirmed",
    title: "Your booking has been approved",
    greeting: `Dear ${bookerName},`,
    intro: "Great news! Your request to host Minister Moses Akoh has been approved.",
    panelHtml: buildBookingPanel({ ...details, bookerName }),
    body: [
      "The ministry team will be in touch to finalize travel, technical, and program details closer to the date.",
      "Thank you for partnering with this ministry.",
    ],
    accentColor: "#15803d",
    accentSoft: "#bbf7d0",
    closing: "The Soaking Room Team",
  })

  return sendEmail({ to, subject, html })
}

export async function sendBookingRejectedEmail(to: string, bookerName: string, details: {
  eventName: string
  adminNote?: string
}) {
  const subject = `Update on your booking request: ${details.eventName}`
  const html = buildEmailTemplate({
    eyebrow: "Booking update",
    title: "About your booking request",
    greeting: `Dear ${bookerName},`,
    intro: `Unfortunately, the ministry team was unable to approve your request to host Minister Moses Akoh for ${details.eventName}.`,
    panelHtml: details.adminNote
      ? `
        <div style="margin: 24px 0; padding: 14px 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>Reason:</strong> ${escapeHtml(details.adminNote)}</p>
        </div>
      `
      : "",
    body: [
      "This may be due to scheduling conflicts or availability. If you would like to explore an alternative date, please reply to this email and the team will gladly assist.",
      "Thank you for your interest and understanding.",
    ],
    accentColor: "#b45309",
    accentSoft: "#fde68a",
    closing: "The Soaking Room Team",
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

export async function sendSpiritSpaWelcomeEmail(to: string, attendeeName: string) {
  const subject = "Spirit Spa; We're excited to have you!"
  const html = buildEmailTemplate({
    eyebrow: "The Soaking Room",
    title: "We're excited to have you!",
    greeting: `Dear Beautiful Ladies,`,
    intro: "Thank you so much for signing up for Spirit Spa! We're so excited to have you join us for this special time of refreshing, intimate worship, prophecy and becoming all that God has called us to be. It promises to be an exciting time in the presence of the Lord and in the fellowship of other beautiful women!",
    body: [
      "We'd love for everyone to come dressed in their most girly, Godly attire. Feminine, beautiful, modest, and absolutely YOU! Think pretty, classy, joyful, and Jesus-approved.",
      "We're looking forward to seeing you, spending time together, and having an amazing time in God's presence.",
      "Spirit Spa is almost here, and we can't wait! Here's a quick reminder of the details:",
    ],
    panelHtml: `
      <div style="margin: 24px 0; padding: 28px; background: linear-gradient(135deg, #FDF8F5, #F8F1E9); border: 2px dashed #D8A8A0; border-radius: 16px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 12px;">🌸</div>
        <h2 style="margin: 0 0 8px; font-size: 18px; color: #8B7355; font-weight: 600;">Spirit Spa</h2>
        <div style="margin: 16px 0; padding: 14px 0; border-top: 1px dashed #E8D5C8; border-bottom: 1px dashed #E8D5C8;">
          <p style="margin: 4px 0; font-size: 14px; color: #B38B6B;"><strong style="color: #8B7355;">📅 Date:</strong> Saturday 29th August, 2026</p>
          <p style="margin: 4px 0; font-size: 14px; color: #B38B6B;"><strong style="color: #8B7355;">⏰ Time:</strong> 4pm (WAT)</p>
          <p style="margin: 4px 0; font-size: 14px; color: #B38B6B;"><strong style="color: #8B7355;">📍 Venue:</strong> ATW Center, CBD Abuja</p>
        </div>
      </div>
    `,
    accentColor: "#D8A8A0",
    accentSoft: "#FDF8F5",
    ctaLabel: "Event Details",
    ctaUrl: `${getAppUrl()}/events/spirit-spa`,
    closing: "The Soaking Room Team",
  })

  return sendEmail({ to, subject, html })
}
