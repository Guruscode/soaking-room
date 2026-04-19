"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { STUDENT_CATEGORY_OPTIONS } from "@/lib/academy-options"
import { getErrorMessage } from "@/lib/errors"

const initialFormState = {
  fullName: "",
  dateOfBirthOrAge: "",
  category: "",
  location: "",
  email: "",
  phone: "",
  bornAgain: "",
  church: "",
  musicalSkill: "",
  reason: "",
  password: "",
  confirmPassword: "",
}

export function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { requestRegistrationOtp, verifyRegistrationOtp } = useAuth()
  const [formState, setFormState] = useState(initialFormState)
  const [otp, setOtp] = useState("")
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(null)
  const [registrationStep, setRegistrationStep] = useState<"details" | "otp">("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmitDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await requestRegistrationOtp(formState)
      setOtp("")
      setOtpExpiresAt(response.expiresAt)
      setRegistrationStep("otp")
      toast({
        title: "Verification code sent",
        description: `We sent a 6-digit OTP to ${response.email}. Enter it to complete account creation.`,
      })
    } catch (submitError) {
      const message = getErrorMessage(submitError, "We could not complete your registration.")
      setError(message)
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const user = await verifyRegistrationOtp({ email: formState.email, otp })

      toast({
        title: "Registration submitted",
        description: `${user.fullName}, your account is ready and your application is now pending review.`,
      })

      router.push("/student-dashboard/profile")
    } catch (submitError) {
      const message = getErrorMessage(submitError, "We could not verify your OTP.")
      setError(message)
      toast({
        variant: "destructive",
        title: "OTP verification failed",
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resendOtp = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await requestRegistrationOtp(formState)
      setOtp("")
      setOtpExpiresAt(response.expiresAt)
      toast({
        title: "New code sent",
        description: `A fresh OTP has been sent to ${response.email}.`,
      })
    } catch (submitError) {
      const message = getErrorMessage(submitError, "We could not send a new OTP.")
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
      <main className="mx-auto max-w-4xl px-6 py-14 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-bold text-slate-900">TSR Academy Registration</h1>
          <p className="mt-2 text-slate-600">
            {registrationStep === "details"
              ? "Complete your admission form to join The Soaking Room Academy."
              : "Enter the OTP sent to your email address to finish creating your account."}
          </p>

          {registrationStep === "details" ? (
            <form onSubmit={onSubmitDetails} className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" id="fullName" value={formState.fullName} onChange={(value) => setFormState((prev) => ({ ...prev, fullName: value }))} required />
              <Field
                label="Date of Birth / Age"
                id="dateOfBirthOrAge"
                value={formState.dateOfBirthOrAge}
                onChange={(value) => setFormState((prev) => ({ ...prev, dateOfBirthOrAge: value }))}
                required
              />

              <div>
                <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">Category Applying For</label>
                <select
                  id="category"
                  value={formState.category}
                  onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                >
                  <option value="">Select category</option>
                  {STUDENT_CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <Field label="Country & City" id="location" value={formState.location} onChange={(value) => setFormState((prev) => ({ ...prev, location: value }))} required />
              <Field label="Email Address" id="email" type="email" value={formState.email} onChange={(value) => setFormState((prev) => ({ ...prev, email: value }))} required />
              <Field label="Phone / WhatsApp Number" id="phone" value={formState.phone} onChange={(value) => setFormState((prev) => ({ ...prev, phone: value }))} required />

              <div>
                <label htmlFor="bornAgain" className="mb-1 block text-sm font-medium text-slate-700">Are you born again?</label>
                <select
                  id="bornAgain"
                  value={formState.bornAgain}
                  onChange={(event) => setFormState((prev) => ({ ...prev, bornAgain: event.target.value }))}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <Field label="Church / Fellowship" id="church" value={formState.church} onChange={(value) => setFormState((prev) => ({ ...prev, church: value }))} />
              <Field label="Musical Skill (if any)" id="musicalSkill" value={formState.musicalSkill} onChange={(value) => setFormState((prev) => ({ ...prev, musicalSkill: value }))} />
              <Field label="Password" id="password" type="password" value={formState.password} onChange={(value) => setFormState((prev) => ({ ...prev, password: value }))} required />
              <Field label="Confirm Password" id="confirmPassword" type="password" value={formState.confirmPassword} onChange={(value) => setFormState((prev) => ({ ...prev, confirmPassword: value }))} required />

              <div className="sm:col-span-2">
                <label htmlFor="reason" className="mb-1 block text-sm font-medium text-slate-700">Why do you want to join TSR Academy?</label>
                <Textarea
                  id="reason"
                  rows={4}
                  value={formState.reason}
                  onChange={(event) => setFormState((prev) => ({ ...prev, reason: event.target.value }))}
                  required
                />
              </div>

              {error ? (
                <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="sm:col-span-2 flex flex-wrap gap-3">
                <Button type="submit" className="rounded-xl bg-slate-900" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner className="size-4" /> : null}
                  Continue With OTP
                </Button>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/tsr-academy/login">Already registered? Login</Link>
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={onVerifyOtp} className="mt-6 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">{formState.email}</p>
                <p className="mt-1">Enter the 6-digit code sent to this address.</p>
                {otpExpiresAt ? (
                  <p className="mt-1 text-slate-500">
                    Code expires at {new Date(otpExpiresAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}.
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="otp" className="mb-3 block text-sm font-medium text-slate-700">Verification Code</label>
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
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

              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button type="submit" className="rounded-xl bg-slate-900" disabled={isSubmitting || otp.length !== 6}>
                  {isSubmitting ? <Spinner className="size-4" /> : null}
                  Verify OTP
                </Button>
                <Button type="button" variant="outline" className="rounded-xl" disabled={isSubmitting} onClick={() => void resendOtp()}>
                  Resend OTP
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl"
                  disabled={isSubmitting}
                  onClick={() => {
                    setRegistrationStep("details")
                    setOtp("")
                    setError(null)
                  }}
                >
                  Edit Details
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function Field({
  label,
  id,
  required = false,
  type = "text",
  value,
  onChange,
}: {
  label: string
  id: string
  required?: boolean
  type?: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <Input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
