import type { MinistryQuestionnaire } from "@/lib/types"

export type ContactInfo = {
  fullName: string
  email: string
  phone: string
}

export type QuestionnaireSetter = <K extends keyof MinistryQuestionnaire>(key: K, value: MinistryQuestionnaire[K]) => void

export const DATE_OPTIONS = { day: "numeric", month: "long", year: "numeric" } as const

export const emptyQuestionnaire: MinistryQuestionnaire = {
  eventNameAndPurpose: "",
  eventDates: [],
  programSchedule: "",
  venueNameAndAddress: "",
  primaryContact: "",
  eventType: "",
  eventTypeOther: "",
  ministerRole: "",
  ministerRoleOther: "",
  soundSystem: "",
  soundSystemSpecs: "",
  soundEngineerContact: "",
  bandOption: "",
  localMusiciansDetails: "",
  additionalMusicalNeeds: "",
  equipmentTransportHelp: "",
  equipmentLogistics: "",
  rehearsalSoundcheck: "",
  rehearsalSchedule: "",
  soundEngineerAvailable: "",
  secureStorage: "",
  transportMode: "",
  baggageFeesCovered: "",
  pickupDropOff: "",
  itineraryDeadline: "",
  parking: "",
  hotel: "",
  alternativeAccommodation: "",
  runningWater: "",
  electricity: "",
  wifiAccess: "",
  dietaryPreferences: "",
  honorariumProvided: "",
  paymentMethod: "",
  cancellationPolicy: "",
  requestedTopics: "",
  stageTime: "",
  ministrationDuration: "",
  programOrder: "",
  recordedBroadcast: "",
  recordingDetails: "",
  usageRights: "",
  mediaCopies: "",
  foodRefreshments: "",
  additionalNeeds: "",
}

export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function fromDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function formatDateLabel(key: string) {
  return new Intl.DateTimeFormat("en-GB", DATE_OPTIONS).format(fromDateKey(key))
}
