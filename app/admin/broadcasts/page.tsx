"use client"

import { type FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { RecordActionMenu } from "@/components/record-action-menu"

type Broadcast = {
  id: number
  title: string
  audience: string
  sentAt: string
  status: "Draft" | "Approved" | "Rejected" | "Sent"
}

const initialBroadcasts: Broadcast[] = [
  { id: 1, title: "Friday class reminder", audience: "All Students", sentAt: "2026-03-05 11:15", status: "Sent" },
  { id: 2, title: "Module 3 material released", audience: "Adult School", sentAt: "2026-03-04 18:40", status: "Approved" },
  { id: 3, title: "Monthly seminar registration", audience: "All Students", sentAt: "2026-03-03 09:10", status: "Draft" },
]

export default function AdminBroadcastsPage() {
  const [message, setMessage] = useState("")
  const [rows, setRows] = useState<Broadcast[]>(initialBroadcasts)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message.trim()) return

    const now = new Date()
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

    setRows((prev) => [
      { id: now.getTime(), title: message.trim(), audience: "All Students", sentAt: timestamp, status: "Draft" },
      ...prev,
    ])
    setMessage("")
  }

  const updateStatus = (id: number, status: Broadcast["status"]) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)))
  }

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-2xl font-semibold">Broadcasts</h2>
        <form onSubmit={onSubmit} className="mt-3">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            placeholder="Type announcement..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <Button type="submit" className="mt-3 rounded-xl bg-slate-900">Create Broadcast</Button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Broadcast Log</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4 font-medium">Title</th>
                <th className="py-2 pr-4 font-medium">Audience</th>
                <th className="py-2 pr-4 font-medium">Sent At</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                  <td className="py-2 pr-4">{row.title}</td>
                  <td className="py-2 pr-4">{row.audience}</td>
                  <td className="py-2 pr-4">{row.sentAt}</td>
                  <td className="py-2 pr-4">{row.status}</td>
                  <td className="py-2 pr-2">
                    <RecordActionMenu
                      recordName={row.title}
                      status={row.status}
                      showApproval={row.status !== "Sent"}
                      onApprove={() => updateStatus(row.id, "Approved")}
                      onReject={() => updateStatus(row.id, "Rejected")}
                      onDelete={() => removeRow(row.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
