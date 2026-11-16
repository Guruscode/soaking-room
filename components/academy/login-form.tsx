"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Rays } from "@/components/site/rays"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { TSR_ACADEMY_ADMISSION_STATUS } from "@/lib/academy-admissions"
import { getErrorMessage } from "@/lib/errors"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { login, requestPasswordResetOtp, resetPasswordWithOtp } = useAuth()
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  })
  const [forgotPasswordState, setForgotPasswordState] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  })
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(null)
  const [mode, setMode] = useState<"login" | "forgot-request" | "forgot-verify">("login")
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

  const onRequestResetOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await requestPasswordResetOtp({ email: forgotPasswordState.email })
      setForgotPasswordState((prev) => ({ ...prev, email: response.email, otp: "", password: "", confirmPassword: "" }))
      setOtpExpiresAt(response.expiresAt)
      setMode("forgot-verify")
      toast({
        title: "OTP sent",
        description: `We sent a 6-digit reset code to ${response.email}.`,
      })
    } catch (submitError) {
      const message = getErrorMessage(submitError, "We could not send a password reset code.")
      setError(message)
      toast({
        variant: "destructive",
        title: "Reset request failed",
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await resetPasswordWithOtp(forgotPasswordState)
      setFormState((prev) => ({ ...prev, email: forgotPasswordState.email, password: "" }))
      setForgotPasswordState({ email: forgotPasswordState.email, otp: "", password: "", confirmPassword: "" })
      setOtpExpiresAt(null)
      setMode("login")
      toast({
        title: "Password updated",
        description: "Your password has been reset. You can now log in with the new password.",
      })
    } catch (submitError) {
      const message = getErrorMessage(submitError, "We could not reset your password.")
      setError(message)
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resendResetOtp = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await requestPasswordResetOtp({ email: forgotPasswordState.email })
      setForgotPasswordState((prev) => ({ ...prev, email: response.email, otp: "" }))
      setOtpExpiresAt(response.expiresAt)
      toast({
        title: "New code sent",
        description: `A fresh reset code has been sent to ${response.email}.`,
      })
    } catch (submitError) {
      const message = getErrorMessage(submitError, "We could not send a new password reset code.")
      setError(message)
      toast({
        variant: "destructive",
        title: "Resend failed",
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="bg-surface-soft">
        <div className="container-page grid gap-8 py-10 md:py-16 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
          <div className="relative hidden min-h-[36rem] overflow-hidden rounded-[2rem] bg-ink lg:block animate-scale-in">
            <Image src="/image-12.jpg" alt="" fill priority sizes="45vw" className="object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            <Rays className="absolute -top-24 -right-24 size-96 text-white/10 animate-spin-slow" />
            <div className="absolute inset-x-0 bottom-0 p-10 text-white">
              <p className="eyebrow text-cyan-300">The Soaking Room Academy</p>
              <p className="mt-4 text-4xl font-light leading-tight tracking-tight">
                Worship • Obedience • <span className="font-bold">Eyes on Jesus</span>
              </p>
            </div>
          </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_40px_80px_-40px_rgb(15_23_42/0.35)] animate-rise sm:p-10 lg:p-12">
          <p className="eyebrow text-brand-strong">TSR Academy</p>
          <h1 className="mt-3 text-4xl font-light tracking-tight text-ink">TSR Academy <span className="font-bold">Login</span></h1>
          <p className="mt-2 text-slate-600">
            {mode === "login"
              ? "Access your student or admin dashboard with your registered credentials."
              : mode === "forgot-request"
                ? "Enter your email address to receive a password reset OTP."
                : "Enter the OTP we sent and choose a new password."}
          </p>

          {mode === "login" ? (
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
                <div className="mb-1 flex items-center justify-between gap-3">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-brand-strong hover:underline"
                    onClick={() => {
                      setForgotPasswordState((prev) => ({ ...prev, email: formState.email }))
                      setError(null)
                      setMode("forgot-request")
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
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
                <Button type="submit" className="bg-ink" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner className="size-4" /> : null}
                  Login
                </Button>
              </div>
            </form>
          ) : mode === "forgot-request" ? (
            <form onSubmit={onRequestResetOtp} className="mt-6 space-y-4">
              <div>
                <label htmlFor="reset-email" className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  value={forgotPasswordState.email}
                  onChange={(event) => setForgotPasswordState((prev) => ({ ...prev, email: event.target.value }))}
                  required
                  autoComplete="email"
                />
              </div>

              {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

              <div className="flex flex-wrap gap-3">
                <Button type="submit" className="bg-ink" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner className="size-4" /> : null}
                  Send OTP
                </Button>
                <Button
                  type="button"
                  variant="outline"
                 
                  disabled={isSubmitting}
                  onClick={() => {
                    setError(null)
                    setMode("login")
                  }}
                >
                  Back to login
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={onResetPassword} className="mt-6 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">{forgotPasswordState.email}</p>
                <p className="mt-1">Enter the 6-digit code sent to this email and choose a new password.</p>
                {otpExpiresAt ? (
                  <p className="mt-1 text-slate-500">
                    Code expires at {new Date(otpExpiresAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}.
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="reset-otp" className="mb-3 block text-sm font-medium text-slate-700">Verification Code</label>
                <InputOTP
                  id="reset-otp"
                  maxLength={6}
                  value={forgotPasswordState.otp}
                  onChange={(value) => setForgotPasswordState((prev) => ({ ...prev, otp: value }))}
                  pattern="^[0-9]+$"
                  containerClassName="justify-start"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div>
                <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-slate-700">
                  New Password
                </label>
                <Input
                  id="new-password"
                  type="password"
                  value={forgotPasswordState.password}
                  onChange={(event) => setForgotPasswordState((prev) => ({ ...prev, password: event.target.value }))}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={forgotPasswordState.confirmPassword}
                  onChange={(event) => setForgotPasswordState((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  required
                  autoComplete="new-password"
                />
              </div>

              {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

              <div className="flex flex-wrap gap-3">
                <Button type="submit" className="bg-ink" disabled={isSubmitting || forgotPasswordState.otp.length !== 6}>
                  {isSubmitting ? <Spinner className="size-4" /> : null}
                  Reset Password
                </Button>
                <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => void resendResetOtp()}>
                  Resend OTP
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                 
                  disabled={isSubmitting}
                  onClick={() => {
                    setError(null)
                    setOtpExpiresAt(null)
                    setMode("forgot-request")
                  }}
                >
                  Change Email
                </Button>
              </div>
            </form>
          )}
        </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
