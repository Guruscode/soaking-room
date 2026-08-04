"use client"

import { CalendarDays, Check, Info, Lock, X } from "lucide-react"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { BookingAvailability, MinistryQuestionnaire } from "@/lib/types"
import type { QuestionnaireSetter } from "@/components/booking-wizard-shared"
import { formatDateLabel, toDateKey } from "@/components/booking-wizard-shared"
import type { DayButtonProps } from "react-day-picker"

// ---------- Shared small fields ----------

export function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-800">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: string
  hint?: string
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="rounded-xl" />
    </Field>
  )
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required,
  rows = 3,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
  hint?: string
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="rounded-xl" />
    </Field>
  )
}

export function OptionGroup({
  label,
  value,
  onChange,
  options,
  required,
  hint,
  locked,
  columns = 1,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  required?: boolean
  hint?: string
  locked?: boolean
  columns?: 1 | 2
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <div className={cn("grid gap-2", columns === 2 && "sm:grid-cols-2")}>
        {options.map((option) => {
          const isLocked = locked && option !== value
          const isSelected = option === value
          return (
            <button
              key={option}
              type="button"
              disabled={isLocked}
              onClick={() => onChange(option)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all",
                isSelected
                  ? "border-cyan-600 bg-cyan-50 text-cyan-900 ring-1 ring-cyan-600"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                isLocked && "cursor-not-allowed opacity-40",
              )}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border",
                  isSelected ? "border-cyan-600 bg-cyan-600" : "border-slate-300",
                )}
              >
                {isSelected ? <span className="size-1.5 rounded-full bg-white" /> : null}
              </span>
              {option}
            </button>
          )
        })}
      </div>
    </Field>
  )
}

function SectionCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
      <h3 className="mb-4 text-base font-semibold text-slate-900">
        <span className="mr-2 inline-flex items-center justify-center rounded-lg bg-cyan-600 px-2 py-0.5 text-xs font-bold text-white">{number}</span>
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// ---------- Dates step ----------

function BookingDayButton({ modifiers, day, ...props }: DayButtonProps) {
  const status = modifiers.booked
    ? "already booked — unavailable"
    : modifiers.blocked
      ? "blocked — unavailable"
      : modifiers.pending
        ? "pending request — may still be available"
        : modifiers.disabled
          ? "not available"
          : "available"

  const statusTitle = `${day.date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} — ${status}`
  const ariaLabel = `${statusTitle}${modifiers.selected ? ", selected" : ""}`

  return <CalendarDayButton {...props} modifiers={modifiers} day={day} title={statusTitle} aria-label={ariaLabel} />
}

