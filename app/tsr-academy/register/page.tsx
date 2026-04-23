import Link from "next/link"
import { getSessionUser } from "@/lib/session"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { TSR_ACADEMY_ADMISSION_STATUS } from "@/lib/academy-admissions"

export default async function TSRRegisterPage() {
  const sessionUser = await getSessionUser()

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-14 lg:px-8">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">TSR Academy Registration</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Admissions are currently closed</h1>
          <p className="mt-3 text-base text-slate-700">{TSR_ACADEMY_ADMISSION_STATUS.closedNotice}</p>
          <p className="mt-2 text-slate-700">
            New student registration has been disabled for now. Existing students and admins can still log in.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="rounded-xl bg-slate-900">
              <Link href={sessionUser ? (sessionUser.role === "admin" ? "/admin/overview" : "/student-dashboard/profile") : "/tsr-academy/login"}>
                {sessionUser ? "Go to dashboard" : "Go to login"}
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/tsr-academy">Back to academy page</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
