"use client"

import { useState, type FormEvent } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle,
  Music,
  Heart,
  Droplets,
  ArrowLeft,
  Ticket,
} from "lucide-react"

function RegistrationModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { toast } = useToast()
  const [formState, setFormState] = useState({ name: "", email: "", phone: "" })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [registered, setRegistered] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/events/spirit-spa/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Something went wrong.")
        setSubmitting(false)
        return
      }

      setRegistered(true)
      toast({
        title: "Registration successful! 🎉",
        description: `Your ticket has been sent to ${formState.email}.`,
      })
    } catch {
      setError("Network error. Please check your connection and try again.")
      setSubmitting(false)
    }
  }

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      // Reset after modal animation completes
      setTimeout(() => {
        setRegistered(false)
        setFormState({ name: "", email: "", phone: "" })
        setError("")
      }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl">
        {registered ? (
          <div className="py-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl">You're Registered! 🎉</DialogTitle>
              <DialogDescription className="text-base">
                Thank you, <span className="font-semibold text-foreground">{formState.name}</span>!
              </DialogDescription>
            </div>
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-5 space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm">
                <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">TSR presents the Spirit Spa</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="w-4 h-4 shrink-0" />
                <span>August 29th, 2026</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>ATW Center, CBD Abuja</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your ticket has been sent to <span className="font-medium text-foreground">{formState.email}</span>.
              Please check your inbox (and spam folder).
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full rounded-xl" size="lg">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Register for Spirit Spa</DialogTitle>
              <DialogDescription>
                Enter your details to secure your free spot.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 py-2">
              <div className="space-y-2">
                <label htmlFor="modal-name" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="modal-name"
                  type="text"
                  placeholder="Your full name"
                  value={formState.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="modal-email" className="text-sm font-medium">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  id="modal-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formState.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="modal-phone" className="text-sm font-medium">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <Input
                  id="modal-phone"
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={formState.phone}
                  onChange={handleChange("phone")}
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 rounded-xl"
                size="lg"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Register for Free
                  </span>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                You will receive a confirmation email with your event ticket.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function SpiritSpaPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
          <Link href="/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Events
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent" />

        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                Special Event
              </div>

              <div className="space-y-4">
                <p className="text-emerald-300 font-semibold tracking-widest text-sm uppercase">The Soaking Room Presents</p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  The <span className="text-emerald-300">Spirit</span> Spa
                </h1>
                <p className="text-lg md:text-xl text-emerald-100/80 max-w-lg leading-relaxed">
                  A sacred gathering for worship, prayer, and spiritual refreshment. Come and be renewed in the presence of God.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <CalendarDays className="w-5 h-5 text-emerald-300" />
                  <div>
                    <p className="text-white font-semibold text-sm">August 29th, 2026</p>
                    <p className="text-emerald-200/70 text-xs">Mark your calendar</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <Clock className="w-5 h-5 text-emerald-300" />
                  <div>
                    <p className="text-white font-semibold text-sm">Gate opens: 9:00 AM</p>
                    <p className="text-emerald-200/70 text-xs">Be on time</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 max-w-md">
                <MapPin className="w-5 h-5 text-emerald-300 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">ATW Center</p>
                  <p className="text-emerald-200/70 text-xs">Central Business District, Abuja</p>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl px-10 py-7 text-lg shadow-xl shadow-emerald-900/30"
                size="lg"
              >
                <Ticket className="w-5 h-5 mr-3" />
                Register Now — Free Entry
              </Button>
            </div>

            {/* Right: Visual / Image placeholder */}
            <div className="relative hidden md:block">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-emerald-400/20 via-teal-400/10 to-emerald-600/20 border border-white/20 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-300/30">
                      <Droplets className="w-14 h-14 text-emerald-300" />
                    </div>
                    <p className="text-white/60 text-sm font-medium">Event Image</p>
                    <p className="text-white/40 text-xs">Add your image here</p>
                  </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">About This Event</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed max-w-3xl">
              <p>
                The Soaking Room presents <strong className="text-foreground">The Spirit Spa</strong> — a transformative
                day of worship, prayer, and spiritual rejuvenation. Step away from the noise of everyday life and
                immerse yourself in the refreshing presence of the Holy Spirit.
              </p>
              <p>
                This is more than an event; it is an encounter. Come expectant, come ready to soak in worship,
                receive ministry, and experience a deep renewal of your spirit.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Music, label: "Worship", desc: "Extended worship & ministration" },
              { icon: Heart, label: "Prayer", desc: "Personal prayer & ministry time" },
              { icon: Droplets, label: "Refresh", desc: "Spiritual refreshment & renewal" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 max-w-lg">
            <h3 className="font-semibold text-lg">Event Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CalendarDays className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">Saturday, August 29th, 2026</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-muted-foreground">Gates open at 9:00 AM — Arrive early</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Venue</p>
                  <p className="text-muted-foreground">ATW Center, Central Business District, Abuja</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center space-y-4 py-8">
            <h3 className="text-2xl font-bold">Don't Miss This Moment</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Entry is free. Secure your spot today and come ready to encounter God.
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl px-10 py-7 text-lg shadow-xl"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-3" />
              Register for Free
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Registration Modal */}
      <RegistrationModal open={modalOpen} onOpenChange={setModalOpen} />
    </main>
  )
}
