export const STUDENT_CATEGORY_OPTIONS = [
  "Children (5-12)",
  "Teenager (13-19)",
  "Adult (20+)",
  "Master Class",
] as const

export const CURRICULUM_CATEGORY_OPTIONS = ["All Students", ...STUDENT_CATEGORY_OPTIONS] as const

export const BROADCAST_AUDIENCE_OPTIONS = ["All Students", ...STUDENT_CATEGORY_OPTIONS] as const