export function DatesStep({
  availability,
  isLoading,
  selectedKeys,
  onSelect,
  disabledDays,
}: {
  availability: BookingAvailability
  isLoading: boolean
  selectedKeys: string[]
  onSelect: (dates: Date[] | undefined) => void
  disabledDays: (Date | { before: Date })[]
}) {
  const selectedDates = selectedKeys.map((key) => {
    const [year, month, day] = key.split("-").map(Number)
    return new Date(year, month - 1, day)
  })

  const clearAll = () => onSelect([])

  const bookedDates = availability.approvedDates.map((key) => {
    const [y, m, d] = key.split("-").map(Number)
    return new Date(y, m - 1, d)
  })
  const blockedDates = availability.blockedDates.map((key) => {
    const [y, m, d] = key.split("-").map(Number)
    return new Date(y, m - 1, d)
  })
  const pendingDates = availability.pendingDates.map((key) => {
    const [y, m, d] = key.split("-").map(Number)
    return new Date(y, m - 1, d)
  })

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 py-12 text-sm text-slate-500">
          Loading calendar...
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-center">
          {/* Calendar card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={onSelect}
              disabled={disabledDays}
              components={{ DayButton: BookingDayButton }}
              modifiers={{
                booked: bookedDates,
                blocked: blockedDates,
                pending: pendingDates,
              }}
              modifiersClassNames={{
                booked: "rdp-booking-booked",
                blocked: "rdp-booking-blocked",
                pending: "rdp-booking-pending",
                selected: "rdp-booking-selected",
              }}
            />

            {/* Legend under the calendar */}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-500" /> Booked
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-slate-400" /> Blocked
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-amber-400" /> Pending
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-3 items-center justify-center rounded-full bg-cyan-600">
                  <Check className="size-2 text-white" />
                </span>
                Selected
              </div>
            </div>
          </div>

          {/* Selection panel */}
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <CalendarDays className="size-4 text-cyan-700" />
                {selectedKeys.length === 0
                  ? "No dates selected yet"
                  : `${selectedKeys.length} date${selectedKeys.length > 1 ? "s" : ""} selected`}
              </h3>
              {selectedKeys.length > 0 ? (
                <button
                  type="button"
                  onClick={clearAll}
                  className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <X className="size-3" />
                  Clear all
                </button>
              ) : null}
            </div>

            <div className="mt-3 space-y-2">
              {selectedKeys.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center">
                  <p className="text-sm text-slate-500">
                    Pick one or more dates on the calendar — multi-day events (conferences, revivals) are welcome.
                  </p>
                  <p className="mt-2 text-xs text-slate-400">Hover a date to see its availability status.</p>
                </div>
              ) : (
                selectedKeys.map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-xl border border-cyan-200 bg-cyan-50 px-3.5 py-2.5 text-sm text-cyan-900"
                  >
                    <span className="flex items-center gap-2">
                      <Check className="size-3.5 text-cyan-600" />
                      {formatDateLabel(key)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelect(selectedDates.filter((d) => toDateKey(d) !== key))}
                      className="rounded-full px-2 py-0.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {availability.pendingDates.length > 0 ? (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <Info className="mr-1 inline size-3.5" />
                Dates marked amber have pending requests and may still be available while under review.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Event overview step ----------

export function EventStep({
  contact,
  setContact,
  q,
  set,
}: {
  contact: { fullName: string; email: string; phone: string }
  setContact: React.Dispatch<React.SetStateAction<{ fullName: string; email: string; phone: string }>>
  q: MinistryQuestionnaire
  set: QuestionnaireSetter
}) {
  return (
    <div className="space-y-4">
      <SectionCard number="1.0" title="Your contact details">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Full name" required value={contact.fullName} onChange={(v) => setContact((prev) => ({ ...prev, fullName: v }))} placeholder="Your name" />
          <TextField label="Email" required type="email" value={contact.email} onChange={(v) => setContact((prev) => ({ ...prev, email: v }))} placeholder="you@example.com" />
          <div className="sm:col-span-2">
            <TextField label="Phone number" required value={contact.phone} onChange={(v) => setContact((prev) => ({ ...prev, phone: v }))} placeholder="+234..." />
          </div>
        </div>
      </SectionCard>

      <SectionCard number="1" title="Event overview">
        <TextAreaField
          label="Event name and purpose"
          required
          value={q.eventNameAndPurpose}
          onChange={(v) => set("eventNameAndPurpose", v)}
          placeholder="e.g. Sunday worship service, annual conference..."
          rows={2}
        />
        <TextAreaField
          label="Program schedule (please attach itinerary if available)"
          required
          value={q.programSchedule}
          onChange={(v) => set("programSchedule", v)}
          placeholder="Briefly describe the program flow for the day(s)."
          rows={3}
        />
        <TextAreaField
          label="Venue name and full address"
          required
          value={q.venueNameAndAddress}
          onChange={(v) => set("venueNameAndAddress", v)}
          placeholder="Church / hall name and full address"
          rows={2}
        />
        <TextField
          label="Primary contact person (name)"
          required
          value={q.primaryContact}
          onChange={(v) => set("primaryContact", v)}
          placeholder="Who should the team coordinate with?"
        />
        <OptionGroup
          label="Type of event"
          required
          value={q.eventType}
          onChange={(v) => set("eventType", v)}
          options={["Worship Service", "Conference", "Revival", "Other"]}
        />
        {q.eventType === "Other" ? (
          <TextField label="Please specify event type" required value={q.eventTypeOther} onChange={(v) => set("eventTypeOther", v)} placeholder="Describe the event type" />
        ) : null}
        <OptionGroup
          label="Minister Moses Akoh's role"
          required
          value={q.ministerRole}
          onChange={(v) => set("ministerRole", v)}
          options={["Worship Leader", "Speaker", "Other"]}
        />
        {q.ministerRole === "Other" ? (
          <TextField label="Please specify role" required value={q.ministerRoleOther} onChange={(v) => set("ministerRoleOther", v)} placeholder="Describe the role" />
        ) : null}
      </SectionCard>
    </div>
  )
}

// ---------- Musical & technical step ----------

const BAND_OPTIONS = ["Ideal (Full band of 10 members)", "Alternative 1 (6 team members)", "Alternative 2 (5 team members)", "Minimal (4 team members)"]

export function MusicStep({
  q,
  set,
  venueIsAbuja,
}: {
  q: MinistryQuestionnaire
  set: QuestionnaireSetter
  venueIsAbuja: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-semibold">Technical rider</p>
        <p className="mt-1">16-channel digital mixer • At least 2 keyboards • Quality PA system with subwoofers • 5 in-ear monitor mixes • 2 wireless microphones (e.g., Shure KSM8).</p>
      </div>

      <SectionCard number="3.1" title="Sound system">
        <OptionGroup
          label="Can you provide a professional sound system for live worship?"
          required
          value={q.soundSystem}
          onChange={(v) => set("soundSystem", v)}
          options={["Yes", "No"]}
        />
        {q.soundSystem === "Yes" ? (
          <TextAreaField
            label="Please share specifications (e.g., PA system, mixer channels, monitors)"
            required
            value={q.soundSystemSpecs}
            onChange={(v) => set("soundSystemSpecs", v)}
            rows={2}
          />
        ) : null}
        <TextField
          label="Sound engineer contact (name, phone, email)"
          required
          value={q.soundEngineerContact}
          onChange={(v) => set("soundEngineerContact", v)}
        />
      </SectionCard>

      <SectionCard number="3.3" title="Musical team options">
        <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <Lock className="mr-1 inline size-3.5" />
          Note: Bookings within <strong>Abuja</strong> must be with the full band (Ideal option) and can't be compromised.
        </div>
        <OptionGroup
          label="Select your option and the number of team members (excluding Minister Moses Akoh)"
          required
          value={q.bandOption}
          onChange={(v) => set("bandOption", v)}
          options={BAND_OPTIONS}
          locked={venueIsAbuja}
        />
        {venueIsAbuja ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <Lock className="size-4" />
            A venue in Abuja was detected, so the full band option is locked in for you.
          </div>
        ) : null}
        <TextAreaField
          label="If using local musicians, please provide details (e.g., experience, rehearsal plan)"
          required
          value={q.localMusiciansDetails}
          onChange={(v) => set("localMusiciansDetails", v)}
          rows={2}
        />
        <TextField
          label="Additional needs (e.g., AUX keyboard)"
          value={q.additionalMusicalNeeds}
          onChange={(v) => set("additionalMusicalNeeds", v)}
          placeholder="Optional"
        />
      </SectionCard>

      <SectionCard number="3.4" title="Musical equipment">
        <p className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
          Minister Moses brings a 23 kg equipment box: SE microphone, pedal boards (Strymon Cloudburst, TC Helicon VoiceLive 3), Radial Voco-Loco, and cables (XLR, 1/4&quot; TRS).
        </p>
        <OptionGroup
          label="Can you assist with transporting, setting up, and tearing down this equipment?"
          required
          value={q.equipmentTransportHelp}
          onChange={(v) => set("equipmentTransportHelp", v)}
          options={["Yes", "No"]}
        />
        {q.equipmentTransportHelp === "Yes" ? (
          <TextAreaField
            label="Please share logistics (e.g., crew, loading area)"
            required
            value={q.equipmentLogistics}
            onChange={(v) => set("equipmentLogistics", v)}
            rows={2}
          />
        ) : null}
      </SectionCard>

      <SectionCard number="3.5" title="Rehearsal and soundcheck">
        <OptionGroup
          label="Can you provide a rehearsal and soundcheck time (ideally 2 hours)?"
          required
          value={q.rehearsalSoundcheck}
          onChange={(v) => set("rehearsalSoundcheck", v)}
          options={["Yes", "No"]}
        />
        {q.rehearsalSoundcheck === "Yes" ? (
          <TextField label="Please confirm the schedule" required value={q.rehearsalSchedule} onChange={(v) => set("rehearsalSchedule", v)} />
        ) : null}
        <OptionGroup
          label="Will a qualified sound engineer be available?"
          required
          value={q.soundEngineerAvailable}
          onChange={(v) => set("soundEngineerAvailable", v)}
          options={["Yes", "No", "Maybe"]}
        />
      </SectionCard>

      <SectionCard number="3.6" title="Team support">
        <OptionGroup
          label="Can you provide a secure storage area for equipment?"
          required
          value={q.secureStorage}
          onChange={(v) => set("secureStorage", v)}
          options={["Yes", "No"]}
        />
      </SectionCard>
    </div>
  )
}

// ---------- Travel & accommodation step ----------

export function TravelStep({ q, set }: { q: MinistryQuestionnaire; set: QuestionnaireSetter }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-semibold">Travel preferences</p>
        <p className="mt-1">Domestic flights: Business class (Ibom Air if available). International flights over 4 hours: Premium Economy or Business preferred.</p>
      </div>

      <SectionCard number="4" title="Travel and transportation">
        <OptionGroup
          label="Mode of transportation"
          required
          value={q.transportMode}
          onChange={(v) => set("transportMode", v)}
          options={["Land", "Air", "Other"]}
        />
        <OptionGroup
          label="Will baggage fees for the 23 kg equipment box be covered?"
          required
          value={q.baggageFeesCovered}
          onChange={(v) => set("baggageFeesCovered", v)}
          options={["Yes", "No"]}
        />
        <TextAreaField
          label="Pickup and drop-off details (times, locations)"
          required
          value={q.pickupDropOff}
          onChange={(v) => set("pickupDropOff", v)}
          rows={2}
        />
        <TextField
          label="Travel itinerary confirmation deadline"
          required
          value={q.itineraryDeadline}
          onChange={(v) => set("itineraryDeadline", v)}
          placeholder="e.g. 3 weeks before the event"
        />
        <TextAreaField
          label="Parking or vehicle access for team"
          required
          value={q.parking}
          onChange={(v) => set("parking", v)}
          rows={2}
        />
      </SectionCard>

      <SectionCard number="5" title="Accommodation">
        <TextField
          label="Hotel (name, address, star rating, booking details)"
          required
          value={q.hotel}
          onChange={(v) => set("hotel", v)}
        />
        <TextField
          label="Alternative (e.g., Airbnb, address, host contact)"
          required
          value={q.alternativeAccommodation}
          onChange={(v) => set("alternativeAccommodation", v)}
        />
        <OptionGroup
          label="Running water"
          required
          value={q.runningWater}
          onChange={(v) => set("runningWater", v)}
          options={["Yes", "No"]}
        />
        <OptionGroup
          label="Electricity"
          required
          value={q.electricity}
          onChange={(v) => set("electricity", v)}
          options={["Yes", "No"]}
        />
        <OptionGroup
          label="Wi-Fi access"
          required
          value={q.wifiAccess}
          onChange={(v) => set("wifiAccess", v)}
          options={["Yes", "No"]}
        />
        <TextAreaField
          label="Dietary preferences (e.g., no spicy foods, allergies)"
          value={q.dietaryPreferences}
          onChange={(v) => set("dietaryPreferences", v)}
          rows={2}
        />
      </SectionCard>
    </div>
  )
}

