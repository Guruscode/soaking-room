"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { BROADCAST_AUDIENCE_OPTIONS } from "@/lib/academy-options"
import { getErrorMessage } from "@/lib/errors"
import type { BroadcastItem, BroadcastPayload, ClassMode } from "@/lib/types"

const initialFormState: BroadcastPayload = {
  title: "",
  message: "",
  audience: "All Students",
  className: "",
  classStartAt: "",
  classEndAt: "",
  classMode: "online",
  meetingLink: "",
  venue: "",
}

export default function AdminBroadcastsPage() {
  const { toast } = useToast()
  const [rows, setRows] = useState<BroadcastItem[]>([])
  const [formState, setFormState] = useState(initialFormState)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const isOnlineMode = (formState.classMode || "online") === "online"

  useEffect(() => {
    const loadRows = async () => {
      setIsLoading(true)

      try {
        const response = await fetch("/api/admin/broadcasts", { cache: "no-store", credentials: "include" })
        const data = (await response.json()) as { data?: BroadcastItem[]; error?: string }

        if (!response.ok) {
          throw new Error(data.error || "Failed to load broadcasts.")
        }

        setRows(data.data || [])
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Broadcasts unavailable",
          description: getErrorMessage(error, "Failed to load broadcasts."),
        })
      } finally {
        setIsLoading(false)
      }
    }

    void loadRows()
  }, [])

  const resetForm = () => {
    setFormState(initialFormState)
    setEditingId(null)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(editingId ? `/api/admin/broadcasts/${editingId}` : "/api/admin/broadcasts", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formState),
      })
      const data = (await response.json()) as { data?: BroadcastItem; error?: string }

      if (!response.ok || !data.data) {
        throw new Error(data.error || "Failed to save broadcast.")
      }

      setRows((prev) => (editingId ? prev.map((row) => (row.id === editingId ? data.data! : row)) : [data.data!, ...prev]))
      toast({
        title: editingId ? "Broadcast updated" : "Broadcast created",
        description: `${data.data.title} has been saved and synced to student notifications.`,
      })
      resetForm()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: getErrorMessage(error, "Failed to save broadcast."),
      })
    } finally {
      setIsSaving(false)
    }
  }

  const onEdit = (item: BroadcastItem) => {
    setEditingId(item.id)
    setFormState({
      title: item.title,
      message: item.message,
      audience: item.audience,
      className: item.className || "",
      classStartAt: item.classStartAt || "",
      classEndAt: item.classEndAt || "",
      classMode: item.classMode || "online",
      meetingLink: item.meetingLink || "",
      venue: item.venue || "",
    })
  }

  const onDelete = async (item: BroadcastItem) => {
    try {
      const response = await fetch(`/api/admin/broadcasts/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete broadcast.")
      }

      setRows((prev) => prev.filter((row) => row.id !== item.id))
      toast({
        title: "Broadcast deleted",
        description: `${item.title} and its notifications have been removed.`,
      })
      if (editingId === item.id) resetForm()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: getErrorMessage(error, "Failed to delete broadcast."),
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-2xl font-semibold">Broadcast CMS</h2>
        <p className="mt-2 text-sm text-slate-600">Create announcements and upcoming class notices that flow into student notifications and next class.</p>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <Input value={formState.title} onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Audience</label>
            <select
              value={formState.audience}
              onChange={(event) => setFormState((prev) => ({ ...prev, audience: event.target.value }))}
              required
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
            >
              {BROADCAST_AUDIENCE_OPTIONS.map((audience) => (
                <option key={audience} value={audience}>
                  {audience}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
            <Textarea rows={4} value={formState.message} onChange={(event) => setFormState((prev) => ({ ...prev, message: event.target.value }))} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Class Name</label>
            <Input value={formState.className || ""} onChange={(event) => setFormState((prev) => ({ ...prev, className: event.target.value }))} placeholder="Optional class title" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Class Mode</label>
            <select
              value={formState.classMode || "online"}
              onChange={(event) => {
                const mode = event.target.value as ClassMode
                setFormState((prev) => ({
                  ...prev,
                  classMode: mode,
                  meetingLink: mode === "online" ? prev.meetingLink : "",
                  venue: mode === "physical" ? prev.venue : "",
                }))
              }}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
            >
              <option value="online">Online</option>
              <option value="physical">Physical</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Class Start</label>
            <Input type="datetime-local" value={formState.classStartAt || ""} onChange={(event) => setFormState((prev) => ({ ...prev, classStartAt: event.target.value }))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Class End</label>
            <Input type="datetime-local" value={formState.classEndAt || ""} onChange={(event) => setFormState((prev) => ({ ...prev, classEndAt: event.target.value }))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Meeting Link</label>
            <Input
              value={formState.meetingLink || ""}
              onChange={(event) => setFormState((prev) => ({ ...prev, meetingLink: event.target.value }))}
              placeholder={isOnlineMode ? "Class meeting link" : "Disabled for physical classes"}
              disabled={!isOnlineMode}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Venue</label>
            <Input
              value={formState.venue || ""}
              onChange={(event) => setFormState((prev) => ({ ...prev, venue: event.target.value }))}
              placeholder={isOnlineMode ? "Disabled for online classes" : "Physical class venue"}
              disabled={isOnlineMode}
            />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" className="rounded-xl bg-slate-900" disabled={isSaving}>
              {isSaving ? <Spinner className="size-4" /> : null}
              {editingId ? "Update Broadcast" : "Create Broadcast"}
            </Button>
            {editingId ? (
              <Button type="button" variant="outline" className="rounded-xl" onClick={resetForm}>
                Cancel Edit
              </Button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Broadcast Log</h3>
        <div className="mt-3 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              <Spinner />
              Loading broadcasts...
            </div>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-4 font-medium">Title</th>
                  <th className="py-2 pr-4 font-medium">Audience</th>
                  <th className="py-2 pr-4 font-medium">Class</th>
                  <th className="py-2 pr-4 font-medium">Mode</th>
                  <th className="py-2 pr-4 font-medium">Start</th>
                  <th className="py-2 pr-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 text-slate-700 align-top">
                    <td className="py-2 pr-4">{row.title}</td>
                    <td className="py-2 pr-4">{row.audience}</td>
                    <td className="py-2 pr-4">{row.className || "Announcement only"}</td>
                    <td className="py-2 pr-4 capitalize">{row.classMode || "-"}</td>
                    <td className="py-2 pr-4">{row.classStartAt ? new Date(row.classStartAt).toLocaleString("en-NG") : "-"}</td>
                    <td className="py-2 pr-2">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => onEdit(row)}>
                          Edit
                        </Button>
                        <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(row)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
