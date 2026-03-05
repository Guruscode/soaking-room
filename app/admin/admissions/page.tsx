"use client"

import { useState } from "react"
import { RecordActionMenu } from "@/components/record-action-menu"

type AdmissionRow = {
  id: number
  name: string
  category: string
  location: string
  status: "Pending" | "Approved" | "Rejected"
}

const initialRows: AdmissionRow[] = [
  { id: 1, name: "Esther A.", category: "Teenager", location: "Abuja", status: "Pending" },
  { id: 2, name: "Grace M.", category: "Children", location: "Lagos", status: "Approved" },
  { id: 3, name: "Samuel K.", category: "Adult", location: "Port Harcourt", status: "Pending" },
]

export default function AdminAdmissionsPage() {
  const [rows, setRows] = useState(initialRows)

  const updateStatus = (id: number, status: AdmissionRow["status"]) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)))
  }

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h2 className="text-2xl font-semibold">Admissions</h2>
      <p className="mt-2 text-sm text-slate-600">Review students and manage approval flow.</p>

      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Category</th>
              <th className="py-2 pr-4 font-medium">Location</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                <td className="py-2 pr-4">{row.name}</td>
                <td className="py-2 pr-4">{row.category}</td>
                <td className="py-2 pr-4">{row.location}</td>
                <td className="py-2 pr-4">{row.status}</td>
                <td className="py-2 pr-2">
                  <RecordActionMenu
                    recordName={row.name}
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
