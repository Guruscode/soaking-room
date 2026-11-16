import { type ElementType } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, BookOpen, CalendarClock, GraduationCap, Mic2, ShieldCheck, Users } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/site/page-hero"
import { SectionHeading } from "@/components/site/section-heading"
import { TSR_ACADEMY_ADMISSION_STATUS } from "@/lib/academy-admissions"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "The Soaking Room Academy",
  description:
    "Learn about The Soaking Room Academy, a worship and discipleship school developing worshippers, musicians, and ministry leaders through structured learning.",
  path: "/tsr-academy",
})

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

const sessions = [
  { label: "Worship", icon: Mic2 },
  { label: "Teaching", icon: BookOpen },
  { label: "Interactive Q&A", icon: Users },
  { label: "Prayer & Impartation", icon: ShieldCheck },
]

export default function TSRAcademyInfoPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <PageHero
          eyebrow="The Soaking Room Academy (TSR)"
          title={
            <>
              Training &amp; Discipleship <span className="font-bold">School Framework</span>
            </>
          }
          description="Founded by Moses Oche Akoh, TSR Academy is the official training and discipleship arm of The Soaking Room, raising worshippers, musicians, and ministers across the world through Spirit-led and structured learning."
          aside={
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] bg-slate-200 shadow-[0_50px_100px_-40px_rgb(15_23_42/0.55)]">
              <Image src="/image-8.jpg" alt="TSR Academy worship session" fill priority sizes="(max-width: 1024px) 80vw, 30vw" className="object-cover" />
            </div>
          }
        >
          <Link
            href="/tsr-academy/login"
            className="group inline-flex h-12 items-center gap-3 rounded-full bg-ink pr-1.5 pl-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Login
            <span className="grid size-9 place-items-center rounded-full bg-brand transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        </PageHero>

        <section className="container-page py-14 md:py-20">
          <div className="reveal-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FocusCard icon={Users} text="Intimacy with God through worship" />
            <FocusCard icon={ShieldCheck} text="Biblical foundations of worship" />
            <FocusCard icon={GraduationCap} text="Music and worship ministry skill development" />
            <FocusCard icon={CalendarClock} text="Discipleship, character, and spiritual growth" />
          </div>

          <div className="reveal relative mt-8 overflow-hidden rounded-[1.75rem] border border-red-200 bg-red-50 p-7 md:p-10">
            <span className="absolute top-8 right-8 hidden size-3 rounded-full bg-red-500 md:block">
              <span className="absolute inset-0 rounded-full bg-red-500 animate-pulse-ring" />
            </span>
            <p className="eyebrow text-red-700">Admissions Closed</p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold text-red-900 md:text-3xl">{TSR_ACADEMY_ADMISSION_STATUS.closedNotice}</h2>
            <p className="mt-3 text-base font-medium text-red-950 md:text-lg">
              Registration is disabled for now. Please check back for the July cohort.
            </p>
          </div>
        </section>

        <section className="bg-surface-soft py-16 md:py-24">
          <div className="container-page">
            <SectionHeading
              eyebrow="TSR Academy"
              title={
                <>
                  Academy <span className="font-bold">Categories</span>
                </>
              }
            />
            <div className="reveal-stagger mt-12 grid gap-5 md:grid-cols-2">
              {schools.map((school, i) => (
                <article key={school.title} className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-7 lift md:p-8">
                  <span className="absolute top-6 right-7 text-6xl font-light text-slate-100 transition-colors duration-500 group-hover:text-brand-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative inline-flex rounded-full bg-ink px-3 py-1 text-xs font-medium text-white">{school.ages}</span>
                  <h3 className="relative mt-6 text-2xl font-semibold tracking-tight text-ink">{school.title}</h3>
                  <p className="relative mt-2 text-slate-600">{school.focus}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <h2 className="text-4xl font-light tracking-tight text-ink">
              Admission <span className="font-bold">Requirements</span>
            </h2>
            <ul className="mt-8 space-y-3">
              {["Open to Christians worldwide", "Willingness to learn and grow spiritually", "Commitment to academy guidelines"].map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-5 py-4 text-slate-700">
                  <span className="size-2 rounded-full bg-brand" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-slate-600">
              Monthly physical worship meetings and seminars are available by invitation or registration.
            </p>
          </div>

          <div className="reveal rounded-[2rem] bg-ink p-8 text-white md:p-10">
            <h2 className="text-4xl font-light tracking-tight">
              Global Academy <span className="font-bold">Sessions</span>
            </h2>
            <p className="mt-4 text-slate-400">
              Sessions are held at globally convenient times with options for recorded replays for registered students.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {sessions.map(({ label, icon: Icon }) => (
                <div key={label} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <Icon className="size-5 text-brand-glow" />
                  <p className="mt-3 text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function FocusCard({ icon: Icon, text }: { icon: ElementType; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 lift">
      <span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand-strong">
        <Icon className="size-5" />
      </span>
      <p className="mt-5 font-medium text-ink">{text}</p>
    </div>
  )
}
