import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/academy/login-form"
import { getSessionUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Academy Login",
  description: "Sign in to The Soaking Room Academy.",
  robots: { index: false, follow: false },
}

export default async function TSRLoginPage() {
  const sessionUser = await getSessionUser()

  if (sessionUser) {
    redirect(sessionUser.role === "admin" ? "/admin/overview" : "/student-dashboard/profile")
  }

  return <LoginForm />
}
