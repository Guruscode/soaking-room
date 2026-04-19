export type UserRole = "student" | "admin"
export type AdmissionStatus = "pending" | "approved" | "rejected"
export type ClassMode = "online" | "physical"

export type AcademyUser = {
  id: string
  fullName: string
  dateOfBirthOrAge: string
  category: string
  location: string
  email: string
  phone: string
  bornAgain: string
  church: string | null
  musicalSkill: string | null
  reason: string
  role: UserRole
  admissionStatus: AdmissionStatus
  createdAt: string
  updatedAt: string
}

export type CurriculumItem = {
  id: string
  title: string
  category: string
  week: string
  content: string
  createdAt: string
  updatedAt: string
}

export type TeachersGuideItem = {
  id: string
  title: string
  owner: string
  duration: string
  content: string
  createdAt: string
  updatedAt: string
}

export type BroadcastItem = {
  id: string
  title: string
  message: string
  audience: string
  className: string | null
  classStartAt: string | null
  classEndAt: string | null
  classMode: ClassMode | null
  meetingLink: string | null
  venue: string | null
  createdAt: string
  updatedAt: string
}

export type AssignmentItem = {
  id: string
  title: string
  instructions: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

export type NotificationItem = {
  id: string
  title: string
  message: string
  audience: string
  className: string | null
  classStartAt: string | null
  classEndAt: string | null
  classMode: ClassMode | null
  meetingLink: string | null
  venue: string | null
  createdAt: string
}

export type AcademySettings = {
  id: string
  academyName: string
  supportEmail: string
  timezone: string
  defaultOnlineLink: string
  defaultVenue: string
  updatedAt: string
}

export type RegisterPayload = {
  fullName: string
  dateOfBirthOrAge: string
  category: string
  location: string
  email: string
  phone: string
  bornAgain: string
  church?: string
  musicalSkill?: string
  reason: string
  password: string
  confirmPassword: string
}

export type RegistrationOtpRequestResult = {
  email: string
  expiresAt: string
}

export type RegistrationOtpVerifyPayload = {
  email: string
  otp: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type AdminStudentPayload = {
  fullName: string
  dateOfBirthOrAge: string
  category: string
  location: string
  email: string
  phone: string
  bornAgain: string
  church?: string
  musicalSkill?: string
  reason: string
  admissionStatus: AdmissionStatus
  password?: string
}

export type CurriculumPayload = {
  title: string
  category: string
  week: string
  content: string
}

export type TeachersGuidePayload = {
  title: string
  owner: string
  duration: string
  content: string
}

export type BroadcastPayload = {
  title: string
  message: string
  audience: string
  className?: string
  classStartAt?: string
  classEndAt?: string
  classMode?: ClassMode
  meetingLink?: string
  venue?: string
}

export type AssignmentPayload = {
  title: string
  instructions: string
  dueDate: string
}

export type SettingsPayload = {
  academyName: string
  supportEmail: string
  timezone: string
  defaultOnlineLink: string
  defaultVenue: string
}
