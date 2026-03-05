"use client"

import { useState } from "react"
import { RecordActionMenu } from "@/components/record-action-menu"

type FlowRow = {
  id: number
  flow: string
  duration: string
  owner: string
  status: "Active" | "Approved" | "Rejected"
}

const initialRows: FlowRow[] = [
  { id: 1, flow: "Prayer & Silence", duration: "5-10 mins", owner: "Lead Teacher", status: "Active" },
  { id: 2, flow: "Scripture Meditation", duration: "10 mins", owner: "Assistant", status: "Approved" },
  { id: 3, flow: "Core Teaching", duration: "35 mins", owner: "Lead Teacher", status: "Active" },
  { id: 4, flow: "Practical Activation", duration: "20 mins", owner: "Worship Coach", status: "Active" },
]

export default function AdminTeachersGuidePage() {
  const [rows, setRows] = useState(initialRows)

  const updateStatus = (id: number, status: FlowRow["status"]) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)))
  }

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-2xl font-semibold">Teachers Flow</h2>
        <p className="mt-2 text-sm text-slate-600">
          Manage class flow items and maintain teaching quality across sessions.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Teaching Flow Table</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4 font-medium">Flow</th>
                <th className="py-2 pr-4 font-medium">Duration</th>
                <th className="py-2 pr-4 font-medium">Owner</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                  <td className="py-2 pr-4">{row.flow}</td>
                  <td className="py-2 pr-4">{row.duration}</td>
                  <td className="py-2 pr-4">{row.owner}</td>
                  <td className="py-2 pr-4">{row.status}</td>
                  <td className="py-2 pr-2">
                    <RecordActionMenu
                      recordName={row.flow}
                      status={row.status}
                      showApproval
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
