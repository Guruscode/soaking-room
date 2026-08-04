import { type ReactNode } from "react"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { getSessionUser } from "@/lib/session"

const navItems = [
  { label: "Overview", href: "/admin/overview" },
  { label: "Curriculum", href: "/admin/curriculum" },
  { label: "Assignments", href: "/admin/assignments" },
  { label: "Admissions", href: "/admin/admissions" },
  { label: "Teachers Guide", href: "/admin/teachers-guide" },
  { label: "Exams", href: "/admin/exams" },
  { label: "Exam Submissions", href: "/admin/exam-submissions" },
  { label: "Broadcasts", href: "/admin/broadcasts" },
  { label: "Exam Messages", href: "/admin/exam-messages" },
  { label: "Exam Proctoring", href: "/admin/exam-proctoring" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Settings", href: "/admin/settings"},

]

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const sessionUser = await getSessionUser()

  if (!sessionUser) {
    redirect("/tsr-academy/login")
  }

  if (sessionUser.role !== "admin") {
    redirect("/student-dashboard/profile")
  }

  return (
    <DashboardShell
      portalTitle="The Soaking Room Academy"
      portalSubtitle="Admin Dashboard"
      navItems={navItems}
    >
      {children}
    </DashboardShell>
  )
}
