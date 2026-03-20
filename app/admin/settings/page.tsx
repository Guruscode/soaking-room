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
      <h2 className="text-2xl font-semibold">Settings </h2>
      <p className="mt-2 text-sm text-slate-600"></p>

      <div className="mt-3 overflow-x-auto">
       <div className="">

       </div>
      </div>
    </div>
  )
}
