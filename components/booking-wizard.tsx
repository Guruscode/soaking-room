"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/errors"
import type { BookingAvailability, MinistryQuestionnaire } from "@/lib/types"
import {
  DatesStep,
  EventStep,
  FinanceStep,
  MediaStep,
  MinistrationStep,
  MusicStep,
  ReviewStep,
  TravelStep,
} from "@/components/booking-wizard-steps"
import { emptyQuestionnaire, fromDateKey, toDateKey, formatDateLabel, type ContactInfo } from "@/components/booking-wizard-shared"

const STEPS = [
  { id: "dates", label: "Dates", title: "Choose your date(s)", subtitle: "Select the day(s) you would like to host Minister Moses Akoh." },
  { id: "event", label: "Event", title: "Event overview", subtitle: "Tell us about the event, its purpose, and how to reach you." },
  { id: "music", label: "Music & Tech", title: "Musical & technical requirements", subtitle: "Sound, band option, equipment, rehearsal, and team support." },
  { id: "travel", label: "Travel & Stay", title: "Travel & accommodation", subtitle: "Transportation, pickup, lodging, and amenities." },
  { id: "finance", label: "Finance", title: "Financial arrangements", subtitle: "Honorarium, payment method, and cancellation policy." },
  { id: "ministration", label: "Ministration", title: "Ministration details", subtitle: "Topics, stage time, duration, and program order." },
  { id: "media", label: "Media & Care", title: "Media & welfare", subtitle: "Recording rights, food, and additional needs." },
  { id: "review", label: "Review", title: "Review & submit", subtitle: "Double-check your details before submitting." },
] as const

