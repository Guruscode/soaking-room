import Link from "next/link"
import { type ElementType } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, CalendarClock, GraduationCap, ShieldCheck, Users } from "lucide-react"

const schools = [
  {
    title: "Children's Worship School",
    ages: "Ages 5-12",
    focus: "Introduction to worship, music, and Christian values",
  },
  {
    title: "Teenagers' Worship School",
    ages: "Ages 13-19",
    focus: "Identity, skill development, and worship foundations",
  },
  {
    title: "Adult Worship School",
    ages: "Ages 20+",
    focus: "Ministry-ready worshippers and musicians",
  },
  {
    title: "Master Class",
    ages: "For graduates only",
    focus: "Advanced worship leadership and ministry impact",
  },
]

export default function TSRAcademyInfoPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="border-b border-amber-100 bg-gradient-to-br from-orange-50 via-amber-50 to-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
              The Soaking Room Academy (TSR)
            </p>
            <h1 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
              Training & Discipleship School Framework
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-700">
              Founded by Moses Oche Akoh, TSR Academy is the official training and discipleship arm of The Soaking Room,
              raising worshippers, musicians, and ministers across the world through Spirit-led and structured learning.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FocusCard icon={Users} text="Intimacy with God through worship" />
              <FocusCard icon={ShieldCheck} text="Biblical foundations of worship" />
              <FocusCard icon={GraduationCap} text="Music and worship ministry skill development" />
              <FocusCard icon={CalendarClock} text="Discipleship, character, and spiritual growth" />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-xl bg-slate-900">
                <Link href="/tsr-academy/register">
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
             
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900">Academy Categories</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {schools.map((school) => (
              <article key={school.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-slate-900">{school.title}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{school.ages}</span>
                </div>
                <p className="mt-3 text-slate-700">{school.focus}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900">Admission Requirements</h2>
            <ul className="mt-4 space-y-2 text-slate-700">
              <li>Open to Christians worldwide</li>
              <li>Willingness to learn and grow spiritually</li>
              <li>Commitment to academy guidelines</li>
            </ul>
            <p className="mt-5 text-slate-700">
              Monthly physical worship meetings and seminars are available by invitation or registration.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900">Global Academy Sessions</h2>
          <p className="mt-3 text-slate-700">
            Sessions are held at globally convenient times with options for recorded replays for registered students.
          </p>
          <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-3">Worship</div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">Teaching</div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">Interactive Q&A</div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">Prayer & Impartation</div>
          </div>

         
        </section>
      </main>
      <Footer />
    </>
  )
}

function FocusCard({
  icon: Icon,
  text,
}: {
  icon: ElementType
  text: string
}) {
  return (
    <div className="rounded-xl border border-amber-100 bg-white p-4 text-sm text-slate-700 shadow-sm">
      <Icon className="mb-2 h-4 w-4 text-amber-700" />
      {text}
    </div>
  )
}
