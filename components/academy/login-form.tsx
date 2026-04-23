"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { TSR_ACADEMY_ADMISSION_STATUS } from "@/lib/academy-admissions"
import { getErrorMessage } from "@/lib/errors"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const user = await login(formState)

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.fullName}.`,
      })

      router.push(user.role === "admin" ? "/admin/overview" : "/student-dashboard/profile")
    } catch (submitError) {
      const message = getErrorMessage(submitError, "We could not log you in.")
      setError(message)
      toast({
        variant: "destructive",
        title: "Login failed",
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-6 py-14 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-bold text-slate-900">TSR Academy Login</h1>
          <p className="mt-2 text-slate-600">Access your student or admin dashboard with your registered credentials.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formState.email}
                onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={formState.password}
                onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                required
                autoComplete="current-password"
              />
            </div>

            {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {TSR_ACADEMY_ADMISSION_STATUS.closedNotice}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" className="rounded-xl bg-slate-900" disabled={isSubmitting}>
                {isSubmitting ? <Spinner className="size-4" /> : null}
                Login
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
