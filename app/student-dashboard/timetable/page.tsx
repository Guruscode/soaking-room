"use client"

import { useState } from "react"
import { RecordActionMenu } from "@/components/record-action-menu"

type TimetableRow = {
  id: number
  day: string
  time: string
  session: string
  status: "Upcoming" | "Confirmed" | "Declined"
}

const initialRows: TimetableRow[] = [
  { id: 1, day: "Monday", time: "6:00pm - 8:00pm", session: "Core Teaching + Activation", status: "Upcoming" },
  { id: 2, day: "Wednesday", time: "6:00pm - 8:00pm", session: "Voice Practice + Discussion", status: "Upcoming" },
  { id: 3, day: "Friday", time: "6:00pm - 8:00pm", session: "Prophetic Worship + Formation", status: "Upcoming" },
]

export default function StudentTimetablePage() {
  const [rows, setRows] = useState(initialRows)

  const updateStatus = (id: number, status: TimetableRow["status"]) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)))
  }

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h2 className="text-2xl font-semibold">Weekly Timetable</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-4 font-medium">Day</th>
              <th className="py-2 pr-4 font-medium">Time</th>
              <th className="py-2 pr-4 font-medium">Session</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                <td className="py-2 pr-4">{row.day}</td>
                <td className="py-2 pr-4">{row.time}</td>
                <td className="py-2 pr-4">{row.session}</td>
                <td className="py-2 pr-4">{row.status}</td>
                <td className="py-2 pr-2">
                  <RecordActionMenu
                    recordName={`${row.day} class`}
                    status={row.status}
                    showApproval
                    onApprove={() => updateStatus(row.id, "Confirmed")}
                    onReject={() => updateStatus(row.id, "Declined")}
                    onDelete={() => removeRow(row.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
