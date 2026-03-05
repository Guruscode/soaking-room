"use client"

import { type FormEvent, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function TSRLoginPage() {
  const [role, setRole] = useState<"student" | "admin">("student")

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.location.href = role === "student" ? "/student-dashboard" : "/admin"
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-6 py-14 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-bold text-slate-900">TSR Academy Login</h1>
          <p className="mt-2 text-slate-600">Access your student or admin dashboard.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input type="password" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Login as</label>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as "student" | "admin")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" className="rounded-xl bg-slate-900">Login</Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/tsr-academy/register">Create student account</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
