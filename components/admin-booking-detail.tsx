"use client"

import type { MinistryBooking } from "@/lib/types"

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="border-b border-slate-100 py-2 last:border-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="whitespace-pre-wrap text-sm text-slate-800">{value}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-cyan-800">{title}</h3>
      {children}
    </div>
  )
}

export function BookingDetail({ booking }: { booking: MinistryBooking }) {
  const q = booking.questionnaire

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <Row label="Booker" value={booking.fullName} />
        <Row label="Email" value={booking.email} />
        <Row label="Phone" value={booking.phone} />
        <Row label="Submitted" value={new Date(booking.createdAt).toLocaleString("en-GB")} />
        {booking.adminNote ? <Row label="Admin note" value={booking.adminNote} /> : null}
      </div>

      <Section title="Dates">
        {booking.eventDates.length
          ? booking.eventDates.map((date) => <Row key={date} label="Date" value={formatDate(date)} />)
          : <p className="text-sm text-slate-500">No dates selected.</p>}
      </Section>

      <Section title="Event overview">
        <Row label="Event name & purpose" value={q.eventNameAndPurpose} />
        <Row label="Program schedule" value={q.programSchedule} />
        <Row label="Venue" value={q.venueNameAndAddress} />
        <Row label="Primary contact" value={q.primaryContact} />
        <Row label="Event type" value={q.eventType === "Other" ? q.eventTypeOther : q.eventType} />
        <Row label="Minister's role" value={q.ministerRole === "Other" ? q.ministerRoleOther : q.ministerRole} />
      </Section>

      <Section title="Musical & technical">
        <Row label="Sound system" value={q.soundSystem === "Yes" ? `Yes — ${q.soundSystemSpecs}` : q.soundSystem} />
        <Row label="Sound engineer contact" value={q.soundEngineerContact} />
        <Row label="Band option" value={q.bandOption} />
        <Row label="Additional musical needs" value={q.additionalMusicalNeeds} />
        <Row label="Local musicians" value={q.localMusiciansDetails} />
        <Row label="Equipment transport" value={q.equipmentTransportHelp === "Yes" ? `Yes — ${q.equipmentLogistics}` : q.equipmentTransportHelp} />
        <Row label="Rehearsal & soundcheck" value={q.rehearsalSoundcheck === "Yes" ? `Yes — ${q.rehearsalSchedule}` : q.rehearsalSoundcheck} />
        <Row label="Sound engineer available" value={q.soundEngineerAvailable} />
        <Row label="Secure storage" value={q.secureStorage} />
      </Section>

      <Section title="Travel & transportation">
        <Row label="Transport mode" value={q.transportMode} />
        <Row label="Baggage fees covered" value={q.baggageFeesCovered} />
        <Row label="Pickup & drop-off" value={q.pickupDropOff} />
        <Row label="Itinerary deadline" value={q.itineraryDeadline} />
        <Row label="Parking" value={q.parking} />
      </Section>

      <Section title="Accommodation">
        <Row label="Hotel" value={q.hotel} />
        <Row label="Alternative" value={q.alternativeAccommodation} />
        <Row label="Running water" value={q.runningWater} />
        <Row label="Electricity" value={q.electricity} />
        <Row label="Wi-Fi" value={q.wifiAccess} />
        <Row label="Dietary preferences" value={q.dietaryPreferences} />
      </Section>

      <Section title="Financial arrangements">
        <Row label="Honorarium" value={q.honorariumProvided} />
        <Row label="Payment method" value={q.paymentMethod} />
        <Row label="Cancellation policy" value={q.cancellationPolicy} />
      </Section>

      <Section title="Ministration details">
        <Row label="Topics/themes" value={q.requestedTopics} />
        <Row label="Stage time" value={q.stageTime} />
        <Row label="Duration" value={q.ministrationDuration} />
        <Row label="Program order" value={q.programOrder} />
      </Section>

      <Section title="Intellectual property">
        <Row label="Recorded/broadcast" value={q.recordedBroadcast === "Yes" ? `Yes — ${q.recordingDetails}` : q.recordedBroadcast} />
        <Row label="Usage rights" value={q.usageRights} />
        <Row label="Media copies" value={q.mediaCopies} />
      </Section>

      <Section title="Welfare & team support">
        <Row label="Food & refreshments" value={q.foodRefreshments} />
        <Row label="Additional needs" value={q.additionalNeeds} />
      </Section>
    </div>
  )
}
