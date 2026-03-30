"use client"

import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/components/providers/auth-provider"

export default function StudentProfilePage() {
  const { isHydrating, user } = useAuth()

  if (isHydrating) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
        <Spinner />
        Loading profile...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Your profile is not available because your session has expired.
      </div>
    )
  }

  const rows = [
    { id: 1, field: "Full Name", value: user.fullName },
    { id: 2, field: "Email", value: user.email },
    { id: 3, field: "Role", value: user.role },
    { id: 4, field: "Admission Status", value: user.admissionStatus },
  ]

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <p className="mt-2 text-sm text-slate-600">Your dashboard session is tied to the account created during registration.</p>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-4 font-medium">Field</th>
              <th className="py-2 pr-4 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                <td className="py-2 pr-4">{row.field}</td>
                <td className="py-2 pr-4 capitalize">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