// ---------- Financial step ----------

export function FinanceStep({ q, set }: { q: MinistryQuestionnaire; set: QuestionnaireSetter }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-semibold">Financial arrangement</p>
        <p className="mt-1">
          As a missionary, Minister Moses Akoh serves without specifying an honorarium, trusting God's provision through your
          generosity. Any honorarium should be given <strong>after</strong> ministrations, not before.
        </p>
      </div>

      <SectionCard number="6" title="Financial arrangements">
        <OptionGroup
          label="Will an honorarium be provided? (If yes, it should be after ministrations, not before.)"
          required
          value={q.honorariumProvided}
          onChange={(v) => set("honorariumProvided", v)}
          options={["Yes", "No"]}
        />
        <OptionGroup
          label="Payment method for any agreed expenses"
          required
          value={q.paymentMethod}
          onChange={(v) => set("paymentMethod", v)}
          options={["Bank Transfer", "Cash", "Other"]}
        />
        <TextAreaField
          label="Cancellation policy (terms for cancellation by either party)"
          required
          value={q.cancellationPolicy}
          onChange={(v) => set("cancellationPolicy", v)}
          rows={3}
        />
      </SectionCard>
    </div>
  )
}

// ---------- Ministration step ----------

export function MinistrationStep({ q, set }: { q: MinistryQuestionnaire; set: QuestionnaireSetter }) {
  return (
    <div className="space-y-4">
      <SectionCard number="7" title="Ministration details">
        <TextAreaField
          label="Requested topics or themes"
          required
          value={q.requestedTopics}
          onChange={(v) => set("requestedTopics", v)}
          rows={3}
        />
        <TextField
          label="Time for Minister Moses to take the stage"
          required
          value={q.stageTime}
          onChange={(v) => set("stageTime", v)}
          placeholder="e.g. 10:00 AM"
        />
        <TextField
          label="Duration of ministration"
          required
          value={q.ministrationDuration}
          onChange={(v) => set("ministrationDuration", v)}
          placeholder="e.g. 1 hour 30 minutes"
        />
        <TextAreaField
          label="Program order (e.g., Minister Moses' slot)"
          required
          value={q.programOrder}
          onChange={(v) => set("programOrder", v)}
          rows={3}
        />
      </SectionCard>
    </div>
  )
}

