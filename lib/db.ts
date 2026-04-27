import { createHash, randomInt, randomUUID } from "node:crypto"
import { BROADCAST_AUDIENCE_OPTIONS, CURRICULUM_CATEGORY_OPTIONS } from "@/lib/academy-options"
import { turso } from "@/lib/turso"
import { env } from "@/lib/env"
import { AppError } from "@/lib/errors"
import {
  sendAdminCreatedAccountEmail,
  sendAdmissionApprovedEmail,
  sendAdmissionRejectedEmail,
  sendBroadcastEmail,
  sendPasswordResetOtpEmail,
  sendRegistrationOtpEmail,
  sendRegistrationSubmittedEmail,
} from "@/lib/email"
import { hashPassword, verifyPassword } from "@/lib/password"
import type {
  AcademySettings,
  AcademyUser,
  AdminStudentPayload,
  AdmissionStatus,
  AssignmentItem,
  AssignmentPayload,
  AssignmentSubmissionItem,
  AssignmentSubmissionPayload,
  AssignmentSubmissionReviewPayload,
  AssignmentSubmissionType,
  BroadcastItem,
  BroadcastPayload,
  CurriculumItem,
  CurriculumPayload,
  LoginPayload,
  NotificationItem,
  PasswordResetOtpRequestPayload,
  PasswordResetOtpRequestResult,
  PasswordResetOtpVerifyPayload,
  RegistrationOtpRequestResult,
  RegistrationOtpVerifyPayload,
  RegisterPayload,
  SettingsPayload,
  TeachersGuideItem,
  TeachersGuidePayload,
} from "@/lib/types"

type DatabaseUserRow = {
  id: string
  full_name: string
  date_of_birth_or_age: string
  category: string
  location: string
  email: string
  phone: string
  born_again: string
  church: string | null
  musical_skill: string | null
  reason: string
  password_hash: string
  role: "student" | "admin"
  admission_status: AdmissionStatus
  created_at: string
  updated_at: string
}

type DatabaseCurriculumRow = {
  id: string
  title: string
  category: string
  week: string
  content: string
  created_at: string
  updated_at: string
}

type DatabaseTeachersGuideRow = {
  id: string
  title: string
  owner: string
  duration: string
  content: string
  created_at: string
  updated_at: string
}

type DatabaseBroadcastRow = {
  id: string
  title: string
  message: string
  audience: string
  class_name: string | null
  class_start_at: string | null
  class_end_at: string | null
  class_mode: "online" | "physical" | null
  meeting_link: string | null
  venue: string | null
  created_at: string
  updated_at: string
}

type DatabaseNotificationRow = {
  id: string
  title: string
  message: string
  audience: string
  class_name: string | null
  class_start_at: string | null
  class_end_at: string | null
  class_mode: "online" | "physical" | null
  meeting_link: string | null
  venue: string | null
  created_at: string
}

type DatabaseAssignmentRow = {
  id: string
  title: string
  audience: string
  instructions: string
  due_date: string
  created_at: string
  updated_at: string
}

type DatabaseAssignmentSubmissionRow = {
  id: string
  assignment_id: string
  user_id: string
  student_name: string
  student_email: string
  submission_type: AssignmentSubmissionType
  text_content: string | null
  file_name: string | null
  file_mime_type: string | null
  file_data_url: string | null
  file_size_bytes: number | string | null
  score: number | string | null
  admin_comment: string | null
  reviewed_at: string | null
  reviewed_by_name: string | null
  created_at: string
  updated_at: string
}

type DatabasePendingRegistrationRow = {
  id: string
  full_name: string
  date_of_birth_or_age: string
  category: string
  location: string
  email: string
  phone: string
  born_again: string
  church: string | null
  musical_skill: string | null
  reason: string
  password_hash: string
  otp_hash: string
  otp_expires_at: string
  created_at: string
  updated_at: string
}

type DatabasePendingPasswordResetRow = {
  id: string
  user_id: string
  email: string
  otp_hash: string
  otp_expires_at: string
  created_at: string
  updated_at: string
}

type DatabaseSettingsRow = {
  id: string
  academy_name: string
  support_email: string
  timezone: string
  default_online_link: string
  default_venue: string
  updated_at: string
}

let setupPromise: Promise<void> | null = null

