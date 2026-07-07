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
  Heart,
  ArrowLeft,
  Ticket,
  Flower2,
  Eye,
  Crown,
  Sprout,
  Quote,
} from "lucide-react"

// ── Registration Modal ──────────────────────────────────────────────────────

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
        title: "You're in! 🎉",
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
      setTimeout(() => {
        setRegistered(false)
        setFormState({ name: "", email: "", phone: "" })
        setError("")
      }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded-2xl border-[#E8D5C8]"
        style={{ backgroundColor: "#F8F1E9" }}
      >
        {registered ? (
          <div className="py-8 text-center space-y-6">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto"
              style={{ backgroundColor: "#E8D5C8" }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: "#C9A66B" }} />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl" style={{ color: "#5A4A3A" }}>
                You&apos;re Registered! 🎉
              </DialogTitle>
              <DialogDescription className="text-base" style={{ color: "#5A4A3A" }}>
                Thank you, <span className="font-semibold" style={{ color: "#3D2E24" }}>{formState.name}</span>!
              </DialogDescription>
            </div>
            <div
              className="rounded-xl p-5 space-y-2 text-left"
              style={{
                border: "1px solid #E8D5C8",
                background: "linear-gradient(135deg, #F8F1E9, #F0E6D8)",
              }}
            >
              <div className="flex items-center gap-2 text-sm">
                <Ticket className="w-4 h-4 shrink-0" style={{ color: "#C9A66B" }} />
                <span className="font-semibold" style={{ color: "#3D2E24" }}>
                  TSR presents the Spirit Spa
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "#5A4A3A" }}>
                <CalendarDays className="w-4 h-4 shrink-0" />
                <span>August 29th, 2026</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "#5A4A3A" }}>
                <MapPin className="w-4 h-4 shrink-0" />
                <span>ATW Center, CBD Abuja</span>
              </div>
            </div>
            <p className="text-sm" style={{ color: "#5A4A3A" }}>
              Your ticket has been sent to{" "}
              <span className="font-medium" style={{ color: "#3D2E24" }}>
                {formState.email}
              </span>
              . Please check your inbox (and spam folder).
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full rounded-xl font-medium border-0"
              size="lg"
              style={{ backgroundColor: "#D8A8A0", color: "#fff" }}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl" style={{ color: "#3D2E24" }}>
                Register for Spirit Spa
              </DialogTitle>
              <DialogDescription style={{ color: "#5A4A3A" }}>
                Enter your details to secure your free spot.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 py-2">
              <div className="space-y-2">
                <label htmlFor="modal-name" className="text-sm font-medium" style={{ color: "#3D2E24" }}>
                  Full Name <span style={{ color: "#D8A8A0" }}>*</span>
                </label>
                <Input
                  id="modal-name"
                  type="text"
                  placeholder="Your full name"
                  value={formState.name}
                  onChange={handleChange("name")}
                  required
                  className="border-[#E8D5C8] focus-visible:ring-[#D8A8A0]"
                  style={{ backgroundColor: "#fff" }}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="modal-email" className="text-sm font-medium" style={{ color: "#3D2E24" }}>
                  Email Address <span style={{ color: "#D8A8A0" }}>*</span>
                </label>
                <Input
                  id="modal-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formState.email}
                  onChange={handleChange("email")}
                  required
                  className="border-[#E8D5C8] focus-visible:ring-[#D8A8A0]"
                  style={{ backgroundColor: "#fff" }}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="modal-phone" className="text-sm font-medium" style={{ color: "#3D2E24" }}>
                  Phone Number <span style={{ color: "#D8A8A0" }}>*</span>
                </label>
                <Input
                  id="modal-phone"
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={formState.phone}
                  onChange={handleChange("phone")}
                  required
                  className="border-[#E8D5C8] focus-visible:ring-[#D8A8A0]"
                  style={{ backgroundColor: "#fff" }}
                />
              </div>

              {error && (
                <div
                  className="rounded-lg px-4 py-3 text-sm"
                  style={{
                    backgroundColor: "#FDF0EE",
                    border: "1px solid #F5D0C9",
                    color: "#C76A5E",
                  }}
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full font-medium py-6 rounded-xl border-0"
                size="lg"
                style={{
                  background: "linear-gradient(135deg, #D8A8A0, #C9A66B)",
                  color: "#fff",
                }}
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

              <p className="text-xs text-center" style={{ color: "#5A4A3A" }}>
                You will receive a confirmation email with your event ticket.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Floating petals ─────────────────────────────────────────────────────────

function FloatingPetals() {
  const petals = [
    { top: "10%", left: "5%", size: 12, delay: 0, duration: 8, opacity: 0.15 },
    { top: "25%", right: "8%", size: 8, delay: 2, duration: 10, opacity: 0.12 },
    { top: "60%", left: "3%", size: 14, delay: 4, duration: 9, opacity: 0.1 },
    { top: "75%", right: "5%", size: 10, delay: 1, duration: 11, opacity: 0.13 },
    { top: "40%", left: "10%", size: 6, delay: 3, duration: 7, opacity: 0.08 },
    { top: "50%", right: "12%", size: 11, delay: 5, duration: 12, opacity: 0.1 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {petals.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            width: p.size,
            height: p.size,
            backgroundColor: "#D8A8A0",
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-20px) rotate(90deg) scale(1.1); }
          50% { transform: translateY(-10px) rotate(180deg) scale(0.9); }
          75% { transform: translateY(-30px) rotate(270deg) scale(1.05); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

// ── Experience item data ────────────────────────────────────────────────────

const experienceItems = [
  { emoji: "❤️", label: "Worship" },
  { emoji: "✨", label: "Prayer" },
  { emoji: "🕊️", label: "Prophetic Encouragement" },
  { emoji: "👑", label: "Sisterhood" },
  { emoji: "❤️", label: "Restoration" },
  { emoji: "✨", label: "Renewal" },
]

const benefitItems = [
  { emoji: "❤️", label: "Worship Freely", icon: Heart },
  { emoji: "✨", label: "Hear God Clearly", icon: Eye },
  { emoji: "🌿", label: "Heal Deeply", icon: Sprout },
  { emoji: "👑", label: "Walk Boldly", icon: Crown },
]

const vibeItems = ["Warm", "Intimate", "Elegant", "Peaceful", "Empowering"]

const expectItems = [
  "An atmosphere of rest",
  "Heartfelt worship",
  "Prophetic words",
  "Real connection",
  "Spiritual refreshment",
]

const comeAsYouAreItems = ["Leave Refreshed. 💕", "You are welcome here"]

// ── Main Page ───────────────────────────────────────────────────────────────

export default function SpiritSpaPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F8F1E9" }}>
      <Header />

      {/* Back link */}
      {/* <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="hover:bg-transparent"
          style={{ color: "#5A4A3A" }}
        >
          <Link href="/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Events
          </Link>
        </Button>
      </div> */}

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #F8F1E9 0%, #F0E6D8 30%, #E8D5C8 60%, #F0E6D8 100%)",
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(216,168,160,0.3) 0%, transparent 70%)",
            animation: "glow-pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(201,166,107,0.2) 0%, transparent 70%)",
            animation: "glow-pulse 8s ease-in-out 2s infinite",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(216,168,160,0.2) 0%, transparent 70%)",
            animation: "glow-pulse 7s ease-in-out 4s infinite",
          }}
        />

        {/* Decorative top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(90deg, transparent, #D8A8A0, #C9A66B, #D8A8A0, transparent)",
          }}
        />

        <FloatingPetals />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8">
              {/* Presenting label */}
              <p
                className="font-medium tracking-[0.2em] text-sm uppercase"
                style={{ color: "#C9A66B" }}
              >
                The Soaking Room Presents
              </p>

              {/* Main heading */}
              <div className="relative">
                <h1
                  className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
                  style={{ color: "#3D2E24" }}
                >
                  THE{" "}
                  <span className="italic font-bold" style={{ color: "#D8A8A0" }}>
                    SPIRIT
                  </span>{" "}
                  SPA
                </h1>
              </div>

              {/* Subheading */}
              <p
                className="text-xl md:text-2xl font-light leading-relaxed"
                style={{ color: "#3D2E24" }}
              >
                A Time to Rejuvenate and Reawaken Your Spirit
              </p>

              {/* Tagline */}
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: "#5A4A3A" }}
              >
                An intimate worship and prophetic encounter for women.
              </p>

              {/* YOU BELONG HERE */}
              <div
                className="w-full sm:w-auto text-center sm:text-left px-8 py-4 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(216,168,160,0.15), rgba(201,166,107,0.1))",
                  border: "1px solid rgba(216,168,160,0.25)",
                }}
              >
                <p
                  className="text-xl md:text-2xl font-bold tracking-wider"
                  style={{ color: "#D8A8A0" }}
                >
                  YOU BELONG HERE
                </p>
              </div>

              {/* Date / Venue badges */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl w-full sm:w-auto"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(232,213,200,0.6)",
                  }}
                >
                  <CalendarDays className="w-5 h-5 shrink-0" style={{ color: "#D8A8A0" }} />
                  <div>
                    <p className="font-medium text-sm" style={{ color: "#3D2E24" }}>
                      August 29th, 2026
                    </p>
                    <p className="text-xs" style={{ color: "#5A4A3A" }}>
                      Mark your calendar
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl w-full sm:w-auto"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(232,213,200,0.6)",
                  }}
                >
                  <Clock className="w-5 h-5 shrink-0" style={{ color: "#D8A8A0" }} />
                  <div>
                    <p className="font-medium text-sm" style={{ color: "#3D2E24" }}>
                      Time: 5:00 PM
                    </p>
                    <p className="text-xs" style={{ color: "#5A4A3A" }}>
                      Be on time
                    </p>
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-xl max-w-md"
                style={{
                  backgroundColor: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(232,213,200,0.4)",
                }}
              >
                <MapPin className="w-5 h-5 shrink-0" style={{ color: "#D8A8A0" }} />
                <div>
                  <p className="font-medium text-sm" style={{ color: "#3D2E24" }}>
                    ATW Center
                  </p>
                  <p className="text-xs" style={{ color: "#5A4A3A" }}>
                    Central Business District, Abuja
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={() => setModalOpen(true)}
                className="font-medium rounded-xl px-10 py-7 text-lg shadow-lg border-0"
                size="lg"
                style={{
                  background: "linear-gradient(135deg, #D8A8A0, #C9A66B)",
                  color: "#fff",
                  boxShadow: "0 8px 32px rgba(216,168,160,0.35)",
                }}
              >
                <Ticket className="w-5 h-5 mr-3" />
                Register Now — Free Entry
              </Button>
            </div>

            {/* Right: Hero visual */}
            <div className="relative hidden md:block">
              <div
                className="absolute inset-0 rounded-[32px]"
                style={{
                  background: "linear-gradient(135deg, rgba(216,168,160,0.2), rgba(201,166,107,0.15))",
                  border: "1px solid rgba(232,213,200,0.5)",
                  transform: "rotate(3deg)",
                }}
              />
              <div
                className="relative aspect-square rounded-[32px] overflow-hidden"
                style={{
                  background: "linear-gradient(160deg, #F0E6D8, #E8D5C8, #F0E6D8)",
                  border: "1px solid rgba(232,213,200,0.6)",
                }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(216,168,160,0.15) 0%, transparent 70%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-5">
                    <div
                      className="inline-flex items-center justify-center w-32 h-32 rounded-full mx-auto"
                      style={{
                        background: "linear-gradient(135deg, rgba(216,168,160,0.2), rgba(201,166,107,0.15))",
                        border: "1px solid rgba(216,168,160,0.3)",
                      }}
                    >
                      <Flower2 className="w-16 h-16" style={{ color: "#D8A8A0", opacity: 0.7 }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: "#5A4A3A" }}>
                      Event Image
                    </p>
                    <p className="text-xs" style={{ color: "#C9A66B" }}>
                      Add your image here
                    </p>
                  </div>
                </div>
                <div
                  className="absolute top-8 left-8 w-16 h-16 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(201,166,107,0.2), transparent)",
                    animation: "glow-pulse 5s ease-in-out infinite",
                  }}
                />
                <div
                  className="absolute bottom-12 right-8 w-20 h-20 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(216,168,160,0.2), transparent)",
                    animation: "glow-pulse 7s ease-in-out 2s infinite",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #F8F1E9, transparent)",
          }}
        />
      </section>

      {/* ── EXPERIENCE GRID ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {experienceItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 md:px-5 py-4 rounded-xl transition-all duration-300 h-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(232,213,200,0.5)",
                }}
              >
                <span className="text-lg md:text-xl shrink-0">{item.emoji}</span>
                <span className="text-xs md:text-sm font-medium leading-snug" style={{ color: "#3D2E24" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE BLOCK ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-14 text-center space-y-5"
            style={{
              backgroundColor: "rgba(216,168,160,0.12)",
              border: "1px solid rgba(216,168,160,0.2)",
            }}
          >
            <Quote className="w-8 h-8 md:w-10 md:h-10 mx-auto" style={{ color: "#D8A8A0", opacity: 0.5 }} />
            <p
              className="text-lg md:text-2xl lg:text-3xl font-light italic leading-relaxed"
              style={{ color: "#3D2E24" }}
            >
              &ldquo;Come away by yourselves to a quiet place and rest awhile.&rdquo;
            </p>
            <p className="text-sm font-semibold tracking-wide" style={{ color: "#C9A66B" }}>
              — MARK 6:31
            </p>
          </div>
        </div>
      </section>

      {/* ── THIS IS YOUR TIME TO… ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-10">
          <h2
            className="text-2xl md:text-4xl font-bold text-center tracking-tight"
            style={{ color: "#3D2E24" }}
          >
            THIS IS YOUR TIME TO&hellip;
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {benefitItems.map(({ emoji, label, icon: Icon }) => (
              <div
                key={label}
                className="group text-center space-y-3 md:space-y-4 px-3 md:px-4 py-6 md:py-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 h-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(232,213,200,0.5)",
                }}
              >
                <div
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, rgba(216,168,160,0.15), rgba(201,166,107,0.1))",
                    border: "1px solid rgba(216,168,160,0.2)",
                  }}
                >
                  <Icon className="w-5 h-5 md:w-7 md:h-7" style={{ color: "#D8A8A0" }} />
                </div>
                <p className="text-sm md:text-base font-medium" style={{ color: "#3D2E24" }}>
                  {emoji} {label}
                </p>
              </div>
            ))}
          </div>

          {/* Mood tagline */}
          <p
            className="text-center text-xs md:text-sm tracking-[0.2em] md:tracking-[0.25em] uppercase font-light"
            style={{ color: "#C9A66B" }}
          >
            soft &bull; sacred &bull; powerful &bull; you
          </p>
        </div>
      </section>

      {/* ── THREE COLUMNS ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4 md:gap-6">
          {/* Column 1: THE VIBE */}
          <div
            className="rounded-2xl p-8 space-y-5"
            style={{
              backgroundColor: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(232,213,200,0.5)",
            }}
          >
            <h3 className="text-lg font-bold tracking-wide" style={{ color: "#D8A8A0" }}>
              THE VIBE
            </h3>
            <ul className="space-y-3">
              {vibeItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "#C9A66B" }}
                  />
                  <span className="text-sm" style={{ color: "#3D2E24" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: WHAT TO EXPECT */}
          <div
            className="rounded-2xl p-8 space-y-5"
            style={{
              backgroundColor: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(232,213,200,0.5)",
            }}
          >
            <h3 className="text-lg font-bold tracking-wide" style={{ color: "#D8A8A0" }}>
              WHAT TO EXPECT
            </h3>
            <ul className="space-y-3">
              {expectItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "#C9A66B" }}
                  />
                  <span className="text-sm" style={{ color: "#3D2E24" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: COME AS YOU ARE */}
          <div
            className="rounded-2xl p-8 space-y-5"
            style={{
              backgroundColor: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(232,213,200,0.5)",
            }}
          >
            <h3 className="text-lg font-bold tracking-wide" style={{ color: "#D8A8A0" }}>
              COME AS YOU ARE
            </h3>
            <ul className="space-y-3">
              {comeAsYouAreItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "#C9A66B" }}
                  />
                  <span className="text-sm" style={{ color: "#3D2E24" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CLOSING TAGLINE ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center space-y-6">
          <div
            className="inline-block w-full sm:w-auto px-6 sm:px-10 py-5 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(216,168,160,0.1), rgba(201,166,107,0.08))",
              border: "1px solid rgba(216,168,160,0.15)",
            }}
          >
            <p
              className="text-sm sm:text-lg md:text-xl font-light tracking-[0.1em] sm:tracking-[0.15em] leading-relaxed"
              style={{ color: "#3D2E24" }}
            >
              REST YOUR SOUL &bull; HEAR HIS VOICE &bull; WALK IN YOUR PURPOSE.
            </p>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 pb-24">
        <div className="text-center space-y-6">
          <h3 className="text-2xl md:text-4xl font-bold" style={{ color: "#3D2E24" }}>
            Don&apos;t Miss This Moment
          </h3>
          <p className="max-w-md mx-auto text-sm md:text-base" style={{ color: "#5A4A3A" }}>
            Entry is free. Secure your spot today and come ready to encounter God.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => setModalOpen(true)}
              className="font-medium rounded-xl px-8 md:px-10 py-6 md:py-7 text-base md:text-lg shadow-lg border-0 w-full sm:w-auto"
              size="lg"
              style={{
                background: "linear-gradient(135deg, #D8A8A0, #C9A66B)",
                color: "#fff",
                boxShadow: "0 8px 32px rgba(216,168,160,0.35)",
              }}
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
