"use client"

import { useState } from "react"
import { RecordActionMenu } from "@/components/record-action-menu"

type ProfileRow = {
  id: number
  field: string
  value: string
}

const initialRows: ProfileRow[] = [
  { id: 1, field: "Full Name", value: "Esther Akpa" },
  { id: 2, field: "Category", value: "Teenagers' Worship School" },
  { id: 3, field: "Church", value: "Living Faith Chapel" },
  { id: 4, field: "Location", value: "Abuja, Nigeria" },
]

export default function StudentProfilePage() {
  const [rows, setRows] = useState(initialRows)

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-4 font-medium">Field</th>
              <th className="py-2 pr-4 font-medium">Value</th>
              <th className="py-2 pr-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                <td className="py-2 pr-4">{row.field}</td>
                <td className="py-2 pr-4">{row.value}</td>
                <td className="py-2 pr-2">
                  <RecordActionMenu recordName={row.field} onDelete={() => removeRow(row.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
