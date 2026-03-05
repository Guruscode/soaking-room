"use client"

import { type FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"

export default function AdminBroadcastsPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<string[]>([
    "Welcome to TSR Academy.",
    "Friday session starts by 6:00pm WAT.",
  ])

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message.trim()) return
    setMessages((prev) => [message.trim(), ...prev])
    setMessage("")
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Broadcasts</h2>
      <p className="mt-2 text-sm text-slate-600">Send announcements and class updates to all students.</p>

      <form onSubmit={send} className="mt-4 space-y-3">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          placeholder="Type announcement..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <Button type="submit" className="rounded-xl bg-slate-900">Send Announcement</Button>
      </form>

      <div className="mt-4 space-y-2">
        {messages.map((item, index) => (
          <p key={`${item}-${index}`} className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}