export default function BookingWizard() {
  const [stepIndex, setStepIndex] = useState(0)
  const [contact, setContact] = useState<ContactInfo>({ fullName: "", email: "", phone: "" })
  const [q, setQ] = useState<MinistryQuestionnaire>(emptyQuestionnaire)
  const [availability, setAvailability] = useState<BookingAvailability>({ approvedDates: [], pendingDates: [], blockedDates: [] })
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const set = useCallback(<K extends keyof MinistryQuestionnaire>(key: K, value: MinistryQuestionnaire[K]) => {
    setQ((prev) => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch("/api/bookings/availability", { cache: "no-store" })
        const json = (await response.json()) as { data?: BookingAvailability }
        if (!cancelled && json.data) {
          setAvailability(json.data)
        }
      } catch (error) {
        console.error("Failed to load booking availability:", error)
      } finally {
        if (!cancelled) {
          setIsLoadingAvailability(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const venueIsAbuja = useMemo(() => /abuja/i.test(q.venueNameAndAddress), [q.venueNameAndAddress])

  useEffect(() => {
    if (venueIsAbuja) {
      setQ((prev) => ({ ...prev, bandOption: "Ideal" }))
    }
  }, [venueIsAbuja])

  const disabledDays = useMemo(() => {
    const unavailable = [...availability.approvedDates, ...availability.blockedDates].map(fromDateKey)
    return [{ before: new Date() }, ...unavailable]
  }, [availability])

  const handleSelectDates = (dates: Date[] | undefined) => {
    const selected = (dates || []).sort((a, b) => a.getTime() - b.getTime())
    set("eventDates", selected.map(toDateKey))
  }

  const canContinue = useMemo(() => {
    switch (STEPS[stepIndex].id) {
      case "dates":
        return q.eventDates.length > 0
      case "event":
        return (
          !!contact.fullName.trim() &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) &&
          !!contact.phone.trim() &&
          !!q.eventNameAndPurpose.trim() &&
          !!q.programSchedule.trim() &&
          !!q.venueNameAndAddress.trim() &&
          !!q.primaryContact.trim() &&
          !!q.eventType &&
          (q.eventType !== "Other" || !!q.eventTypeOther.trim()) &&
          !!q.ministerRole &&
          (q.ministerRole !== "Other" || !!q.ministerRoleOther.trim())
        )
      case "music":
        return (
          !!q.soundSystem &&
          (q.soundSystem === "No" || !!q.soundSystemSpecs.trim()) &&
          !!q.soundEngineerContact.trim() &&
          !!q.bandOption &&
          !!q.localMusiciansDetails.trim() &&
          !!q.equipmentTransportHelp &&
          (q.equipmentTransportHelp === "No" || !!q.equipmentLogistics.trim()) &&
          !!q.rehearsalSoundcheck &&
          (q.rehearsalSoundcheck === "No" || !!q.rehearsalSchedule.trim()) &&
          !!q.soundEngineerAvailable &&
          !!q.secureStorage
        )
      case "travel":
        return (
          !!q.transportMode &&
          !!q.baggageFeesCovered &&
          !!q.pickupDropOff.trim() &&
          !!q.itineraryDeadline.trim() &&
          !!q.parking.trim() &&
          !!q.hotel.trim() &&
          !!q.alternativeAccommodation.trim() &&
          !!q.runningWater &&
          !!q.electricity &&
          !!q.wifiAccess
        )
      case "finance":
        return !!q.honorariumProvided && !!q.paymentMethod && !!q.cancellationPolicy.trim()
      case "ministration":
        return (
          !!q.requestedTopics.trim() &&
          !!q.stageTime.trim() &&
          !!q.ministrationDuration.trim() &&
          !!q.programOrder.trim()
        )
      case "media":
        return (
          !!q.recordedBroadcast &&
          (q.recordedBroadcast === "No" || !!q.recordingDetails.trim()) &&
          !!q.usageRights.trim() &&
          !!q.mediaCopies &&
          !!q.foodRefreshments.trim()
        )
      case "review":
        return true
    }
  }, [stepIndex, q, contact])

  const goNext = () => {
    setSubmitError(null)
    setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goBack = () => {
    setSubmitError(null)
    setStepIndex((prev) => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, questionnaire: q }),
      })
      const json = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(json.error || "Failed to submit booking.")
      }

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Failed to submit your booking. Please try again."))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return <SuccessScreen email={contact.email} dates={q.eventDates} />
  }

  const step = STEPS[stepIndex]
  const progress = Math.round((stepIndex / (STEPS.length - 1)) * 100)

  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Progress indicator inside the card */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="uppercase tracking-[0.18em] text-cyan-700">
                Step {stepIndex + 1} of {STEPS.length}
              </span>
              <span className="text-slate-500">{progress}% complete</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-700 to-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Compact step chips for navigation */}
            <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1">
              {STEPS.map((s, index) => {
                const isDone = index < stepIndex
                const isActive = index === stepIndex
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (index < stepIndex) {
                        setStepIndex(index)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    }}
                    title={s.title}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all sm:px-3 ${
                      isActive
                        ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/25"
                        : isDone
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {isDone ? <Check className="size-3" /> : <span>{index + 1}</span>}
                    <span className="hidden md:inline">{s.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{step.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{step.subtitle}</p>

          <div className="mt-6">
          {step.id === "dates" ? (
            <DatesStep
              availability={availability}
              isLoading={isLoadingAvailability}
              selectedKeys={q.eventDates}
              onSelect={handleSelectDates}
              disabledDays={disabledDays}
            />
          ) : null}

          {step.id === "event" ? (
            <EventStep contact={contact} setContact={setContact} q={q} set={set} />
          ) : null}

          {step.id === "music" ? (
            <MusicStep q={q} set={set} venueIsAbuja={venueIsAbuja} />
          ) : null}

          {step.id === "travel" ? <TravelStep q={q} set={set} /> : null}

          {step.id === "finance" ? <FinanceStep q={q} set={set} /> : null}

          {step.id === "ministration" ? <MinistrationStep q={q} set={set} /> : null}

          {step.id === "media" ? <MediaStep q={q} set={set} /> : null}

          {step.id === "review" ? (
            <ReviewStep contact={contact} q={q} />
          ) : null}

          {submitError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{submitError}</div>
          ) : null}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={stepIndex === 0 || isSubmitting}
              className="rounded-xl"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>

            {step.id === "review" ? (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-cyan-600 hover:bg-cyan-700"
              >
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                {isSubmitting ? "Submitting..." : "Submit Booking Request"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className="rounded-xl bg-cyan-600 hover:bg-cyan-700"
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function SuccessScreen({ email, dates }: { email: string; dates: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-lg"
    >
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
        <PartyPopper className="size-8 text-emerald-600" />
      </div>
      <h2 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">Request received!</h2>
      <p className="mt-3 text-slate-600">
        Thank you — your request{dates.length ? ` for ${dates.map(formatDateLabel).join(", ")}` : ""} has been submitted
        and is now <strong>pending approval</strong>.
      </p>
      <p className="mt-3 text-slate-600">
        A confirmation email has been sent to <strong>{email}</strong>. You will receive another email as soon as the
        ministry team approves your booking.
      </p>
    </motion.div>
  )
}