function mapUser(row: DatabaseUserRow): AcademyUser {
  return {
    id: row.id,
    fullName: row.full_name,
    dateOfBirthOrAge: row.date_of_birth_or_age,
    category: row.category,
    location: row.location,
    email: row.email,
    phone: row.phone,
    bornAgain: row.born_again,
    church: row.church,
    musicalSkill: row.musical_skill,
    reason: row.reason,
    role: row.role,
    admissionStatus: row.admission_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapCurriculum(row: DatabaseCurriculumRow): CurriculumItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    week: row.week,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapTeachersGuide(row: DatabaseTeachersGuideRow): TeachersGuideItem {
  return {
    id: row.id,
    title: row.title,
    owner: row.owner,
    duration: row.duration,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapBroadcast(row: DatabaseBroadcastRow): BroadcastItem {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    audience: row.audience,
    className: row.class_name,
    classStartAt: row.class_start_at,
    classEndAt: row.class_end_at,
    classMode: row.class_mode,
    meetingLink: row.meeting_link,
    venue: row.venue,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapNotification(row: DatabaseNotificationRow): NotificationItem {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    audience: row.audience,
    className: row.class_name,
    classStartAt: row.class_start_at,
    classEndAt: row.class_end_at,
    classMode: row.class_mode,
    meetingLink: row.meeting_link,
    venue: row.venue,
    createdAt: row.created_at,
  }
}

function mapAssignment(row: DatabaseAssignmentRow): AssignmentItem {
  return {
    id: row.id,
    title: row.title,
    audience: row.audience,
    instructions: row.instructions,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapAssignmentSubmission(row: DatabaseAssignmentSubmissionRow): AssignmentSubmissionItem {
  return {
    id: row.id,
    assignmentId: row.assignment_id,
    userId: row.user_id,
    studentName: row.student_name,
    studentEmail: row.student_email,
    submissionType: row.submission_type,
    textContent: row.text_content,
    fileName: row.file_name,
    fileMimeType: row.file_mime_type,
    fileDataUrl: row.file_data_url,
    fileSizeBytes: row.file_size_bytes === null ? null : Number(row.file_size_bytes),
    score: row.score === null ? null : Number(row.score),
    adminComment: row.admin_comment,
    reviewedAt: row.reviewed_at,
    reviewedByName: row.reviewed_by_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapSettings(row: DatabaseSettingsRow): AcademySettings {
  return {
    id: row.id,
    academyName: row.academy_name,
    supportEmail: row.support_email,
    timezone: row.timezone,
    defaultOnlineLink: row.default_online_link,
    defaultVenue: row.default_venue,
    updatedAt: row.updated_at,
  }
}

function sanitizeOptionalValue(value?: string | null) {
  const nextValue = value?.trim()
  return nextValue ? nextValue : null
}

function hashOtp(code: string) {
  return createHash("sha256").update(code).digest("hex")
}

function generateOtp() {
  return randomInt(100000, 1000000).toString()
}

function getOtpExpiryDate() {
  return new Date(Date.now() + 10 * 60 * 1000)
}

async function sendEmailSafely(taskName: string, action: () => Promise<unknown>) {
  try {
    await action()
  } catch (error) {
    console.error(`Failed to send ${taskName} email:`, error)
  }
}

async function runNonCriticalTask(taskName: string, action: () => Promise<unknown>) {
  try {
    await action()
  } catch (error) {
    console.error(`Failed to complete ${taskName}:`, error)
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}

function ensureRequiredValue(value: string, fieldName: string) {
  if (!value.trim()) {
    throw new AppError(`${fieldName} is required.`)
  }

  return value.trim()
}

function normalizeAssignmentSubmissionType(submissionType: string): AssignmentSubmissionType {
  const trimmedSubmissionType = ensureRequiredValue(submissionType, "Submission type")

  if (trimmedSubmissionType !== "text" && trimmedSubmissionType !== "image" && trimmedSubmissionType !== "pdf") {
    throw new AppError("Invalid assignment submission type.")
  }

  return trimmedSubmissionType
}

function parseDataUrl(value: string) {
  const trimmedValue = ensureRequiredValue(value, "File")
  const match = /^data:([^;]+);base64,([\s\S]+)$/.exec(trimmedValue)

  if (!match) {
    throw new AppError("Invalid file upload format.")
  }

  return {
    mimeType: match[1],
    base64Payload: match[2],
  }
}

function matchesAudience(studentCategory: string, audience: string) {
  return audience === "All Students" || studentCategory === audience
}

function normalizeCurriculumCategory(category: string) {
  const trimmedCategory = ensureRequiredValue(category, "Category")

  if (!CURRICULUM_CATEGORY_OPTIONS.includes(trimmedCategory as (typeof CURRICULUM_CATEGORY_OPTIONS)[number])) {
    throw new AppError("Invalid curriculum category.")
  }

  return trimmedCategory
}

function normalizeBroadcastAudience(audience: string) {
  const trimmedAudience = ensureRequiredValue(audience, "Audience")

  if (!BROADCAST_AUDIENCE_OPTIONS.includes(trimmedAudience as (typeof BROADCAST_AUDIENCE_OPTIONS)[number])) {
    throw new AppError("Invalid broadcast audience.")
  }

  return trimmedAudience
}

function normalizeAssignmentAudience(audience: string) {
  const trimmedAudience = ensureRequiredValue(audience, "Category")

  if (!BROADCAST_AUDIENCE_OPTIONS.includes(trimmedAudience as (typeof BROADCAST_AUDIENCE_OPTIONS)[number])) {
    throw new AppError("Invalid assignment category.")
  }

  return trimmedAudience
}

async function getUserByEmail(email: string) {
  const result = await turso.execute({
    sql: "SELECT * FROM users WHERE email = ? LIMIT 1",
    args: [email.toLowerCase()],
  })

  return result.rows[0] ? (result.rows[0] as unknown as DatabaseUserRow) : null
}

async function getPendingRegistrationByEmail(email: string) {
  const result = await turso.execute({
    sql: "SELECT * FROM pending_registrations WHERE email = ? LIMIT 1",
    args: [email.toLowerCase()],
  })

  return result.rows[0] ? (result.rows[0] as unknown as DatabasePendingRegistrationRow) : null
}

async function getPendingPasswordResetByEmail(email: string) {
  const result = await turso.execute({
    sql: "SELECT * FROM pending_password_resets WHERE email = ? LIMIT 1",
    args: [email.toLowerCase()],
  })

  return result.rows[0] ? (result.rows[0] as unknown as DatabasePendingPasswordResetRow) : null
}

async function getUserById(id: string) {
  const result = await turso.execute({
    sql: "SELECT * FROM users WHERE id = ? LIMIT 1",
    args: [id],
  })

  return result.rows[0] ? (result.rows[0] as unknown as DatabaseUserRow) : null
}

async function getCurriculumById(id: string) {
  const result = await turso.execute({
    sql: "SELECT * FROM curriculum_items WHERE id = ? LIMIT 1",
    args: [id],
  })

  return result.rows[0] ? (result.rows[0] as unknown as DatabaseCurriculumRow) : null
}

async function getTeachersGuideById(id: string) {
  const result = await turso.execute({
    sql: "SELECT * FROM teachers_guides WHERE id = ? LIMIT 1",
    args: [id],
  })

  return result.rows[0] ? (result.rows[0] as unknown as DatabaseTeachersGuideRow) : null
}

async function getBroadcastById(id: string) {
  const result = await turso.execute({
    sql: "SELECT * FROM broadcasts WHERE id = ? LIMIT 1",
    args: [id],
  })

  return result.rows[0] ? (result.rows[0] as unknown as DatabaseBroadcastRow) : null
}

async function getAssignmentById(id: string) {
  const result = await turso.execute({
    sql: "SELECT * FROM assignments WHERE id = ? LIMIT 1",
    args: [id],
  })

  return result.rows[0] ? (result.rows[0] as unknown as DatabaseAssignmentRow) : null
}

async function getAssignmentSubmissionByAssignmentAndUser(assignmentId: string, userId: string) {
  const result = await turso.execute({
    sql: "SELECT * FROM assignment_submissions WHERE assignment_id = ? AND user_id = ? LIMIT 1",
    args: [assignmentId, userId],
  })

  return result.rows[0] ? (result.rows[0] as unknown as DatabaseAssignmentSubmissionRow) : null
}

async function listAssignmentSubmissionsByAssignmentId(assignmentId: string) {
  const result = await turso.execute({
    sql: "SELECT * FROM assignment_submissions WHERE assignment_id = ? ORDER BY updated_at DESC, created_at DESC",
    args: [assignmentId],
  })

  return result.rows.map((row) => mapAssignmentSubmission(row as unknown as DatabaseAssignmentSubmissionRow))
}

async function getAssignmentSubmissionById(submissionId: string) {
  const result = await turso.execute({
    sql: "SELECT * FROM assignment_submissions WHERE id = ? LIMIT 1",
    args: [submissionId],
  })

  return result.rows[0] ? (result.rows[0] as unknown as DatabaseAssignmentSubmissionRow) : null
}

async function seedAdminUser() {
  if (!env.adminEmail || !env.adminPassword) {
    return
  }

  const existingAdmin = await getUserByEmail(env.adminEmail)

  if (existingAdmin) {
    return
  }

  await turso.execute({
    sql: `
      INSERT INTO users (
        id, full_name, date_of_birth_or_age, category, location, email, phone, born_again,
        church, musical_skill, reason, password_hash, role, admission_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      randomUUID(),
      env.adminFullName,
      "N/A",
      "Administration",
      "Remote",
      env.adminEmail,
      "N/A",
      "Yes",
      "N/A",
      "N/A",
      "Seeded administrator account",
      hashPassword(env.adminPassword),
      "admin",
      "approved",
    ],
  })
}

async function seedSettings() {
  const result = await turso.execute("SELECT COUNT(*) AS total FROM academy_settings")
  const total = Number((result.rows[0] as { total?: number | string }).total ?? 0)

  if (total > 0) {
    return
  }

  await turso.execute({
    sql: `
      INSERT INTO academy_settings (
        id, academy_name, support_email, timezone, default_online_link, default_venue
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [randomUUID(), "The Soaking Room Academy", "academy@soakingroom.org", "Africa/Lagos", "https://meet.google.com", "The Soaking Room Auditorium"],
  })
}

async function seedCurriculum() {
  const result = await turso.execute("SELECT COUNT(*) AS total FROM curriculum_items")
  const total = Number((result.rows[0] as { total?: number | string }).total ?? 0)

  if (total > 0) {
    return
  }

  const items = [
    ["Identity & Sonship", "Teenager (13-19)", "Week 1", "A foundational teaching on identity in Christ and how it shapes worship ministry."],
    ["Spiritual Impact of Your Voice", "Adult (20+)", "Week 2", "A practical study on stewarding voice, influence, and devotion in ministry."],
    ["Anatomy of Your Ministry Voice", "All Students", "Week 3", "A text module covering preparation, expression, and spiritual sensitivity."],
  ]

  for (const item of items) {
    await turso.execute({
      sql: "INSERT INTO curriculum_items (id, title, category, week, content) VALUES (?, ?, ?, ?, ?)",
      args: [randomUUID(), item[0], item[1], item[2], item[3]],
    })
  }
}

async function seedTeachersGuides() {
  const result = await turso.execute("SELECT COUNT(*) AS total FROM teachers_guides")
  const total = Number((result.rows[0] as { total?: number | string }).total ?? 0)

  if (total > 0) {
    return
  }

  const guides = [
    ["Prayer & Silence", "Lead Teacher", "5-10 mins", "Open the class by centering the room with prayer, silence, and alignment."],
    ["Scripture Meditation", "Assistant", "10 mins", "Lead students through the anchor scripture and reflection prompts."],
    ["Core Teaching", "Lead Teacher", "35 mins", "Deliver the main lesson and practical examples for the week."],
  ]

  for (const guide of guides) {
    await turso.execute({
      sql: "INSERT INTO teachers_guides (id, title, owner, duration, content) VALUES (?, ?, ?, ?, ?)",
      args: [randomUUID(), guide[0], guide[1], guide[2], guide[3]],
    })
  }
}

async function listStudentsMatchingAudience(audience: string) {
  const result = await turso.execute({
    sql: `
      SELECT * FROM users
      WHERE role = 'student'
      AND admission_status = 'approved'
      AND (? = 'All Students' OR category = ?)
      ORDER BY created_at DESC
    `,
    args: [audience, audience],
  })

  return result.rows.map((row) => mapUser(row as unknown as DatabaseUserRow))
}

async function syncNotificationsForBroadcast(broadcast: BroadcastItem) {
  await turso.execute({
    sql: "DELETE FROM notifications WHERE broadcast_id = ?",
    args: [broadcast.id],
  })

  const students = await listStudentsMatchingAudience(broadcast.audience)

  for (const student of students) {
    await turso.execute({
      sql: `
        INSERT INTO notifications (
          id, user_id, broadcast_id, title, message, audience, class_name, class_start_at,
          class_end_at, class_mode, meeting_link, venue
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        randomUUID(),
        student.id,
        broadcast.id,
        broadcast.title,
        broadcast.message,
        broadcast.audience,
        broadcast.className,
        broadcast.classStartAt,
        broadcast.classEndAt,
        broadcast.classMode,
        broadcast.meetingLink,
        broadcast.venue,
      ],
    })
  }
}

async function syncExistingBroadcastsForUser(userId: string) {
  const broadcasts = await listBroadcasts()
  const user = await getUserById(userId)

  if (!user) {
    return
  }

  await turso.execute({
    sql: "DELETE FROM notifications WHERE user_id = ?",
    args: [userId],
  })

  if (user.admission_status !== "approved") {
    return
  }

  for (const broadcast of broadcasts) {
    if (!matchesAudience(user.category, broadcast.audience)) {
      continue
    }

    await turso.execute({
      sql: `
        INSERT INTO notifications (
          id, user_id, broadcast_id, title, message, audience, class_name, class_start_at,
          class_end_at, class_mode, meeting_link, venue
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        randomUUID(),
        userId,
        broadcast.id,
        broadcast.title,
        broadcast.message,
        broadcast.audience,
        broadcast.className,
        broadcast.classStartAt,
        broadcast.classEndAt,
        broadcast.classMode,
        broadcast.meetingLink,
        broadcast.venue,
      ],
    })
  }
}

export async function ensureDatabaseSetup() {
  if (!setupPromise) {
    setupPromise = (async () => {
      await turso.batch([
        `
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            date_of_birth_or_age TEXT NOT NULL,
            category TEXT NOT NULL,
            location TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            born_again TEXT NOT NULL,
            church TEXT,
            musical_skill TEXT,
            reason TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'student',
            admission_status TEXT NOT NULL DEFAULT 'pending',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `,
        "CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)",
        "CREATE INDEX IF NOT EXISTS idx_users_admission_status ON users(admission_status)",
        `
          CREATE TABLE IF NOT EXISTS curriculum_items (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            week TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `,
        `
          CREATE TABLE IF NOT EXISTS teachers_guides (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            owner TEXT NOT NULL,
            duration TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `,
        `
          CREATE TABLE IF NOT EXISTS broadcasts (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            audience TEXT NOT NULL,
            class_name TEXT,
            class_start_at TEXT,
            class_end_at TEXT,
            class_mode TEXT,
            meeting_link TEXT,
            venue TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `,
        `
          CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            broadcast_id TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            audience TEXT NOT NULL,
            class_name TEXT,
            class_start_at TEXT,
            class_end_at TEXT,
            class_mode TEXT,
            meeting_link TEXT,
            venue TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `,
        "CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)",
        `
          CREATE TABLE IF NOT EXISTS assignments (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            audience TEXT NOT NULL DEFAULT 'All Students',
            instructions TEXT NOT NULL,
            due_date TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `,
        `
          CREATE TABLE IF NOT EXISTS assignment_submissions (
            id TEXT PRIMARY KEY,
            assignment_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            student_name TEXT NOT NULL,
            student_email TEXT NOT NULL,
            submission_type TEXT NOT NULL,
            text_content TEXT,
            file_name TEXT,
            file_mime_type TEXT,
            file_data_url TEXT,
            file_size_bytes INTEGER,
            score REAL,
            admin_comment TEXT,
            reviewed_at TEXT,
            reviewed_by_name TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `,
        "CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id)",
        "CREATE INDEX IF NOT EXISTS idx_assignment_submissions_user_id ON assignment_submissions(user_id)",
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_user ON assignment_submissions(assignment_id, user_id)",
        `
          CREATE TABLE IF NOT EXISTS academy_settings (
            id TEXT PRIMARY KEY,
            academy_name TEXT NOT NULL,
            support_email TEXT NOT NULL,
            timezone TEXT NOT NULL,
            default_online_link TEXT NOT NULL,
            default_venue TEXT NOT NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `,
        `
          CREATE TABLE IF NOT EXISTS pending_registrations (
            id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            date_of_birth_or_age TEXT NOT NULL,
            category TEXT NOT NULL,
            location TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            born_again TEXT NOT NULL,
            church TEXT,
            musical_skill TEXT,
            reason TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            otp_hash TEXT NOT NULL,
            otp_expires_at TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `,
        "CREATE INDEX IF NOT EXISTS idx_pending_registrations_email ON pending_registrations(email)",
        `
          CREATE TABLE IF NOT EXISTS pending_password_resets (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            otp_hash TEXT NOT NULL,
            otp_expires_at TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `,
        "CREATE INDEX IF NOT EXISTS idx_pending_password_resets_email ON pending_password_resets(email)",
      ])

      try {
        await turso.execute("ALTER TABLE assignments ADD COLUMN audience TEXT NOT NULL DEFAULT 'All Students'")
      } catch (error) {
        const message = error instanceof Error ? error.message.toLowerCase() : ""

        if (!message.includes("duplicate column")) {
          throw error
        }
      }

      for (const statement of [
        "ALTER TABLE assignment_submissions ADD COLUMN score REAL",
        "ALTER TABLE assignment_submissions ADD COLUMN admin_comment TEXT",
        "ALTER TABLE assignment_submissions ADD COLUMN reviewed_at TEXT",
        "ALTER TABLE assignment_submissions ADD COLUMN reviewed_by_name TEXT",
      ]) {
        try {
          await turso.execute(statement)
        } catch (error) {
          const message = error instanceof Error ? error.message.toLowerCase() : ""

          if (!message.includes("duplicate column")) {
            throw error
          }
        }
      }

      await seedAdminUser()
      await seedSettings()
      await seedCurriculum()
      await seedTeachersGuides()
    })()
  }

  await setupPromise
}

export async function registerStudent(payload: RegisterPayload) {
  await ensureDatabaseSetup()

  const email = ensureRequiredValue(payload.email, "Email").toLowerCase()

  if (payload.password.length < 8) {
    throw new AppError("Password must be at least 8 characters long.")
  }

  if (payload.password !== payload.confirmPassword) {
    throw new AppError("Passwords do not match.")
  }

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409)
  }

  const id = randomUUID()
  await turso.execute({
    sql: `
      INSERT INTO users (
        id, full_name, date_of_birth_or_age, category, location, email, phone, born_again,
        church, musical_skill, reason, password_hash, role, admission_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      ensureRequiredValue(payload.fullName, "Full name"),
      ensureRequiredValue(payload.dateOfBirthOrAge, "Date of birth / age"),
      ensureRequiredValue(payload.category, "Category"),
      ensureRequiredValue(payload.location, "Location"),
      email,
      ensureRequiredValue(payload.phone, "Phone"),
      ensureRequiredValue(payload.bornAgain, "Born again response"),
      sanitizeOptionalValue(payload.church),
      sanitizeOptionalValue(payload.musicalSkill),
      ensureRequiredValue(payload.reason, "Reason"),
      hashPassword(payload.password),
      "student",
      "pending",
    ],
  })

  const user = await getUserById(id)

  if (!user) {
    throw new AppError("We could not finish your registration. Please try again.", 500)
  }

  await syncExistingBroadcastsForUser(id)
  return mapUser(user)
}

export async function requestRegistrationOtp(payload: RegisterPayload): Promise<RegistrationOtpRequestResult> {
  await ensureDatabaseSetup()

  const email = ensureRequiredValue(payload.email, "Email").toLowerCase()

  if (payload.password.length < 8) {
    throw new AppError("Password must be at least 8 characters long.")
  }

  if (payload.password !== payload.confirmPassword) {
    throw new AppError("Passwords do not match.")
  }

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409)
  }

  const otp = generateOtp()
  const expiresAt = getOtpExpiryDate()
  const pendingId = (await getPendingRegistrationByEmail(email))?.id || randomUUID()

  await turso.execute({
    sql: `
      INSERT INTO pending_registrations (
        id, full_name, date_of_birth_or_age, category, location, email, phone, born_again,
        church, musical_skill, reason, password_hash, otp_hash, otp_expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        full_name = excluded.full_name,
        date_of_birth_or_age = excluded.date_of_birth_or_age,
        category = excluded.category,
        location = excluded.location,
        phone = excluded.phone,
        born_again = excluded.born_again,
        church = excluded.church,
        musical_skill = excluded.musical_skill,
        reason = excluded.reason,
        password_hash = excluded.password_hash,
        otp_hash = excluded.otp_hash,
        otp_expires_at = excluded.otp_expires_at,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [
      pendingId,
      ensureRequiredValue(payload.fullName, "Full name"),
      ensureRequiredValue(payload.dateOfBirthOrAge, "Date of birth / age"),
      ensureRequiredValue(payload.category, "Category"),
      ensureRequiredValue(payload.location, "Location"),
      email,
      ensureRequiredValue(payload.phone, "Phone"),
      ensureRequiredValue(payload.bornAgain, "Born again response"),
      sanitizeOptionalValue(payload.church),
      sanitizeOptionalValue(payload.musicalSkill),
      ensureRequiredValue(payload.reason, "Reason"),
      hashPassword(payload.password),
      hashOtp(otp),
      expiresAt.toISOString(),
    ],
  })

  await sendRegistrationOtpEmail(email, payload.fullName.trim(), otp)

  return {
    email,
    expiresAt: expiresAt.toISOString(),
  }
}

export async function verifyRegistrationOtp(payload: RegistrationOtpVerifyPayload) {
  await ensureDatabaseSetup()

  const email = ensureRequiredValue(payload.email, "Email").toLowerCase()
  const otp = ensureRequiredValue(payload.otp, "OTP")
  const pendingRegistration = await getPendingRegistrationByEmail(email)

  if (!pendingRegistration) {
    throw new AppError("No pending registration was found for this email.", 404)
  }

  if (new Date(pendingRegistration.otp_expires_at).getTime() < Date.now()) {
    throw new AppError("This OTP has expired. Please request a new code.")
  }

  if (hashOtp(otp) !== pendingRegistration.otp_hash) {
    throw new AppError("The OTP you entered is invalid.", 401)
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    await turso.execute({ sql: "DELETE FROM pending_registrations WHERE email = ?", args: [email] })
    throw new AppError("An account with this email already exists.", 409)
  }

  const id = randomUUID()
  await turso.execute({
    sql: `
      INSERT INTO users (
        id, full_name, date_of_birth_or_age, category, location, email, phone, born_again,
        church, musical_skill, reason, password_hash, role, admission_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      pendingRegistration.full_name,
      pendingRegistration.date_of_birth_or_age,
      pendingRegistration.category,
      pendingRegistration.location,
      pendingRegistration.email,
      pendingRegistration.phone,
      pendingRegistration.born_again,
      pendingRegistration.church,
      pendingRegistration.musical_skill,
      pendingRegistration.reason,
      pendingRegistration.password_hash,
      "student",
      "pending",
    ],
  })

  await turso.execute({ sql: "DELETE FROM pending_registrations WHERE email = ?", args: [email] })

  const user = await getUserById(id)

  if (!user) {
    throw new AppError("We could not finish your registration. Please try again.", 500)
  }

  await syncExistingBroadcastsForUser(id)
  void sendEmailSafely("registration confirmation", () =>
    sendRegistrationSubmittedEmail(user.email, user.full_name),
  )

  return mapUser(user)
}

export async function loginUser(payload: LoginPayload) {
  await ensureDatabaseSetup()

  const email = ensureRequiredValue(payload.email, "Email").toLowerCase()
  const user = await getUserByEmail(email)

  if (!user || !verifyPassword(payload.password, user.password_hash)) {
    throw new AppError("Invalid email or password.", 401)
  }

  return mapUser(user)
}

export async function requestPasswordResetOtp(payload: PasswordResetOtpRequestPayload): Promise<PasswordResetOtpRequestResult> {
  await ensureDatabaseSetup()

  const email = ensureRequiredValue(payload.email, "Email").toLowerCase()
  const user = await getUserByEmail(email)

  if (!user) {
    throw new AppError("No account was found with this email address.", 404)
  }

  const otp = generateOtp()
  const expiresAt = getOtpExpiryDate()
  const pendingId = (await getPendingPasswordResetByEmail(email))?.id || randomUUID()

  await turso.execute({
    sql: `
      INSERT INTO pending_password_resets (
        id, user_id, email, otp_hash, otp_expires_at
      ) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        user_id = excluded.user_id,
        otp_hash = excluded.otp_hash,
        otp_expires_at = excluded.otp_expires_at,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [
      pendingId,
      user.id,
      email,
      hashOtp(otp),
      expiresAt.toISOString(),
    ],
  })

  await sendPasswordResetOtpEmail(email, user.full_name, otp)

  return {
    email,
    expiresAt: expiresAt.toISOString(),
  }
}

export async function resetPasswordWithOtp(payload: PasswordResetOtpVerifyPayload) {
  await ensureDatabaseSetup()

  const email = ensureRequiredValue(payload.email, "Email").toLowerCase()
  const otp = ensureRequiredValue(payload.otp, "OTP")

  if (payload.password.length < 8) {
    throw new AppError("Password must be at least 8 characters long.")
  }

  if (payload.password !== payload.confirmPassword) {
    throw new AppError("Passwords do not match.")
  }

  const pendingReset = await getPendingPasswordResetByEmail(email)

  if (!pendingReset) {
    throw new AppError("Password reset request not found or has expired.", 404)
  }

  if (new Date(pendingReset.otp_expires_at).getTime() < Date.now()) {
    await turso.execute({ sql: "DELETE FROM pending_password_resets WHERE email = ?", args: [email] })
    throw new AppError("This password reset code has expired. Request a new one.", 410)
  }

  if (hashOtp(otp) !== pendingReset.otp_hash) {
    throw new AppError("The OTP you entered is invalid.", 401)
  }

  const user = await getUserById(pendingReset.user_id)

  if (!user) {
    await turso.execute({ sql: "DELETE FROM pending_password_resets WHERE email = ?", args: [email] })
    throw new AppError("User not found.", 404)
  }

  await turso.execute({
    sql: `
      UPDATE users
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      hashPassword(payload.password),
      user.id,
    ],
  })

  await turso.execute({ sql: "DELETE FROM pending_password_resets WHERE email = ?", args: [email] })

  return {
    email,
  }
}

export async function getAcademyUser(userId: string) {
  await ensureDatabaseSetup()
  const user = await getUserById(userId)
  return user ? mapUser(user) : null
}

export async function listAdmissions() {
  await ensureDatabaseSetup()

  const result = await turso.execute({
    sql: "SELECT * FROM users WHERE role = 'student' ORDER BY created_at DESC",
  })

  return result.rows.map((row) => mapUser(row as unknown as DatabaseUserRow))
}

export async function listAdmissionsByCreatedAtRange(startDate: string, endDate: string) {
  await ensureDatabaseSetup()

  const result = await turso.execute({
    sql: `
      SELECT * FROM users
      WHERE role = 'student'
        AND datetime(created_at) >= datetime(?)
        AND datetime(created_at) < datetime(?)
      ORDER BY created_at DESC
    `,
    args: [startDate, endDate],
  })

  return result.rows.map((row) => mapUser(row as unknown as DatabaseUserRow))
}

export async function createAdmission(payload: AdminStudentPayload) {
  await ensureDatabaseSetup()

  const email = ensureRequiredValue(payload.email, "Email").toLowerCase()
  const password = payload.password?.trim()

  if (!password || password.length < 8) {
    throw new AppError("A password of at least 8 characters is required for a new student.")
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409)
  }

  const id = randomUUID()
  await turso.execute({
    sql: `
      INSERT INTO users (
        id, full_name, date_of_birth_or_age, category, location, email, phone, born_again,
        church, musical_skill, reason, password_hash, role, admission_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      ensureRequiredValue(payload.fullName, "Full name"),
      ensureRequiredValue(payload.dateOfBirthOrAge, "Date of birth / age"),
      ensureRequiredValue(payload.category, "Category"),
      ensureRequiredValue(payload.location, "Location"),
      email,
      ensureRequiredValue(payload.phone, "Phone"),
      ensureRequiredValue(payload.bornAgain, "Born again response"),
      sanitizeOptionalValue(payload.church),
      sanitizeOptionalValue(payload.musicalSkill),
      ensureRequiredValue(payload.reason, "Reason"),
      hashPassword(password),
      "student",
      payload.admissionStatus,
    ],
  })

  const user = await getUserById(id)

  if (!user) {
    throw new AppError("Student record could not be created.", 500)
  }

  const mappedUser = mapUser(user)

  if (mappedUser.admissionStatus === "approved") {
    await runNonCriticalTask("student notification sync", () => syncExistingBroadcastsForUser(id))
  }

  await sendEmailSafely("admin account created", () =>
    sendAdminCreatedAccountEmail(mappedUser.email, mappedUser.fullName, password, mappedUser.admissionStatus),
  )

  return mappedUser
}

export async function updateAdmission(userId: string, payload: Partial<AdminStudentPayload>) {
  await ensureDatabaseSetup()

  const existingUser = await getUserById(userId)

  if (!existingUser || existingUser.role !== "student") {
    throw new AppError("Student record not found.", 404)
  }

  const nextEmail = payload.email ? payload.email.trim().toLowerCase() : existingUser.email

  if (nextEmail !== existingUser.email) {
    const emailOwner = await getUserByEmail(nextEmail)
    if (emailOwner && emailOwner.id !== userId) {
      throw new AppError("Another account already uses that email.", 409)
    }
  }

  const nextPasswordHash = payload.password?.trim()
    ? hashPassword(payload.password.trim())
    : existingUser.password_hash

  await turso.execute({
    sql: `
      UPDATE users
      SET
        full_name = ?,
        date_of_birth_or_age = ?,
        category = ?,
        location = ?,
        email = ?,
        phone = ?,
        born_again = ?,
        church = ?,
        musical_skill = ?,
        reason = ?,
        password_hash = ?,
        admission_status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      payload.fullName?.trim() || existingUser.full_name,
      payload.dateOfBirthOrAge?.trim() || existingUser.date_of_birth_or_age,
      payload.category?.trim() || existingUser.category,
      payload.location?.trim() || existingUser.location,
      nextEmail,
      payload.phone?.trim() || existingUser.phone,
      payload.bornAgain?.trim() || existingUser.born_again,
      payload.church !== undefined ? sanitizeOptionalValue(payload.church) : existingUser.church,
      payload.musicalSkill !== undefined ? sanitizeOptionalValue(payload.musicalSkill) : existingUser.musical_skill,
      payload.reason?.trim() || existingUser.reason,
      nextPasswordHash,
      payload.admissionStatus || existingUser.admission_status,
      userId,
    ],
  })

  const updatedUser = await getUserById(userId)

  if (!updatedUser) {
    throw new AppError("Student record not found.", 404)
  }

  const mappedUser = mapUser(updatedUser)

  if (existingUser.admission_status !== "approved" && mappedUser.admissionStatus === "approved") {
    await runNonCriticalTask("student notification sync", () => syncExistingBroadcastsForUser(userId))
    await sendEmailSafely("admission approved", () =>
      sendAdmissionApprovedEmail(mappedUser.email, mappedUser.fullName),
    )
  }

  if (existingUser.admission_status === "approved" && mappedUser.admissionStatus !== "approved") {
    await runNonCriticalTask("student notification sync", () => syncExistingBroadcastsForUser(userId))
  }

  if (existingUser.admission_status !== "rejected" && mappedUser.admissionStatus === "rejected") {
    await sendEmailSafely("admission rejected", () =>
      sendAdmissionRejectedEmail(mappedUser.email, mappedUser.fullName),
    )
  }

  return mappedUser
}

export async function updateAdmissionStatus(userId: string, status: AdmissionStatus) {
  return updateAdmission(userId, { admissionStatus: status })
}

export async function deleteAdmission(userId: string) {
  await ensureDatabaseSetup()

  const user = await getUserById(userId)

  if (!user) {
    throw new AppError("Student record not found.", 404)
  }

  await turso.execute({ sql: "DELETE FROM notifications WHERE user_id = ?", args: [userId] })
  await turso.execute({ sql: "DELETE FROM assignment_submissions WHERE user_id = ?", args: [userId] })
  await turso.execute({ sql: "DELETE FROM users WHERE id = ?", args: [userId] })
}

export async function listCurriculumItems() {
  await ensureDatabaseSetup()
  const result = await turso.execute("SELECT * FROM curriculum_items ORDER BY created_at ASC")
  return result.rows.map((row) => mapCurriculum(row as unknown as DatabaseCurriculumRow))
}

export async function createCurriculumItem(payload: CurriculumPayload) {
  await ensureDatabaseSetup()
  const id = randomUUID()

  await turso.execute({
    sql: "INSERT INTO curriculum_items (id, title, category, week, content) VALUES (?, ?, ?, ?, ?)",
    args: [
      id,
      ensureRequiredValue(payload.title, "Title"),
      normalizeCurriculumCategory(payload.category),
      ensureRequiredValue(payload.week, "Week"),
      ensureRequiredValue(payload.content, "Content"),
    ],
  })

  const item = await getCurriculumById(id)
  if (!item) throw new AppError("Curriculum item could not be created.", 500)
  return mapCurriculum(item)
}

export async function updateCurriculumItem(itemId: string, payload: Partial<CurriculumPayload>) {
  await ensureDatabaseSetup()
  const existingItem = await getCurriculumById(itemId)

  if (!existingItem) {
    throw new AppError("Curriculum item not found.", 404)
  }

  await turso.execute({
    sql: `
      UPDATE curriculum_items
      SET title = ?, category = ?, week = ?, content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      payload.title?.trim() || existingItem.title,
      payload.category ? normalizeCurriculumCategory(payload.category) : existingItem.category,
      payload.week?.trim() || existingItem.week,
      payload.content?.trim() || existingItem.content,
      itemId,
    ],
  })

  const updatedItem = await getCurriculumById(itemId)
  if (!updatedItem) throw new AppError("Curriculum item not found.", 404)
  return mapCurriculum(updatedItem)
}

export async function deleteCurriculumItem(itemId: string) {
  await ensureDatabaseSetup()
  await turso.execute({ sql: "DELETE FROM curriculum_items WHERE id = ?", args: [itemId] })
}

export async function listTeachersGuides() {
  await ensureDatabaseSetup()
  const result = await turso.execute("SELECT * FROM teachers_guides ORDER BY created_at ASC")
  return result.rows.map((row) => mapTeachersGuide(row as unknown as DatabaseTeachersGuideRow))
}

export async function createTeachersGuide(payload: TeachersGuidePayload) {
  await ensureDatabaseSetup()
  const id = randomUUID()

  await turso.execute({
    sql: "INSERT INTO teachers_guides (id, title, owner, duration, content) VALUES (?, ?, ?, ?, ?)",
    args: [
      id,
      ensureRequiredValue(payload.title, "Title"),
      ensureRequiredValue(payload.owner, "Owner"),
      ensureRequiredValue(payload.duration, "Duration"),
      ensureRequiredValue(payload.content, "Content"),
    ],
  })

  const item = await getTeachersGuideById(id)
  if (!item) throw new AppError("Teachers guide could not be created.", 500)
  return mapTeachersGuide(item)
}

export async function updateTeachersGuide(itemId: string, payload: Partial<TeachersGuidePayload>) {
  await ensureDatabaseSetup()
  const existingItem = await getTeachersGuideById(itemId)

  if (!existingItem) {
    throw new AppError("Teachers guide not found.", 404)
  }

  await turso.execute({
    sql: `
      UPDATE teachers_guides
      SET title = ?, owner = ?, duration = ?, content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      payload.title?.trim() || existingItem.title,
      payload.owner?.trim() || existingItem.owner,
      payload.duration?.trim() || existingItem.duration,
      payload.content?.trim() || existingItem.content,
      itemId,
    ],
  })

  const updatedItem = await getTeachersGuideById(itemId)
  if (!updatedItem) throw new AppError("Teachers guide not found.", 404)
  return mapTeachersGuide(updatedItem)
}

export async function deleteTeachersGuide(itemId: string) {
  await ensureDatabaseSetup()
  await turso.execute({ sql: "DELETE FROM teachers_guides WHERE id = ?", args: [itemId] })
}

export async function listBroadcasts() {
  await ensureDatabaseSetup()
  const result = await turso.execute("SELECT * FROM broadcasts ORDER BY COALESCE(class_start_at, created_at) DESC")
  return result.rows.map((row) => mapBroadcast(row as unknown as DatabaseBroadcastRow))
}

export async function createBroadcast(payload: BroadcastPayload) {
  await ensureDatabaseSetup()
  const settings = await getAcademySettings()
  const id = randomUUID()

  await turso.execute({
    sql: `
      INSERT INTO broadcasts (
        id, title, message, audience, class_name, class_start_at, class_end_at,
        class_mode, meeting_link, venue
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      ensureRequiredValue(payload.title, "Title"),
      ensureRequiredValue(payload.message, "Message"),
      normalizeBroadcastAudience(payload.audience),
      sanitizeOptionalValue(payload.className),
      sanitizeOptionalValue(payload.classStartAt),
      sanitizeOptionalValue(payload.classEndAt),
      payload.classMode || null,
      payload.classMode === "online"
        ? sanitizeOptionalValue(payload.meetingLink) || settings.defaultOnlineLink
        : null,
      payload.classMode === "physical"
        ? sanitizeOptionalValue(payload.venue) || settings.defaultVenue
        : null,
    ],
  })

  const item = await getBroadcastById(id)
  if (!item) throw new AppError("Broadcast could not be created.", 500)

  const mapped = mapBroadcast(item)
  await syncNotificationsForBroadcast(mapped)

  const recipientEmails = (await listStudentsMatchingAudience(mapped.audience))
    .map((student) => student.email)
    .filter(Boolean)

  for (const batch of chunkArray(recipientEmails, 25)) {
    await sendEmailSafely("broadcast", () =>
      sendBroadcastEmail(batch, {
        title: mapped.title,
        message: mapped.message,
        className: mapped.className,
        classStartAt: mapped.classStartAt,
        classMode: mapped.classMode,
        meetingLink: mapped.meetingLink,
        venue: mapped.venue,
      }),
    )

    await sleep(2000)
  }

  return mapped
}

export async function updateBroadcast(itemId: string, payload: Partial<BroadcastPayload>) {
  await ensureDatabaseSetup()
  const existingItem = await getBroadcastById(itemId)

  if (!existingItem) {
    throw new AppError("Broadcast not found.", 404)
  }

  const settings = await getAcademySettings()
  const nextMode = payload.classMode ?? existingItem.class_mode

  await turso.execute({
    sql: `
      UPDATE broadcasts
      SET
        title = ?,
        message = ?,
        audience = ?,
        class_name = ?,
        class_start_at = ?,
        class_end_at = ?,
        class_mode = ?,
        meeting_link = ?,
        venue = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      payload.title?.trim() || existingItem.title,
      payload.message?.trim() || existingItem.message,
      payload.audience ? normalizeBroadcastAudience(payload.audience) : existingItem.audience,
      payload.className !== undefined ? sanitizeOptionalValue(payload.className) : existingItem.class_name,
      payload.classStartAt !== undefined ? sanitizeOptionalValue(payload.classStartAt) : existingItem.class_start_at,
      payload.classEndAt !== undefined ? sanitizeOptionalValue(payload.classEndAt) : existingItem.class_end_at,
      nextMode,
      nextMode === "online"
        ? payload.meetingLink !== undefined
          ? sanitizeOptionalValue(payload.meetingLink) || settings.defaultOnlineLink
          : existingItem.meeting_link || settings.defaultOnlineLink
        : null,
      nextMode === "physical"
        ? payload.venue !== undefined
          ? sanitizeOptionalValue(payload.venue) || settings.defaultVenue
          : existingItem.venue || settings.defaultVenue
        : null,
      itemId,
    ],
  })

  const updatedItem = await getBroadcastById(itemId)
  if (!updatedItem) throw new AppError("Broadcast not found.", 404)

  const mapped = mapBroadcast(updatedItem)
  await syncNotificationsForBroadcast(mapped)
  return mapped
}

export async function deleteBroadcast(itemId: string) {
  await ensureDatabaseSetup()
  await turso.execute({ sql: "DELETE FROM notifications WHERE broadcast_id = ?", args: [itemId] })
  await turso.execute({ sql: "DELETE FROM broadcasts WHERE id = ?", args: [itemId] })
}

function normalizeAssignmentSubmissionPayload(payload: AssignmentSubmissionPayload) {
  const submissionType = normalizeAssignmentSubmissionType(payload.submissionType)

  if (submissionType === "text") {
    return {
      submissionType,
      textContent: ensureRequiredValue(payload.textContent || "", "Submission text"),
      fileName: null,
      fileMimeType: null,
      fileDataUrl: null,
      fileSizeBytes: null,
    }
  }

  const fileName = ensureRequiredValue(payload.fileName || "", "File name")
  const { mimeType, base64Payload } = parseDataUrl(payload.fileDataUrl || "")
  const fileSizeBytes = Buffer.from(base64Payload, "base64").byteLength

  if (fileSizeBytes > 5 * 1024 * 1024) {
    throw new AppError("Files must be 5MB or smaller.")
  }

  if (submissionType === "image" && !mimeType.startsWith("image/")) {
    throw new AppError("Image submissions must use an image file.")
  }

  if (submissionType === "pdf" && mimeType !== "application/pdf") {
    throw new AppError("PDF submissions must use a PDF file.")
  }

  return {
    submissionType,
    textContent: null,
    fileName,
    fileMimeType: mimeType,
    fileDataUrl: ensureRequiredValue(payload.fileDataUrl || "", "File"),
    fileSizeBytes,
  }
}

function normalizeAssignmentSubmissionReviewPayload(payload: AssignmentSubmissionReviewPayload) {
  const adminComment = payload.adminComment !== undefined ? sanitizeOptionalValue(payload.adminComment) : null
  const score = payload.score

  if (score === undefined || score === null || Number.isNaN(Number(score))) {
    return {
      score: null,
      adminComment,
    }
  }

  const normalizedScore = Number(score)

  if (normalizedScore < 1 || normalizedScore > 10) {
    throw new AppError("Score must be between 1 and 10.")
  }

  return {
    score: normalizedScore,
    adminComment,
  }
}

export async function listAssignments() {
  await ensureDatabaseSetup()
  const result = await turso.execute("SELECT * FROM assignments ORDER BY due_date ASC")
  return result.rows.map((row) => mapAssignment(row as unknown as DatabaseAssignmentRow))
}

export async function listAssignmentsForAdmin() {
  await ensureDatabaseSetup()

  const [assignments, submissions] = await Promise.all([
    listAssignments(),
    turso.execute(`
      SELECT assignment_id, COUNT(*) AS submission_count, MAX(updated_at) AS latest_submission_at
      FROM assignment_submissions
      GROUP BY assignment_id
    `),
  ])

  const submissionMeta = new Map<string, { count: number; latestSubmissionAt: string | null }>()

  for (const row of submissions.rows) {
    const assignmentId = String((row as { assignment_id?: string }).assignment_id || "")

    if (!assignmentId) {
      continue
    }

    submissionMeta.set(assignmentId, {
      count: Number((row as { submission_count?: number | string }).submission_count ?? 0),
      latestSubmissionAt: ((row as { latest_submission_at?: string | null }).latest_submission_at ?? null),
    })
  }

  return assignments.map((assignment) => {
    const meta = submissionMeta.get(assignment.id)

    return {
      ...assignment,
      submissionCount: meta?.count ?? 0,
      latestSubmissionAt: meta?.latestSubmissionAt ?? null,
    }
  })
}

export async function listAssignmentSubmissionsForAdmin(assignmentId: string) {
  await ensureDatabaseSetup()

  const assignment = await getAssignmentById(assignmentId)

  if (!assignment) {
    throw new AppError("Assignment not found.", 404)
  }

  return listAssignmentSubmissionsByAssignmentId(assignmentId)
}

export async function createAssignment(payload: AssignmentPayload) {
  await ensureDatabaseSetup()
  const id = randomUUID()

  await turso.execute({
    sql: "INSERT INTO assignments (id, title, audience, instructions, due_date) VALUES (?, ?, ?, ?, ?)",
    args: [
      id,
      ensureRequiredValue(payload.title, "Title"),
      normalizeAssignmentAudience(payload.audience),
      ensureRequiredValue(payload.instructions, "Instructions"),
      ensureRequiredValue(payload.dueDate, "Due date"),
    ],
  })

  const item = await getAssignmentById(id)
  if (!item) throw new AppError("Assignment could not be created.", 500)
  return mapAssignment(item)
}

export async function updateAssignment(itemId: string, payload: Partial<AssignmentPayload>) {
  await ensureDatabaseSetup()
  const existingItem = await getAssignmentById(itemId)

  if (!existingItem) {
    throw new AppError("Assignment not found.", 404)
  }

  await turso.execute({
    sql: `
      UPDATE assignments
      SET title = ?, audience = ?, instructions = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      payload.title?.trim() || existingItem.title,
      payload.audience ? normalizeAssignmentAudience(payload.audience) : existingItem.audience,
      payload.instructions?.trim() || existingItem.instructions,
      payload.dueDate?.trim() || existingItem.due_date,
      itemId,
    ],
  })

  const updatedItem = await getAssignmentById(itemId)
  if (!updatedItem) throw new AppError("Assignment not found.", 404)
  return mapAssignment(updatedItem)
}

export async function deleteAssignment(itemId: string) {
  await ensureDatabaseSetup()
  await turso.execute({ sql: "DELETE FROM assignment_submissions WHERE assignment_id = ?", args: [itemId] })
  await turso.execute({ sql: "DELETE FROM assignments WHERE id = ?", args: [itemId] })
}

export async function submitAssignmentForStudent(userId: string, assignmentId: string, payload: AssignmentSubmissionPayload) {
  await ensureDatabaseSetup()

  const [user, assignment, existingSubmission] = await Promise.all([
    getAcademyUser(userId),
    getAssignmentById(assignmentId),
    getAssignmentSubmissionByAssignmentAndUser(assignmentId, userId),
  ])

  if (!user || user.role !== "student") {
    throw new AppError("Student account not found.", 404)
  }

  if (!assignment) {
    throw new AppError("Assignment not found.", 404)
  }

  if (assignment.audience !== "All Students" && assignment.audience !== user.category) {
    throw new AppError("You cannot submit this assignment.", 403)
  }

  const normalizedPayload = normalizeAssignmentSubmissionPayload(payload)

  if (existingSubmission) {
    await turso.execute({
      sql: `
        UPDATE assignment_submissions
        SET
          student_name = ?,
          student_email = ?,
          submission_type = ?,
          text_content = ?,
          file_name = ?,
          file_mime_type = ?,
          file_data_url = ?,
          file_size_bytes = ?,
          score = NULL,
          admin_comment = NULL,
          reviewed_at = NULL,
          reviewed_by_name = NULL,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        user.fullName,
        user.email,
        normalizedPayload.submissionType,
        normalizedPayload.textContent,
        normalizedPayload.fileName,
        normalizedPayload.fileMimeType,
        normalizedPayload.fileDataUrl,
        normalizedPayload.fileSizeBytes,
        existingSubmission.id,
      ],
    })
  } else {
    await turso.execute({
      sql: `
        INSERT INTO assignment_submissions (
          id, assignment_id, user_id, student_name, student_email, submission_type,
          text_content, file_name, file_mime_type, file_data_url, file_size_bytes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        randomUUID(),
        assignmentId,
        userId,
        user.fullName,
        user.email,
        normalizedPayload.submissionType,
        normalizedPayload.textContent,
        normalizedPayload.fileName,
        normalizedPayload.fileMimeType,
        normalizedPayload.fileDataUrl,
        normalizedPayload.fileSizeBytes,
      ],
    })
  }

  const updatedSubmission = await getAssignmentSubmissionByAssignmentAndUser(assignmentId, userId)

  if (!updatedSubmission) {
    throw new AppError("Assignment submission could not be saved.", 500)
  }

  return mapAssignmentSubmission(updatedSubmission)
}

export async function reviewAssignmentSubmission(submissionId: string, adminName: string, payload: AssignmentSubmissionReviewPayload) {
  await ensureDatabaseSetup()

  const existingSubmission = await getAssignmentSubmissionById(submissionId)

  if (!existingSubmission) {
    throw new AppError("Assignment submission not found.", 404)
  }

  const normalizedPayload = normalizeAssignmentSubmissionReviewPayload(payload)

  await turso.execute({
    sql: `
      UPDATE assignment_submissions
      SET
        score = ?,
        admin_comment = ?,
        reviewed_at = CURRENT_TIMESTAMP,
        reviewed_by_name = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [normalizedPayload.score, normalizedPayload.adminComment, adminName, submissionId],
  })

  const updatedSubmission = await getAssignmentSubmissionById(submissionId)

  if (!updatedSubmission) {
    throw new AppError("Assignment submission not found.", 404)
  }

  return mapAssignmentSubmission(updatedSubmission)
}

export async function getAcademySettings() {
  await ensureDatabaseSetup()
  const result = await turso.execute("SELECT * FROM academy_settings LIMIT 1")
  const row = result.rows[0]

  if (!row) {
    throw new AppError("Settings record not found.", 404)
  }

  return mapSettings(row as unknown as DatabaseSettingsRow)
}

export async function updateAcademySettings(payload: SettingsPayload) {
  await ensureDatabaseSetup()
  const settings = await getAcademySettings()

  await turso.execute({
    sql: `
      UPDATE academy_settings
      SET academy_name = ?, support_email = ?, timezone = ?, default_online_link = ?, default_venue = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      ensureRequiredValue(payload.academyName, "Academy name"),
      ensureRequiredValue(payload.supportEmail, "Support email"),
      ensureRequiredValue(payload.timezone, "Timezone"),
      ensureRequiredValue(payload.defaultOnlineLink, "Default online link"),
      ensureRequiredValue(payload.defaultVenue, "Default venue"),
      settings.id,
    ],
  })

  return getAcademySettings()
}

export async function listNotificationsForUser(userId: string) {
  await ensureDatabaseSetup()
  const result = await turso.execute({
    sql: "SELECT * FROM notifications WHERE user_id = ? ORDER BY COALESCE(class_start_at, created_at) DESC",
    args: [userId],
  })

  return result.rows.map((row) => mapNotification(row as unknown as DatabaseNotificationRow))
}

export async function getStudentDashboardData(userId: string) {
  await ensureDatabaseSetup()
  const user = await getAcademyUser(userId)

  if (!user) {
    throw new AppError("User not found.", 404)
  }

  const [curriculum, assignments, notifications] = await Promise.all([
    listCurriculumItems(),
    listAssignments(),
    listNotificationsForUser(userId),
  ])

  const visibleCurriculum = curriculum.filter((item) => item.category === "All Students" || item.category === user.category)
  const visibleAssignments = assignments.filter((item) => item.audience === "All Students" || item.audience === user.category)
  const assignmentSubmissions = await turso.execute({
    sql: "SELECT * FROM assignment_submissions WHERE user_id = ?",
    args: [userId],
  })
  const submissionsByAssignmentId = new Map(
    assignmentSubmissions.rows.map((row) => {
      const submission = mapAssignmentSubmission(row as unknown as DatabaseAssignmentSubmissionRow)
      return [submission.assignmentId, submission] as const
    }),
  )

  const visibleAssignmentsWithSubmissions = visibleAssignments.map((item) => ({
    ...item,
    submission: submissionsByAssignmentId.get(item.id) || null,
  }))

  const classSchedule = notifications
    .filter((item) => item.classStartAt)
    .sort((left, right) => new Date(left.classStartAt!).getTime() - new Date(right.classStartAt!).getTime())

  const nextClass = classSchedule.find((item) => new Date(item.classStartAt!).getTime() >= Date.now()) || classSchedule[0] || null

  return {
    curriculum: visibleCurriculum,
    assignments: visibleAssignmentsWithSubmissions,
    notifications,
    classSchedule,
    nextClass,
  }
}

export async function getOverviewMetrics() {
  await ensureDatabaseSetup()

  const [counts, recentActivity, curriculumCount, guideCount, broadcastCount] = await Promise.all([
    turso.execute(`
      SELECT
        COUNT(*) AS total_students,
        SUM(CASE WHEN admission_status = 'pending' THEN 1 ELSE 0 END) AS pending_approvals,
        SUM(CASE WHEN admission_status = 'approved' THEN 1 ELSE 0 END) AS approved_students,
        SUM(CASE WHEN admission_status = 'rejected' THEN 1 ELSE 0 END) AS rejected_students
      FROM users
      WHERE role = 'student'
    `),
    turso.execute("SELECT full_name, category, admission_status, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC LIMIT 5"),
    turso.execute("SELECT COUNT(*) AS total FROM curriculum_items"),
    turso.execute("SELECT COUNT(*) AS total FROM teachers_guides"),
    turso.execute("SELECT COUNT(*) AS total FROM broadcasts"),
  ])

  const summaryRow = counts.rows[0] as unknown as {
    total_students: number | string | null
    pending_approvals: number | string | null
    approved_students: number | string | null
    rejected_students: number | string | null
  }

  return {
    totalStudents: Number(summaryRow?.total_students ?? 0),
    pendingApprovals: Number(summaryRow?.pending_approvals ?? 0),
    approvedStudents: Number(summaryRow?.approved_students ?? 0),
    rejectedStudents: Number(summaryRow?.rejected_students ?? 0),
    totalCurriculumItems: Number((curriculumCount.rows[0] as { total?: string | number }).total ?? 0),
    totalTeachersGuides: Number((guideCount.rows[0] as { total?: string | number }).total ?? 0),
    totalBroadcasts: Number((broadcastCount.rows[0] as { total?: string | number }).total ?? 0),
    recentActivity: recentActivity.rows.map((row) => {
      const item = row as unknown as {
        full_name: string
        category: string
        admission_status: AdmissionStatus
        created_at: string
      }

      return {
        item: "New registration",
        detail: `${item.full_name} joined ${item.category}`,
        time: new Date(item.created_at).toLocaleString("en-NG", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        status: item.admission_status,
      }
    }),
  }
}
