import Link from "next/link"
import { type ReactNode } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const links = [
  { href: "/tsr-academy/student-dashboard/profile", label: "Profile" },
  { href: "/tsr-academy/student-dashboard/curriculum", label: "Curriculum" },
  { href: "/tsr-academy/student-dashboard/timetable", label: "Timetable" },
  { href: "/tsr-academy/student-dashboard/next-class", label: "Next Class" },
  { href: "/tsr-academy/student-dashboard/assignments", label: "Assignments" },
]

export default function StudentDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <Header />
      <main className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="mt-2 text-slate-300">Manage your profile, curriculum, timetable, classes, and assignments.</p>

          <div className="mt-6 overflow-x-auto">
            <div className="grid min-w-[900px] grid-cols-[260px,1fr] gap-5">
              <aside className="sticky top-24 h-fit rounded-2xl border-2 border-amber-300/40 bg-slate-800 p-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-300">Sidebar - Student Portal</p>
              <div className="space-y-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg bg-slate-700/40 px-3 py-2 text-sm text-slate-200 hover:bg-amber-400 hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              </aside>

              <section className="rounded-2xl border-2 border-slate-600 bg-slate-800 p-6">{children}</section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
