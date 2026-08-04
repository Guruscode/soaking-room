export type UserRole = "student" | "admin"
export type AdmissionStatus = "pending" | "approved" | "rejected"
export type ClassMode = "online" | "physical"
export type AssignmentSubmissionType = "text" | "image" | "pdf"

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
  audience: string
  instructions: string
  dueDate: string
  createdAt: string
  updatedAt: string
  submission?: AssignmentSubmissionItem | null
  submissionCount?: number
  latestSubmissionAt?: string | null
}

export type AssignmentSubmissionItem = {
  id: string
  assignmentId: string
  userId: string
  studentName: string
  studentEmail: string
  submissionType: AssignmentSubmissionType
  textContent: string | null
  fileName: string | null
  fileMimeType: string | null
  fileDataUrl: string | null
  fileSizeBytes: number | null
  score: number | null
  adminComment: string | null
  reviewedAt: string | null
  reviewedByName: string | null
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
  bookingNotificationEmails: string
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

export type PasswordResetOtpRequestPayload = {
  email: string
}

export type PasswordResetOtpRequestResult = {
  email: string
  expiresAt: string
}

export type PasswordResetOtpVerifyPayload = {
  email: string
  otp: string
  password: string
  confirmPassword: string
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
  audience: string
  instructions: string
  dueDate: string
}

export type AssignmentSubmissionPayload = {
  submissionType: AssignmentSubmissionType
  textContent?: string
  fileName?: string
  fileMimeType?: string
  fileDataUrl?: string
}

export type AssignmentSubmissionReviewPayload = {
  score?: number | null
  adminComment?: string
}

export type ExamStatus = "inactive" | "active"

export type ExamConfig = {
  id: string
  status: ExamStatus
  durationMinutes: number
  title: string
  description: string
  courseCode: string
  cohort: string
  totalMarks: number
  instructions: string
  requiresProctoring: boolean
  createdAt: string
  updatedAt: string
}

export type ExamQuestion = {
  id: string
  sectionTitle: string
  questionNumber: number
  questionText: string
  marks: number
}

export type ExamAnswerItem = {
  id: string
  examId: string
  userId: string
  studentName: string
  studentEmail: string
  answers: string
  startedAt: string | null
  submittedAt: string | null
  isSubmitted: boolean
  score: number | null
  reviewedAt: string | null
  reviewedBy: string | null
  resultsNotified: boolean
  createdAt: string
  updatedAt: string
}

export type ExamSubmitPayload = {
  examAnswerId: string
  answers: Array<{ questionId: string; answer: string }>
}

export type ExamConfigPayload = {
  title: string
  description: string
  courseCode: string
  cohort: string
  totalMarks: number
  durationMinutes: number
  instructions: string
  requiresProctoring?: boolean
}

export type ExamMessage = {
  id: string
  examId: string
  userId: string
  studentName: string
  studentEmail: string
  message: string
  parentId: string | null
  isFromAdmin: boolean
  createdAt: string
}

export type ProctoringCameraSnapshot = {
  id: string
  examId: string
  userId: string
  imageBase64: string
  capturedAt: string
}

export type ProctoringEvent = {
  id: string
  examId: string
  userId: string
  studentName: string
  studentEmail: string
  eventType: string
  eventData: string | null
  createdAt: string
}

export type SettingsPayload = {
  academyName: string
  supportEmail: string
  timezone: string
  defaultOnlineLink: string
  defaultVenue: string
  bookingNotificationEmails: string
}

export type MinistryBookingStatus = "pending" | "approved" | "rejected"

export type MinistryQuestionnaire = {
  // Section 1 — Event Overview
  eventNameAndPurpose: string
  eventDates: string[]
  programSchedule: string
  venueNameAndAddress: string
  primaryContact: string
  eventType: string
  eventTypeOther: string
  ministerRole: string
  ministerRoleOther: string
  // Section 3 — Musical & Technical Requirements
  soundSystem: string
  soundSystemSpecs: string
  soundEngineerContact: string
  bandOption: string
  localMusiciansDetails: string
  additionalMusicalNeeds: string
  equipmentTransportHelp: string
  equipmentLogistics: string
  rehearsalSoundcheck: string
  rehearsalSchedule: string
  soundEngineerAvailable: string
  secureStorage: string
  // Section 4 — Travel & Transportation
  transportMode: string
  baggageFeesCovered: string
  pickupDropOff: string
  itineraryDeadline: string
  parking: string
  // Section 5 — Accommodation
  hotel: string
  alternativeAccommodation: string
  runningWater: string
  electricity: string
  wifiAccess: string
  dietaryPreferences: string
  // Section 6 — Financial Arrangements
  honorariumProvided: string
  paymentMethod: string
  cancellationPolicy: string
  // Section 7 — Ministration Details
  requestedTopics: string
  stageTime: string
  ministrationDuration: string
  programOrder: string
  // Section 8 — Intellectual Property
  recordedBroadcast: string
  recordingDetails: string
  usageRights: string
  mediaCopies: string
  // Section 9 — Welfare & Team Support
  foodRefreshments: string
  additionalNeeds: string
}

export type MinistryBooking = {
  id: string
  fullName: string
  email: string
  phone: string
  eventName: string
  eventType: string
  venue: string
  eventDates: string[]
  questionnaire: MinistryQuestionnaire
  status: MinistryBookingStatus
  adminNote: string | null
  reviewedAt: string | null
  reviewedBy: string | null
  createdAt: string
  updatedAt: string
}

export type MinistryBookingPayload = {
  fullName: string
  email: string
  phone: string
  questionnaire: MinistryQuestionnaire
}

export type BookingStatusPayload = {
  status: MinistryBookingStatus
  adminNote?: string
}

export type BlockedBookingDate = {
  id: string
  date: string
  reason: string | null
  createdAt: string
}

export type BookingAvailability = {
  approvedDates: string[]
  pendingDates: string[]
  blockedDates: string[]
}
