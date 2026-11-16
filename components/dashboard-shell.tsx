"use client"

import { type ReactNode, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  BookOpenCheck,
  Bell,
  CalendarDays,
  CalendarRange,
  CircleUser,
  ClipboardList,
  Clock,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  MessagesSquare,
  NotebookPen,
  ScanEye,
  Settings,
  Sparkles,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { getErrorMessage } from "@/lib/errors"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: string
}

// Icons are picked here (client side) so the server layouts can keep passing plain data.
const iconBySegment: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  curriculum: BookOpen,
  assignments: NotebookPen,
  admissions: GraduationCap,
  "teachers-guide": BookOpenCheck,
  exams: ClipboardList,
  "exam-submissions": FileCheck2,
  broadcasts: Megaphone,
  "exam-messages": MessagesSquare,
  "exam-proctoring": ScanEye,
  bookings: CalendarRange,
  events: Sparkles,
  settings: Settings,
  profile: CircleUser,
  notifications: Bell,
  timetable: CalendarDays,
  "next-class": Clock,
  "score-sheet": Trophy,
}

function iconFor(href: string) {
  const segment = href.split("/").filter(Boolean).pop() ?? ""
  return iconBySegment[segment] ?? Mail
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function DashboardShell({
  portalTitle,
  portalSubtitle,
  navItems,
  children,
}: {
  portalTitle: string
  portalSubtitle: string
  navItems: NavItem[]
  children: ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { logout, user } = useAuth()

  const current = navItems.find((item) => isActive(pathname, item.href))
  const initials = (user?.fullName || "Academy User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const onLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
      toast({
        title: "Signed out",
        description: "Your session has been closed successfully.",
      })
      router.push("/tsr-academy/login")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign-out failed",
        description: getErrorMessage(error, "We could not sign you out."),
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#201e1a]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[86vw] max-w-72 flex-col overflow-hidden bg-[#201e1a] text-[#f7f5f0] transition-transform duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative flex items-center justify-between gap-3 px-5 pt-6 pb-5">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.PNG" alt="" width={36} height={36} className="size-9 object-contain" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-serif text-base text-white">The Soaking Room</span>
              <span className="mt-1 block truncate text-[0.62rem] uppercase tracking-[0.15em] text-white/50">{portalSubtitle}</span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="grid size-9 place-items-center text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="relative flex-1 space-y-0.5 overflow-y-auto px-3 pb-4" aria-label="Dashboard">
          <p className="px-3 pt-2 pb-3 text-[0.62rem] uppercase tracking-[0.17em] text-white/35">Workspace</p>
          {navItems.map((item) => {
            const Icon = iconFor(item.href)
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition-colors duration-200",
                  active
                    ? "border-[#c4a36a] bg-white/[0.05] text-white"
                    : "border-transparent text-white/60 hover:bg-white/[0.04] hover:text-white",
                )}
              >
                <Icon className={cn("size-[1.05rem] shrink-0", active ? "text-[#d6bc8b]" : "text-white/45 group-hover:text-white/80")} />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="relative border-t border-white/10 p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <span className="grid size-9 shrink-0 place-items-center bg-[#c4a36a] text-xs font-semibold text-[#201e1a]">
              {initials || "AU"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-white">{user?.fullName || "Academy User"}</span>
              <span className="block truncate text-xs text-white/45">{portalTitle}</span>
            </span>
            <button
              type="button"
              onClick={onLogout}
              disabled={isLoggingOut}
              aria-label="Logout"
              title="Logout"
              className="grid size-9 shrink-0 place-items-center text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              {isLoggingOut ? <Spinner className="size-4" /> : <LogOut className="size-4" />}
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-[#171511]/55 animate-fade lg:hidden"
        />
      )}

      {/* Main column */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-[#e3dfd5] bg-[#f7f5f0]/95">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-10 lg:py-4">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
              className="grid size-10 shrink-0 place-items-center border border-[#d0c9bc] bg-white text-[#49453d] lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.62rem] uppercase tracking-[0.17em] text-[#877f71]">{portalTitle}</p>
              <h1 className="truncate font-serif text-lg tracking-tight text-[#201e1a] sm:text-xl">
                {current?.label ?? portalSubtitle}
              </h1>
            </div>
            <div className="hidden items-center gap-3 border-l border-[#d0c9bc] pl-4 sm:flex">
              <span className="grid size-8 place-items-center bg-[#e7ddca] text-[0.7rem] font-medium text-[#51432d]">{initials || "AU"}</span>
              <span className="max-w-48 truncate text-sm text-[#49453d]">{user?.fullName || "Academy User"}</span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              disabled={isLoggingOut}
              className="inline-flex h-10 shrink-0 items-center gap-2 border border-[#d0c9bc] bg-white px-4 text-sm text-[#49453d] transition-colors hover:border-[#9a7946] hover:text-[#201e1a] disabled:opacity-50"
            >
              {isLoggingOut ? <Spinner className="size-4" /> : <LogOut className="size-4" />}
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="px-3 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          <section
            key={pathname}
            className="dashboard-content dashboard-content-enter min-w-0 p-1 sm:p-2"
          >
            {children}
          </section>
        </main>
      </div>
    </div>
  )
}
