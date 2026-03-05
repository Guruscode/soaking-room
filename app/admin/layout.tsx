import { type ReactNode } from "react"
import { DashboardShell } from "@/components/dashboard-shell"

const navItems = [
  { label: "Overview", href: "/admin/overview" },
  { label: "Curriculum Upload", href: "/admin/curriculum" },
  { label: "Admissions", href: "/admin/admissions" },
  { label: "Teachers Guide", href: "/admin/teachers-guide" },
  { label: "Broadcasts", href: "/admin/broadcasts" },
]

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      portalTitle="The Soaking Room Academy"
      portalSubtitle="Admin Dashboard"
      userLabel="Admin"
      navItems={navItems}
    >
      {children}
    </DashboardShell>
  )
}
