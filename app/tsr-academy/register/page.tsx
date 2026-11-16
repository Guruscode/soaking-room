import Link from "next/link"
import { ArrowUpRight, Lock } from "lucide-react"
import { getSessionUser } from "@/lib/session"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Rays } from "@/components/site/rays"
import { TSR_ACADEMY_ADMISSION_STATUS } from "@/lib/academy-admissions"

export default async function TSRRegisterPage() {
  const sessionUser = await getSessionUser()

  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-surface-soft">
        <Rays className="pointer-events-none absolute -top-32 -right-32 size-[30rem] text-slate-900/[0.06] animate-spin-slow" />
        <div className="container-page relative py-20 md:py-28">
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_40px_80px_-40px_rgb(15_23_42/0.4)] animate-scale-in md:p-12">
            <span className="grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-200">
              <Lock className="size-6" />
            </span>
            <p className="eyebrow mt-8 text-amber-800">TSR Academy Registration</p>
            <h1 className="mt-3 text-4xl font-light tracking-tight text-ink md:text-5xl">
              Admissions are currently <span className="font-bold">closed</span>
            </h1>
            <p className="mt-5 text-lg text-slate-700">{TSR_ACADEMY_ADMISSION_STATUS.closedNotice}</p>
            <p className="mt-2 text-slate-600">
              New student registration has been disabled for now. Existing students and admins can still log in.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={sessionUser ? (sessionUser.role === "admin" ? "/admin/overview" : "/student-dashboard/profile") : "/tsr-academy/login"}
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-ink pr-1.5 pl-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                {sessionUser ? "Go to dashboard" : "Go to login"}
                <span className="grid size-9 place-items-center rounded-full bg-brand transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
              <Link
                href="/tsr-academy"
                className="inline-flex h-12 items-center rounded-full border border-slate-300 px-6 text-sm font-semibold text-ink transition-colors hover:border-ink"
              >
                Back to academy page
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
