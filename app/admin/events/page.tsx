"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/errors"
import type { EventRegistration } from "@/lib/db"

export default function AdminEventsPage() {
  const { toast } = useToast()
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number; total: number } | null>(null)

  useEffect(() => {
    const loadRegistrations = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/admin/events/spirit-spa", { cache: "no-store", credentials: "include" })
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
    }
    void loadRegistrations()
  }, [])

  const handleSendEmails = async () => {
    setIsSending(true)
    setSendResult(null)
    try {
      const response = await fetch("/api/admin/events/spirit-spa/send-email", {
        method: "POST",
        credentials: "include",
      })
      const data = (await response.json()) as { data?: { sent: number; failed: number; total: number }; error?: string }
      if (!response.ok) {
        throw new Error(data.error || "Failed to send emails.")
      }
      setSendResult(data.data || null)
      toast({
        title: "Emails sent",
        description: `${data.data?.sent || 0} of ${data.data?.total || 0} emails sent successfully.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Send failed",
        description: getErrorMessage(error, "Failed to send emails."),
      })
    } finally {
      setIsSending(false)
      setIsConfirmOpen(false)
    }
  }

  const sentCount = registrations.filter((r) => r.ticketSentAt).length

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Spirit Spa Registrations</h2>
            <p className="mt-2 text-sm text-slate-600">
              View registered attendees and send the Spirit Spa welcome email to all of them at once.
            </p>
          </div>
          <Button
            type="button"
            className="rounded-xl bg-slate-900"
            onClick={() => setIsConfirmOpen(true)}
            disabled={isLoading || registrations.length === 0 || isSending}
          >
            {isSending ? <Spinner className="size-4" /> : null}
            Send Welcome Emails
          </Button>
        </div>
      </div>

      {sendResult && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-semibold">Emails sent!</p>
          <p className="mt-1">
            {sendResult.sent} of {sendResult.total} emails sent successfully.
            {sendResult.failed > 0 ? ` ${sendResult.failed} failed.` : ""}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Registered Attendees</h3>
          <p className="text-sm text-slate-500">
            {registrations.length} total · {sentCount} emailed
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            <Spinner />
            Loading registrations...
          </div>
        ) : registrations.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No registrations yet.</p>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="mt-3 space-y-3 md:hidden">
              {registrations.map((reg) => (
                <div key={reg.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{reg.name}</p>
                      <p className="text-sm text-slate-500">{reg.email}</p>
                    </div>
                    {reg.ticketSentAt ? (
                      <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                        Emailed
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-800">Phone:</span> {reg.phone}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">Registered:</span>{" "}
                      {new Date(reg.createdAt).toLocaleString("en-NG")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="mt-3 hidden overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Phone</th>
                    <th className="py-2 pr-4 font-medium">Registered</th>
                    <th className="py-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-slate-100 text-slate-700">
                      <td className="py-2 pr-4 font-medium">{reg.name}</td>
                      <td className="py-2 pr-4">{reg.email}</td>
                      <td className="py-2 pr-4">{reg.phone}</td>
                      <td className="py-2 pr-4">{new Date(reg.createdAt).toLocaleString("en-NG")}</td>
                      <td className="py-2 text-right">
                        {reg.ticketSentAt ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                            Emailed
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={(open) => { if (!open) setIsConfirmOpen(false) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Welcome Emails?</DialogTitle>
            <DialogDescription>
              This will send the Spirit Spa welcome email to all {registrations.length} registered attendees. Each person
              will receive the email with event details (date, time, venue) and the dressing code reminder.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsConfirmOpen(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-slate-900"
              onClick={handleSendEmails}
              disabled={isSending}
            >
              {isSending ? <Spinner className="size-4" /> : null}
              {isSending ? "Sending..." : `Send to ${registrations.length} attendees`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
