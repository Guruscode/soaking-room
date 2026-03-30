import { redirect } from "next/navigation"
import { LoginForm } from "@/components/academy/login-form"
import { getSessionUser } from "@/lib/session"

export default async function TSRLoginPage() {
  const sessionUser = await getSessionUser()

  if (sessionUser) {
    redirect(sessionUser.role === "admin" ? "/admin/overview" : "/student-dashboard/profile")
  }

  return <LoginForm />
}
