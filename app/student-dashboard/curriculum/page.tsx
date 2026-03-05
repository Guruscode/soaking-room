"use client"

import { useState } from "react"
import { RecordActionMenu } from "@/components/record-action-menu"

type CurriculumRow = {
  id: number
  module: string
  week: string
  status: "Pending" | "Approved" | "Rejected"
}

const initialRows: CurriculumRow[] = [
  { id: 1, module: "Identity & Sonship", week: "Week 1", status: "Approved" },
  { id: 2, module: "Spiritual Impact of Your Voice", week: "Week 2", status: "Pending" },
  { id: 3, module: "Anatomy of Your Ministry Voice", week: "Week 3", status: "Pending" },
]

export default function StudentCurriculumPage() {
  const [rows, setRows] = useState(initialRows)

  const updateStatus = (id: number, status: CurriculumRow["status"]) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)))
  }

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h2 className="text-2xl font-semibold">Curriculum & Module Rotation</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-4 font-medium">Module</th>
              <th className="py-2 pr-4 font-medium">Week</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                <td className="py-2 pr-4">{row.module}</td>
                <td className="py-2 pr-4">{row.week}</td>
                <td className="py-2 pr-4">{row.status}</td>
                <td className="py-2 pr-2">
                  <RecordActionMenu
                    recordName={row.module}
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
  )
}
