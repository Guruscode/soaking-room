"use client"

import { type FormEvent, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function TSRRegisterPage() {
  const [success, setSuccess] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccess(true)
    event.currentTarget.reset()
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-14 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-bold text-slate-900">TSR Academy Registration</h1>
          <p className="mt-2 text-slate-600">
            Complete your admission form to join The Soaking Room Academy.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="fullName" required />
            <Field label="Date of Birth / Age" name="age" required />

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Category Applying For</label>
              <select name="category" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="">Select category</option>
                <option>Children (5-12)</option>
                <option>Teenager (13-19)</option>
                <option>Adult (20+)</option>
                <option>Master Class</option>
              </select>
            </div>

            <Field label="Country & City" name="location" required />
            <Field label="Email Address" name="email" type="email" required />
            <Field label="Phone / WhatsApp Number" name="phone" required />

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Are you born again?</label>
              <select name="bornAgain" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <Field label="Church / Fellowship" name="church" />
            <Field label="Musical Skill (if any)" name="skill" />

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Why do you want to join TSR Academy?</label>
              <textarea name="reason" rows={4} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>

            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <Button type="submit" className="rounded-xl bg-slate-900">Submit Registration</Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/tsr-academy/login">Already registered? Login</Link>
              </Button>
            </div>
          </form>

          {success && (
            <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Registration submitted. The TSR Academy team will contact you.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function Field({
  label,
  name,
  required = false,
  type = "text",
}: {
  label: string
  name: string
  required?: boolean
  type?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
  )
}
