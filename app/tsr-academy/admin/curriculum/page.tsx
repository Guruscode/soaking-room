"use client"

import { type FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"

export default function AdminCurriculumPage() {
  const [uploaded, setUploaded] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUploaded(true)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Upload Curriculum</h2>
      <p className="mt-2 text-sm text-slate-600">Upload module guides, PDF notes, and media files for students.</p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input type="file" required className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <Button type="submit" className="rounded-xl bg-slate-900">Upload</Button>
      </form>
      {uploaded && <p className="mt-3 text-sm text-emerald-700">Curriculum uploaded successfully.</p>}
    </div>
  )
}
