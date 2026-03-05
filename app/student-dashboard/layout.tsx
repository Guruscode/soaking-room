import { type ReactNode } from "react"
import { DashboardShell } from "@/components/dashboard-shell"

const navItems = [
  { label: "Profile", href: "/student-dashboard/profile" },
  { label: "Curriculum", href: "/student-dashboard/curriculum" },
  { label: "Timetable", href: "/student-dashboard/timetable" },
  { label: "Next Class", href: "/student-dashboard/next-class" },
  { label: "Assignments", href: "/student-dashboard/assignments" },
]

export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      portalTitle="The Soaking Room Academy"
      portalSubtitle="Student Dashboard"
      userLabel="Student"
      navItems={navItems}
    >
      {children}
    </DashboardShell>
  )
}
