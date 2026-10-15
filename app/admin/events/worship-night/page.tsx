"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/errors"
import type { EventRegistration } from "@/lib/db"

export default function WorshipNightRegistrationsPage() {
  const { toast } = useToast()
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadRegistrations = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/events/worship-night", {
        cache: "no-store",
        credentials: "include",
      })
      const data = (await response.json()) as { data?: EventRegistration[]; error?: string }
      if (!response.ok) {
        throw new Error(data.error || "Failed to load registrations.")
      }
      setRegistrations(data.data || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Load failed",
        description: getErrorMessage(error, "Failed to load registrations."),
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void loadRegistrations()
  }, [loadRegistrations])

  const emailedCount = registrations.filter((registration) => registration.ticketSentAt).length

  return (
    <div className="space-y-5">
      <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" />
        All event registrations
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Event registrations</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">Worship Night with Moses Akoh</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <CalendarDays className="h-4 w-4" />
              Sunday, 29 November 2026 · 4:00 PM WAT
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <Users className="h-5 w-5 text-amber-700" />
            <div>
              <p className="text-lg font-semibold text-slate-900">{registrations.length}</p>
              <p className="text-xs text-slate-500">{emailedCount} tickets emailed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Registered attendees</h2>
            <p className="mt-1 text-sm text-slate-500">Ticket email status is shown for each registration.</p>
          </div>
          <Button type="button" variant="outline" onClick={() => void loadRegistrations()} disabled={isLoading}>
            Refresh list
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-6 text-sm text-slate-600">
            <Spinner />
            Loading registrations...
          </div>
        ) : registrations.length === 0 ? (
          <p className="mt-5 rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No registrations yet.
          </p>
        ) : (
          <>
            <div className="mt-5 space-y-3 md:hidden">
              {registrations.map((registration) => (
                <article key={registration.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{registration.name}</p>
                      <a href={`mailto:${registration.email}`} className="break-all text-sm text-slate-500">
                        {registration.email}
                      </a>
                    </div>
                    <TicketStatus sent={Boolean(registration.ticketSentAt)} />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">Phone: {registration.phone}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Registered {new Date(registration.createdAt).toLocaleString("en-NG")}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-5 hidden overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 pr-4 font-medium">Name</th>
                    <th className="py-3 pr-4 font-medium">Email</th>
                    <th className="py-3 pr-4 font-medium">Phone</th>
                    <th className="py-3 pr-4 font-medium">Registered</th>
                    <th className="py-3 text-right font-medium">Ticket</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="border-b border-slate-100 text-slate-700">
                      <td className="py-3 pr-4 font-medium">{registration.name}</td>
                      <td className="py-3 pr-4">
                        <a href={`mailto:${registration.email}`} className="hover:text-slate-950 hover:underline">
                          {registration.email}
                        </a>
                      </td>
                      <td className="py-3 pr-4">{registration.phone}</td>
                      <td className="py-3 pr-4">{new Date(registration.createdAt).toLocaleString("en-NG")}</td>
                      <td className="py-3 text-right"><TicketStatus sent={Boolean(registration.ticketSentAt)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function TicketStatus({ sent }: { sent: boolean }) {
  return sent ? (
    <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">Emailed</span>
  ) : (
    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">Pending</span>
  )
}
