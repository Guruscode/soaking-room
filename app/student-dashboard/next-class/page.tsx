"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RecordActionMenu } from "@/components/record-action-menu"

type ClassRow = {
  id: number
  title: string
  date: string
  time: string
  status: "Upcoming" | "Confirmed" | "Declined"
}

const initialRows: ClassRow[] = [
  { id: 1, title: "Prophetic Worship Session", date: "2026-03-06", time: "6:00pm - 8:00pm WAT", status: "Upcoming" },
]

export default function StudentNextClassPage() {
  const [rows, setRows] = useState(initialRows)

  const updateStatus = (id: number, status: ClassRow["status"]) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="text-2xl font-semibold">Next Class</h2>
        <p className="mt-2 text-sm text-slate-700">Friday, 6 March 2026 | 6:00pm - 8:00pm WAT</p>
        <Button asChild className="mt-3 rounded-xl bg-slate-900">
          <Link href="https://meet.google.com" target="_blank" rel="noopener noreferrer">Join Class Link</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Class Schedule Table</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4 font-medium">Class</th>
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 pr-4 font-medium">Time</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                  <td className="py-2 pr-4">{row.title}</td>
                  <td className="py-2 pr-4">{row.date}</td>
                  <td className="py-2 pr-4">{row.time}</td>
                  <td className="py-2 pr-4">{row.status}</td>
                  <td className="py-2 pr-2">
                    <RecordActionMenu
                      recordName={row.title}
                      status={row.status}
                      showApproval
                      onApprove={() => updateStatus(row.id, "Confirmed")}
                      onReject={() => updateStatus(row.id, "Declined")}
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
