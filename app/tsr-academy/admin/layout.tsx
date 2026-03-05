import Link from "next/link"
import { type ReactNode } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const links = [
  { href: "/tsr-academy/admin/overview", label: "Overview" },
  { href: "/tsr-academy/admin/curriculum", label: "Curriculum Upload" },
  { href: "/tsr-academy/admin/admissions", label: "Admissions" },
  { href: "/tsr-academy/admin/teachers-guide", label: "Teachers Guide" },
  { href: "/tsr-academy/admin/broadcasts", label: "Broadcasts" },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">Manage curriculum, student approvals, teachers guide, and academy communication.</p>

          <div className="mt-6 overflow-x-auto">
            <div className="grid min-w-[900px] grid-cols-[260px,1fr] gap-5">
              <aside className="sticky top-24 h-fit rounded-2xl border-2 border-slate-300 bg-white p-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900">Sidebar - Admin Panel</p>
              <div className="space-y-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-900 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              </aside>

              <section className="rounded-2xl border-2 border-slate-200 bg-white p-6">{children}</section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
