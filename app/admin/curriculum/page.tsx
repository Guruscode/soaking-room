"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RecordActionMenu } from "@/components/record-action-menu"

type CurriculumRow = {
  id: number
  title: string
  category: string
  week: string
  status: "Draft" | "Approved" | "Rejected"
}

const initialRows: CurriculumRow[] = [
  { id: 1, title: "Identity & Sonship", category: "Teenagers", week: "Week 1", status: "Approved" },
  { id: 2, title: "Spiritual Impact of Your Voice", category: "Adult", week: "Week 2", status: "Draft" },
  { id: 3, title: "Anatomy of Your Ministry Voice", category: "Adult", week: "Week 3", status: "Draft" },
]

export default function AdminCurriculumPage() {
  const [rows, setRows] = useState(initialRows)

  const updateStatus = (id: number, status: CurriculumRow["status"]) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)))
  }

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-2xl font-semibold">Curriculum</h2>
        <p className="mt-2 text-sm text-slate-600">Upload module guides, notes, and media for students.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input type="file" className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-auto" />
          <Button className="rounded-xl bg-slate-900">Upload Material</Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Existing Curriculum</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4 font-medium">Title</th>
                <th className="py-2 pr-4 font-medium">Category</th>
                <th className="py-2 pr-4 font-medium">Week</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                  <td className="py-2 pr-4">{row.title}</td>
                  <td className="py-2 pr-4">{row.category}</td>
                  <td className="py-2 pr-4">{row.week}</td>
                  <td className="py-2 pr-4">{row.status}</td>
                  <td className="py-2 pr-2">
                    <RecordActionMenu
                      recordName={row.title}
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
