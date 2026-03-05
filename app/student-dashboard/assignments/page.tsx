"use client"

import { type FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { RecordActionMenu } from "@/components/record-action-menu"

type AssignmentRow = {
  id: number
  title: string
  dueDate: string
  status: "Draft" | "Submitted" | "Approved" | "Rejected"
}

const initialRows: AssignmentRow[] = [
  { id: 1, title: "Worship Reflection Journal", dueDate: "2026-03-08", status: "Draft" },
  { id: 2, title: "Voice Recording Submission", dueDate: "2026-03-10", status: "Submitted" },
]

export default function StudentAssignmentsPage() {
  const [rows, setRows] = useState(initialRows)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const updateStatus = (id: number, status: AssignmentRow["status"]) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)))
  }

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-2xl font-semibold">Assignments</h2>
        <p className="mt-2 text-sm text-slate-600">Upload worship recording or reflection journal.</p>
        <form onSubmit={onSubmit} className="mt-3">
          <input type="file" required className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <textarea rows={3} placeholder="Optional note" className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <Button type="submit" className="mt-3 rounded-xl bg-slate-900">Submit Assignment</Button>
        </form>
        {submitted && <p className="mt-3 text-sm text-emerald-700">Assignment submitted successfully.</p>}
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Assignment Table</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4 font-medium">Title</th>
                <th className="py-2 pr-4 font-medium">Due Date</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                  <td className="py-2 pr-4">{row.title}</td>
                  <td className="py-2 pr-4">{row.dueDate}</td>
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
