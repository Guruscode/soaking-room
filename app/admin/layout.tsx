import { type ReactNode } from "react"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { getSessionUser } from "@/lib/session"

const navItems = [
  { label: "Overview", href: "/admin/overview" },
  { label: "Curriculum", href: "/admin/curriculum" },
  { label: "Admissions", href: "/admin/admissions" },
  { label: "Teachers Guide", href: "/admin/teachers-guide" },
  { label: "Broadcasts", href: "/admin/broadcasts" },
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
