"use client"

import { useCallback, useEffect, useState } from "react"
import { CalendarDays, CheckCircle2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/errors"
import type { BlockedBookingDate, MinistryBooking, MinistryBookingStatus } from "@/lib/types"
import { BookingDetail } from "@/components/admin-booking-detail"
import { BlockedDatesManager } from "@/components/admin-blocked-dates"

type StatusTab = "all" | MinistryBookingStatus

const TABS: { id: StatusTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
]

export default function AdminBookingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<StatusTab>("pending")
  const [bookings, setBookings] = useState<MinistryBooking[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedBookingDate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<MinistryBooking | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [adminNote, setAdminNote] = useState("")

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [bookingsResponse, blockedResponse] = await Promise.all([
        fetch("/api/admin/bookings", { credentials: "include", cache: "no-store" }),
        fetch("/api/admin/bookings/blocked-dates", { credentials: "include", cache: "no-store" }),
      ])

      const bookingsJson = (await bookingsResponse.json()) as { data?: MinistryBooking[]; error?: string }
      if (!bookingsResponse.ok) {
        throw new Error(bookingsJson.error || "Failed to load bookings.")
      }

      const blockedJson = (await blockedResponse.json()) as { data?: BlockedBookingDate[] }
      setBookings(bookingsJson.data || [])
      setBlockedDates(blockedJson.data || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Bookings unavailable",
        description: getErrorMessage(error, "Failed to load bookings."),
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const updateStatus = async (booking: MinistryBooking, status: MinistryBookingStatus) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status, adminNote }),
      })
      const json = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(json.error || "Failed to update booking.")
      }

      toast({
        title: status === "approved" ? "Booking approved" : "Booking rejected",
        description:
          status === "approved"
            ? `${booking.fullName} has been notified by email.`
            : `${booking.fullName} has been notified by email.`,
      })

      setSelectedBooking(null)
      setAdminNote("")
      await loadData()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: getErrorMessage(error, "Failed to update booking."),
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const statusCounts = bookings.reduce(
    (acc, booking) => {
      acc[booking.status] += 1
      return acc
    },
    { pending: 0, approved: 0, rejected: 0 },
  )

  const visibleBookings = activeTab === "all" ? bookings : bookings.filter((booking) => booking.status === activeTab)

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Ministry Bookings</h2>
            <p className="mt-1 text-sm text-slate-600">
              Review hosting requests, approve or reject them, and manage blocked dates.
            </p>
          </div>
          <BlockedDatesManager
            blockedDates={blockedDates}
            onChange={async () => {
              await loadData()
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              className="rounded-xl"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.id !== "all" ? (
                <span className="ml-1.5 rounded-full bg-black/10 px-1.5 text-xs">{statusCounts[tab.id]}</span>
              ) : null}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
          <Spinner />
          Loading bookings...
        </div>
      ) : visibleBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <CalendarDays className="mx-auto size-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No bookings found</p>
          <p className="mt-1 text-xs text-slate-500">New requests will appear here as they come in.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">{booking.fullName}</p>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  <strong>{booking.eventName}</strong> — {booking.eventType}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {booking.eventDates.length ? formatDates(booking.eventDates) : "No dates"} · {booking.venue}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => setSelectedBooking(booking)}>
                  View details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={selectedBooking !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBooking(null)
            setAdminNote("")
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          {selectedBooking ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Booking details
                  <StatusBadge status={selectedBooking.status} />
                </DialogTitle>
                <DialogDescription>
                  Submitted {new Date(selectedBooking.createdAt).toLocaleString("en-GB")} ·{" "}
                  {selectedBooking.reviewedAt ? `Reviewed by ${selectedBooking.reviewedBy || "admin"}` : "Not yet reviewed"}
                </DialogDescription>
              </DialogHeader>

              <BookingDetail booking={selectedBooking} />

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Admin note (sent to booker)</label>
                  <Input
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Optional note included in the email"
                    className="rounded-xl"
                  />
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-row">
                  {selectedBooking.status === "pending" ? (
                    <>
                      <Button
                        type="button"
                        variant="destructive"
                        className="rounded-xl"
                        disabled={isUpdating}
                        onClick={() => updateStatus(selectedBooking, "rejected")}
                      >
                        {isUpdating ? <Spinner className="size-4" /> : <XCircle className="size-4" />}
                        Reject
                      </Button>
                      <Button
                        type="button"
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                        disabled={isUpdating}
                        onClick={() => updateStatus(selectedBooking, "approved")}
                      >
                        {isUpdating ? <Spinner className="size-4" /> : <CheckCircle2 className="size-4" />}
                        Approve booking
                      </Button>
                    </>
                  ) : (
                    <Button type="button" variant="outline" className="rounded-xl" onClick={() => setSelectedBooking(null)}>
                      Close
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatusBadge({ status }: { status: MinistryBookingStatus }) {
  const styles: Record<MinistryBookingStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
  }
  return <Badge className={`${styles[status]} rounded-full`}>{status}</Badge>
}

function formatDates(dates: string[]) {
  return dates
    .map((date) => {
      const [year, month, day] = date.split("-").map(Number)
      return new Date(year, month - 1, day).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    })
    .join(", ")
}
