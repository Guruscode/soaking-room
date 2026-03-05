"use client"

import { type FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"

export default function StudentAssignmentsPage() {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Assignments</h2>
      <p className="mt-2 text-sm text-slate-300">Upload worship recording or reflection journal.</p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input type="file" required className="block w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm" />
        <textarea
          rows={4}
          placeholder="Optional note to your teacher"
          className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm"
        />
        <Button type="submit" className="rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300">Submit Assignment</Button>
      </form>
      {submitted && <p className="mt-3 text-sm text-emerald-300">Assignment submitted successfully.</p>}
    </div>
  )
}