// ---------- Media & welfare step ----------

export function MediaStep({ q, set }: { q: MinistryQuestionnaire; set: QuestionnaireSetter }) {
  return (
    <div className="space-y-4">
      <SectionCard number="8" title="Intellectual property">
        <OptionGroup
          label="Will the event be recorded or broadcast (e.g., live stream)?"
          required
          value={q.recordedBroadcast}
          onChange={(v) => set("recordedBroadcast", v)}
          options={["Yes", "No"]}
        />
        {q.recordedBroadcast === "Yes" ? (
          <TextAreaField
            label="Please provide details"
            required
            value={q.recordingDetails}
            onChange={(v) => set("recordingDetails", v)}
            rows={2}
          />
        ) : null}
        <TextAreaField
          label="Usage rights for recordings (e.g., editing, distribution)"
          required
          value={q.usageRights}
          onChange={(v) => set("usageRights", v)}
          rows={2}
        />
        <OptionGroup
          label="Will Minister Moses receive copies of event media?"
          required
          value={q.mediaCopies}
          onChange={(v) => set("mediaCopies", v)}
          options={["Yes", "No"]}
        />
      </SectionCard>

      <SectionCard number="9" title="Welfare and team support">
        <TextAreaField
          label="Food and refreshments (meal times, options)"
          required
          value={q.foodRefreshments}
          onChange={(v) => set("foodRefreshments", v)}
          rows={2}
        />
        <TextAreaField
          label="Additional needs (e.g., rest area, prayer room)"
          value={q.additionalNeeds}
          onChange={(v) => set("additionalNeeds", v)}
          rows={2}
        />
      </SectionCard>
    </div>
  )
}

