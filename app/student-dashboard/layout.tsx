import { type ReactNode } from "react"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { getSessionUser } from "@/lib/session"

const navItems = [
  { label: "Profile", href: "/student-dashboard/profile" },
  { label: "Notifications", href: "/student-dashboard/notifications" },
  { label: "Curriculum", href: "/student-dashboard/curriculum" },
  { label: "Timetable", href: "/student-dashboard/timetable" },
  { label: "Next Class", href: "/student-dashboard/next-class" },
  { label: "Assignments", href: "/student-dashboard/assignments" },
  { label: "Score Sheet", href: "/student-dashboard/score-sheet" },
]

export default async function StudentDashboardLayout({ children }: { children: ReactNode }) {
  const sessionUser = await getSessionUser()

  if (!sessionUser) {
    redirect("/tsr-academy/login")
  }

  if (sessionUser.role === "admin") {
    redirect("/admin/overview")
  }

  return (
    <DashboardShell
      portalTitle="The Soaking Room Academy"
      portalSubtitle="Student Dashboard"
      navItems={navItems}
    >
      {children}
    </DashboardShell>
  )
}
