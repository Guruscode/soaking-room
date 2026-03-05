"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Applicant = {
  id: number
  name: string
  category: string
  status: "Pending" | "Approved"
}

const initialApplicants: Applicant[] = [
  { id: 1, name: "Esther A.", category: "Teenager", status: "Pending" },
  { id: 2, name: "Daniel O.", category: "Adult", status: "Approved" },
  { id: 3, name: "Grace M.", category: "Children", status: "Pending" },
]

export default function AdminAdmissionsPage() {
  const [applicants, setApplicants] = useState(initialApplicants)

  const approve = (id: number) => {
    setApplicants((prev) => prev.map((item) => (item.id === id ? { ...item, status: "Approved" } : item)))
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Admissions Queue</h2>
      <p className="mt-2 text-sm text-slate-600">Review and approve incoming academy registrations.</p>
      <div className="mt-4 space-y-3">
        {applicants.map((applicant) => (
          <div key={applicant.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
            <div>
              <p className="font-medium text-slate-900">{applicant.name}</p>
              <p className="text-sm text-slate-600">{applicant.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  applicant.status === "Approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {applicant.status}
              </span>
              {applicant.status === "Pending" && (
                <Button onClick={() => approve(applicant.id)} className="h-8 rounded-lg bg-slate-900 px-3 text-xs">
                  Approve
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