// ---------- Review step ----------

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="border-b border-slate-100 py-2 last:border-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="text-sm text-slate-800">{value}</p>
    </div>
  )
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-cyan-800">{title}</h3>
      {children}
    </div>
  )
}

export function ReviewStep({
  contact,
  q,
}: {
  contact: { fullName: string; email: string; phone: string }
  q: MinistryQuestionnaire
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <CheckCircle2Icon />
        Everything looks good? Review your details below, then submit. You'll receive a confirmation email and the team will
        follow up after approval.
      </div>

      <ReviewSection title="Contact">
        <ReviewRow label="Name" value={contact.fullName} />
        <ReviewRow label="Email" value={contact.email} />
        <ReviewRow label="Phone" value={contact.phone} />
      </ReviewSection>

      <ReviewSection title="Dates">
        {q.eventDates.length ? (
          <ReviewRow label="Selected date(s)" value={q.eventDates.map(formatDateLabel).join(", ")} />
        ) : (
          <p className="text-sm text-red-600">No dates selected.</p>
        )}
      </ReviewSection>

      <ReviewSection title="Event overview">
        <ReviewRow label="Event name & purpose" value={q.eventNameAndPurpose} />
        <ReviewRow label="Program schedule" value={q.programSchedule} />
        <ReviewRow label="Venue" value={q.venueNameAndAddress} />
        <ReviewRow label="Primary contact" value={q.primaryContact} />
        <ReviewRow label="Event type" value={q.eventType === "Other" ? q.eventTypeOther : q.eventType} />
        <ReviewRow label="Minister's role" value={q.ministerRole === "Other" ? q.ministerRoleOther : q.ministerRole} />
      </ReviewSection>

      <ReviewSection title="Musical & technical">
        <ReviewRow label="Sound system" value={q.soundSystem === "Yes" ? `Yes — ${q.soundSystemSpecs}` : q.soundSystem} />
        <ReviewRow label="Sound engineer" value={q.soundEngineerContact} />
        <ReviewRow label="Band option" value={q.bandOption} />
        <ReviewRow label="Local musicians" value={q.localMusiciansDetails} />
        <ReviewRow label="Additional musical needs" value={q.additionalMusicalNeeds} />
        <ReviewRow label="Equipment transport" value={q.equipmentTransportHelp === "Yes" ? `Yes — ${q.equipmentLogistics}` : q.equipmentTransportHelp} />
        <ReviewRow label="Rehearsal & soundcheck" value={q.rehearsalSoundcheck === "Yes" ? `Yes — ${q.rehearsalSchedule}` : q.rehearsalSoundcheck} />
        <ReviewRow label="Sound engineer available" value={q.soundEngineerAvailable} />
        <ReviewRow label="Secure storage" value={q.secureStorage} />
      </ReviewSection>

      <ReviewSection title="Travel & accommodation">
        <ReviewRow label="Transport mode" value={q.transportMode} />
        <ReviewRow label="Baggage fees covered" value={q.baggageFeesCovered} />
        <ReviewRow label="Pickup & drop-off" value={q.pickupDropOff} />
        <ReviewRow label="Itinerary deadline" value={q.itineraryDeadline} />
        <ReviewRow label="Parking" value={q.parking} />
        <ReviewRow label="Hotel" value={q.hotel} />
        <ReviewRow label="Alternative lodging" value={q.alternativeAccommodation} />
        <ReviewRow label="Amenities" value={`Water: ${q.runningWater || "—"} • Electricity: ${q.electricity || "—"} • Wi-Fi: ${q.wifiAccess || "—"}`} />
      </ReviewSection>

      <ReviewSection title="Financial & ministration">
        <ReviewRow label="Honorarium" value={q.honorariumProvided} />
        <ReviewRow label="Payment method" value={q.paymentMethod} />
        <ReviewRow label="Cancellation policy" value={q.cancellationPolicy} />
        <ReviewRow label="Topics/themes" value={q.requestedTopics} />
        <ReviewRow label="Stage time" value={q.stageTime} />
        <ReviewRow label="Duration" value={q.ministrationDuration} />
        <ReviewRow label="Program order" value={q.programOrder} />
      </ReviewSection>

      <ReviewSection title="Media & welfare">
        <ReviewRow label="Recorded/broadcast" value={q.recordedBroadcast === "Yes" ? `Yes — ${q.recordingDetails}` : q.recordedBroadcast} />
        <ReviewRow label="Usage rights" value={q.usageRights} />
        <ReviewRow label="Media copies" value={q.mediaCopies} />
        <ReviewRow label="Food & refreshments" value={q.foodRefreshments} />
        <ReviewRow label="Additional needs" value={q.additionalNeeds} />
      </ReviewSection>
    </div>
  )
}

function CheckCircle2Icon() {
  return (
    <svg className="mr-1 inline size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </svg>
  )
}

