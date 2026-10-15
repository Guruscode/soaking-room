"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, type FormEvent } from "react"
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  Music2,
  Play,
  Sparkles,
  Ticket,
  Youtube,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type RegistrationForm = {
  name: string
  email: string
  phone: string
}

const eventFacts = [
  { icon: CalendarDays, label: "Sunday, 29 November 2026" },
  { icon: Clock3, label: "4:00 PM WAT" },
  { icon: MapPin, label: "Celeb8 Centre · Utako, Abuja" },
]

const registrationDetails = {
  date: "Sunday, 29 November 2026",
  time: "4:00 PM WAT",
  venue: "Celeb8 Centre, Utako, Abuja",
}

function RegistrationDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [form, setForm] = useState<RegistrationForm>({ name: "", email: "", phone: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [ticketEmailSent, setTicketEmailSent] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/events/worship-night/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = (await response.json()) as { error?: string; ticketEmailSent?: boolean }

      if (!response.ok) {
        setError(data.error || "We couldn’t complete your registration. Please try again.")
        return
      }

      setTicketEmailSent(Boolean(data.ticketEmailSent))
      setIsRegistered(true)
    } catch {
      setError("A network error interrupted your registration. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      setTimeout(() => {
        setForm({ name: "", email: "", phone: "" })
        setError("")
        setIsRegistered(false)
        setTicketEmailSent(false)
      }, 250)
    }
  }

  const updateField = (field: keyof RegistrationForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-[#60402d] bg-[#17100d] p-6 text-white sm:max-w-md sm:p-8">
        {isRegistered ? (
          <div className="space-y-6 py-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d5a24e]/15 text-[#f1c778]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl text-white">Your place is reserved.</DialogTitle>
              <DialogDescription className="text-[#d4c4b4]">
                Thank you, {form.name}. We can’t wait to worship with you.
              </DialogDescription>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left text-sm text-[#e8ddd0]">
              <p className="flex gap-3"><CalendarDays className="h-4 w-4 shrink-0 text-[#e4b765]" />{registrationDetails.date}</p>
              <p className="flex gap-3"><Clock3 className="h-4 w-4 shrink-0 text-[#e4b765]" />{registrationDetails.time}</p>
              <p className="flex gap-3"><MapPin className="h-4 w-4 shrink-0 text-[#e4b765]" />{registrationDetails.venue}</p>
            </div>
            <p className="text-sm leading-relaxed text-[#c6b6a7]">
              {ticketEmailSent
                ? <>Your confirmation ticket has been sent to <span className="font-medium text-white">{form.email}</span>. Check your inbox and spam folder.</>
                : <>Your registration is saved. We couldn’t send the confirmation email right now; please contact us if you need help.</>}
            </p>
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="h-12 w-full rounded-xl bg-[#d5a24e] font-semibold text-[#1b100b] hover:bg-[#edc675]"
            >
              Wonderful, thank you
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-3 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e4b765]">Save your place</p>
              <DialogTitle className="text-2xl text-white">Be in the room.</DialogTitle>
              <DialogDescription className="text-[#c6b6a7]">
                Add your details and we’ll send your Worship Night confirmation ticket by email.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="mt-3 space-y-4">
              <div className="space-y-2">
                <label htmlFor="worship-name" className="text-sm font-medium text-[#f1e8dc]">Full name</label>
                <Input id="worship-name" autoComplete="name" required value={form.name} onChange={updateField("name")} placeholder="Your full name" className="h-12 rounded-xl border-white/15 bg-white/[0.06] text-white placeholder:text-[#98897b] focus-visible:ring-[#d5a24e]" />
              </div>
              <div className="space-y-2">
                <label htmlFor="worship-email" className="text-sm font-medium text-[#f1e8dc]">Email address</label>
                <Input id="worship-email" type="email" autoComplete="email" required value={form.email} onChange={updateField("email")} placeholder="you@example.com" className="h-12 rounded-xl border-white/15 bg-white/[0.06] text-white placeholder:text-[#98897b] focus-visible:ring-[#d5a24e]" />
              </div>
              <div className="space-y-2">
                <label htmlFor="worship-phone" className="text-sm font-medium text-[#f1e8dc]">Phone number</label>
                <Input id="worship-phone" type="tel" autoComplete="tel" required value={form.phone} onChange={updateField("phone")} placeholder="+234 ..." className="h-12 rounded-xl border-white/15 bg-white/[0.06] text-white placeholder:text-[#98897b] focus-visible:ring-[#d5a24e]" />
              </div>
              {error && (
                <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-[#d5a24e] font-semibold text-[#1b100b] hover:bg-[#edc675]"
              >
                {isSubmitting ? "Reserving your place..." : "Complete registration"}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
              <p className="text-center text-xs text-[#a99989]">We’ll only use your details for this event registration.</p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function WorshipNightExperience() {
  const [registrationOpen, setRegistrationOpen] = useState(false)

  return (
    <main className="overflow-hidden bg-[#110c0b] text-[#f8f1e8]">
      <section className="relative isolate min-h-[calc(100svh-88px)] overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_75%_25%,rgba(179,82,37,0.28),transparent_42%),linear-gradient(125deg,#110c0b_5%,#24120e_54%,#35180e_100%)]" />
        <div className="absolute -right-32 top-16 -z-10 h-96 w-96 rounded-full bg-[#b87934]/10 blur-3xl" />
        <div className="absolute -left-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#8f2f1b]/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e0b661]/70 to-transparent" />

        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-12 sm:px-8 md:min-h-[calc(100svh-88px)] md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16 lg:px-12">
          <div className="relative z-10 mx-auto w-full max-w-2xl space-y-8">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#d2ae78] transition hover:text-[#f3d194]">
              <span className="h-px w-8 bg-[#d2ae78]" />
              The Soaking Room presents
            </Link>

            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e1bd76]/30 bg-[#e1bd76]/[0.08] px-3 py-1.5 text-xs font-medium text-[#f1d9aa]">
                <Sparkles className="h-3.5 w-3.5" />
                One night. One offering. One worship.
              </div>
              <h1 className="font-serif text-6xl font-semibold leading-[0.92] tracking-[-0.055em] text-[#fff8ed] sm:text-7xl lg:text-[6.8rem]">
                Worship
                <span className="mt-1 block bg-gradient-to-r from-[#f1d28c] via-[#c98b45] to-[#f0c778] bg-clip-text text-transparent">
                  Night
                </span>
              </h1>
              <p className="flex items-center gap-3 text-lg font-light tracking-[0.06em] text-[#dfcbb2] sm:text-xl">
                <span className="h-px w-8 bg-[#9c4931]" />
                With Moses Akoh
              </p>
              <p className="max-w-xl text-base leading-7 text-[#cdbfb1] sm:text-lg sm:leading-8">
                An invitation to lay everything down, lift one sound, and meet with God in the beauty of worship.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => setRegistrationOpen(true)}
                className="group h-14 rounded-full bg-gradient-to-r from-[#edc775] to-[#c88a3d] px-7 text-base font-bold text-[#1a100a] shadow-[0_12px_45px_rgba(206,151,69,0.22)] transition hover:brightness-110"
              >
                <Ticket className="mr-2 h-5 w-5" />
                Register to attend
                <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <a
                href="#the-night"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/15 px-7 text-sm font-medium text-[#f3e8d9] transition hover:border-[#d7b46f]/50 hover:bg-white/[0.04]"
              >
                Discover the night
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
              {eventFacts.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm leading-5 text-[#e0d2c2]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d4aa5c]/25 bg-[#d4aa5c]/[0.08] text-[#e8c77e]">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[490px] md:ml-auto">
            <div className="absolute -inset-5 rounded-[2rem] border border-[#d4aa5c]/20 rotate-3" />
            <div className="absolute -inset-2 rounded-[1.8rem] bg-gradient-to-br from-[#d9a752]/20 via-transparent to-[#8e311d]/20 blur-xl" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-[#d9b46e]/35 bg-[#26150f] p-2 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
              <Image
                src="/worship-night.jpeg"
                alt="Worship Night with Moses Akoh, Sunday 29 November at 4 PM WAT in Utako, Abuja"
                width={1016}
                height={1280}
                priority
                sizes="(max-width: 768px) 90vw, 42vw"
                className="h-auto w-full rounded-[1.15rem]"
              />
            </div>
            <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#211510]/95 px-4 py-3 shadow-xl backdrop-blur md:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b4462b]/20 text-[#e88562]">
                <Music2 className="h-5 w-5" />
              </span>
              <span className="text-xs leading-5 text-[#d9c9b7]">
                <span className="block font-semibold text-white">Come as you are</span>
                Leave with your heart turned toward Him
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#110c0b] to-transparent" />
      </section>

      <section id="the-night" className="relative border-y border-white/[0.07] bg-[#17100d]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:items-center md:py-24 lg:px-12">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d5a24e]">An invitation to worship</p>
            <h2 className="font-serif text-4xl leading-tight text-[#fff5e7] sm:text-5xl">
              Bring your whole heart.
              <span className="block text-[#d5a24e]">Bring your worship.</span>
            </h2>
            <p className="max-w-lg leading-7 text-[#b9a99a]">
              Gather with us for an evening of repentance, praise and heartfelt worship, led by Moses Akoh.
              Come ready to encounter God together.
            </p>
            <Button
              type="button"
              onClick={() => setRegistrationOpen(true)}
              variant="outline"
              className="mt-2 h-12 rounded-full border-[#b98a4a]/50 bg-transparent px-6 text-[#f1d9aa] hover:bg-[#d5a24e]/10 hover:text-white"
            >
              Save my place
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-[#d5a24e]/20 bg-gradient-to-br from-[#332015] to-[#20140f] p-6 sm:col-span-2 sm:p-8">
              <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#d5a24e]/10 text-[#e9c77e]">
                <CalendarDays className="h-5 w-5" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9955f]">Gather with us</p>
              <p className="mt-2 text-xl font-semibold text-[#fff4e4]">Sunday, 29 November 2026</p>
              <p className="mt-1 text-sm text-[#c3ad96]">Begins at 4:00 PM WAT</p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
              <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#a83c25]/15 text-[#e98968]">
                <MapPin className="h-5 w-5" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9955f]">Meet us in Abuja</p>
              <p className="mt-2 font-semibold text-[#fff4e4]">Celeb8 Centre</p>
              <p className="mt-1 text-sm leading-6 text-[#c3ad96]">Utako, Abuja, Nigeria</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Celeb8+Centre+Utako+Abuja"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#e5bd6d] hover:text-[#f5d895]"
              >
                Get directions <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
              <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#a83c25]/15 text-[#e98968]">
                <Youtube className="h-5 w-5" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9955f]">Can’t join in person?</p>
              <p className="mt-2 font-semibold text-[#fff4e4]">Join us live</p>
              <p className="mt-1 text-sm leading-6 text-[#c3ad96]">“Moses Akoh” on YouTube.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#e5bd6d]">
                Live stream · Moses Akoh <Play className="h-3.5 w-3.5 fill-current" />
              </span>
            </article>

            <article className="rounded-2xl border border-[#a83c25]/25 bg-[#5b2418]/15 p-6 sm:col-span-2 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#a83c25]/20 text-[#ee9877]">
                  <Heart className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d88869]">A posture of reverence</p>
                  <p className="mt-2 font-semibold text-[#fff4e4]">Come dressed in sackcloth</p>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-[#c3ad96]">
                    As we repent, worship and praise the Lord.
                  </p>
                </div>
              </div>
              <Link
                href="/worship-night-donate"
                className="mt-5 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#e5bd6d] hover:text-[#f5d895] sm:mt-0"
              >
                Support the night <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#110c0b] px-5 py-20 text-center sm:px-8 md:py-28">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b87934]/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl space-y-6">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d5a24e]/30 text-[#e5bd6d]">
            <Sparkles className="h-5 w-5" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d5a24e]">Your seat is waiting</p>
          <h2 className="font-serif text-4xl leading-tight text-[#fff5e7] sm:text-6xl">
            Let worship be your answer.
          </h2>
          <p className="mx-auto max-w-xl leading-7 text-[#b9a99a]">
            Make room for an evening set apart for the presence of God. Register now and receive your event ticket by email.
          </p>
          <Button
            type="button"
            onClick={() => setRegistrationOpen(true)}
            className="h-14 rounded-full bg-gradient-to-r from-[#edc775] to-[#c88a3d] px-8 text-base font-bold text-[#1a100a] shadow-[0_12px_45px_rgba(206,151,69,0.18)] hover:brightness-110"
          >
            <Ticket className="mr-2 h-5 w-5" />
            Register for Worship Night
            <ArrowRight className="ml-3 h-4 w-4" />
          </Button>
        </div>
      </section>

      <a
        href="#the-night"
        className="fixed bottom-4 right-4 z-40 hidden items-center gap-2 rounded-full border border-[#e4c47c]/20 bg-[#1b120e]/90 px-4 py-2 text-xs font-medium text-[#e9d7bb] shadow-lg backdrop-blur sm:inline-flex md:hidden"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#e4c47c]" />
        Nov 29 · 4 PM
      </a>

      <RegistrationDialog open={registrationOpen} onOpenChange={setRegistrationOpen} />
    </main>
  )
}
