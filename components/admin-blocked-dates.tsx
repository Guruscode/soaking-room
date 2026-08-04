"use client"

import { useState } from "react"
import { Ban, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/errors"
import type { BlockedBookingDate } from "@/lib/types"

export function BlockedDatesManager({
  blockedDates,
  onChange,
}: {
  blockedDates: BlockedBookingDate[]
  onChange: () => Promise<void>
}) {
  const { toast } = useToast()
  const [date, setDate] = useState("")
  const [reason, setReason] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const addBlockedDate = async () => {
    if (!date) {
      toast({ variant: "destructive", title: "Date required", description: "Pick a date to block." })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/bookings/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ date, reason }),
      })
      const json = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(json.error || "Failed to block date.")
      }

      toast({ title: "Date blocked", description: "This date now shows as unavailable on the public calendar." })
      setDate("")
      setReason("")
      await onChange()
    } catch (error) {
      toast({ variant: "destructive", title: "Block failed", description: getErrorMessage(error, "Failed to block date.") })
    } finally {
      setIsSaving(false)
    }
  }

  const removeBlockedDate = async (blockedDate: string) => {
    try {
      const response = await fetch(
        `/api/admin/bookings/blocked-dates?date=${encodeURIComponent(blockedDate)}`,
        { method: "DELETE", credentials: "include" },
      )
      const json = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(json.error || "Failed to unblock date.")
      }

      toast({ title: "Date unblocked", description: "This date is available again." })
      await onChange()
    } catch (error) {
      toast({ variant: "destructive", title: "Unblock failed", description: getErrorMessage(error, "Failed to unblock date.") })
    }
  }

  return (
    <div className="w-full md:w-80">
      <Button type="button" variant="outline" size="sm" className="w-full rounded-xl" onClick={() => setIsOpen((prev) => !prev)}>
        <Ban className="size-4 text-red-500" />
        Blocked dates ({blockedDates.length})
      </Button>

      {isOpen ? (
        <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg" />
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason (optional)"
              className="rounded-lg"
            />
          </div>
          <Button type="button" size="sm" className="w-full rounded-lg bg-slate-900" disabled={isSaving} onClick={addBlockedDate}>
            <Plus className="size-4" />
            Block this date
          </Button>

          {blockedDates.length > 0 ? (
            <div className="max-h-40 space-y-1.5 overflow-y-auto">
              {blockedDates.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
                  <div>
                    <p className="font-medium text-slate-800">{formatBlockedDate(item.date)}</p>
                    {item.reason ? <p className="text-slate-500">{item.reason}</p> : null}
                  </div>
                  <button type="button" onClick={() => removeBlockedDate(item.date)} className="rounded-full p-1 text-slate-400 hover:bg-red-50 hover:text-red-600">
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-slate-500">No blocked dates.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}

function formatBlockedDate(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
}
