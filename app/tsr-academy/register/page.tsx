import { redirect } from "next/navigation"
import { RegisterForm } from "@/components/academy/register-form"
import { getSessionUser } from "@/lib/session"

export default async function TSRRegisterPage() {
  const sessionUser = await getSessionUser()

  if (sessionUser) {
    redirect(sessionUser.role === "admin" ? "/admin/overview" : "/student-dashboard/profile")
  }

  return <RegisterForm />
}
