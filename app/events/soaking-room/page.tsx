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
import Image from "next/image"
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
  Waves,
  Eye,
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
      const response = await fetch("/api/events/soaking-room/register", {
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
        className="sm:max-w-md rounded-2xl"
        style={{ backgroundColor: "#F2F7F6", borderColor: "#BFE3DE" }}
      >
        {registered ? (
          <div className="py-8 text-center space-y-6">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto"
              style={{ backgroundColor: "#BFE3DE" }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: "#2C7A78" }} />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl" style={{ color: "#123F3B" }}>
                You&apos;re Registered! 🎉
              </DialogTitle>
              <DialogDescription className="text-base" style={{ color: "#2E5B57" }}>
                Thank you, <span className="font-semibold" style={{ color: "#0F3D3A" }}>{formState.name}</span>!
              </DialogDescription>
            </div>
            <div
              className="rounded-xl p-5 space-y-2 text-left"
              style={{
                border: "1px solid #BFE3DE",
                background: "linear-gradient(135deg, #F2F7F6, #E2F0EE)",
              }}
            >
              <div className="flex items-center gap-2 text-sm">
                <Ticket className="w-4 h-4 shrink-0" style={{ color: "#2C7A78" }} />
                <span className="font-semibold" style={{ color: "#0F3D3A" }}>
                  The Soaking Room
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "#2E5B57" }}>
                <CalendarDays className="w-4 h-4 shrink-0" />
                <span>Sunday 18th October, 2026</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "#2E5B57" }}>
                <Clock className="w-4 h-4 shrink-0" />
                <span>4:00 PM Prompt</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "#2E5B57" }}>
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Charis Hub, Atlantic Mall, Utako, Abuja</span>
              </div>
            </div>
            <p className="text-sm" style={{ color: "#2E5B57" }}>
              Your ticket has been sent to{" "}
              <span className="font-medium" style={{ color: "#0F3D3A" }}>
                {formState.email}
              </span>
              . Please check your inbox (and spam folder).
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full rounded-xl font-medium border-0"
              size="lg"
              style={{ backgroundColor: "#2C7A78", color: "#fff" }}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl" style={{ color: "#0F3D3A" }}>
                Register for The Soaking Room
              </DialogTitle>
              <DialogDescription style={{ color: "#2E5B57" }}>
                Enter your details to secure your spot.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 py-2">
              <div className="space-y-2">
                <label htmlFor="modal-name" className="text-sm font-medium" style={{ color: "#0F3D3A" }}>
                  Full Name <span style={{ color: "#2C7A78" }}>*</span>
                </label>
                <Input
                  id="modal-name"
                  type="text"
                  placeholder="Your full name"
                  value={formState.name}
                  onChange={handleChange("name")}
                  required
                  className="border-[#BFE3DE] focus-visible:ring-[#2C7A78]"
                  style={{ backgroundColor: "#fff" }}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="modal-email" className="text-sm font-medium" style={{ color: "#0F3D3A" }}>
                  Email Address <span style={{ color: "#2C7A78" }}>*</span>
                </label>
                <Input
                  id="modal-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formState.email}
                  onChange={handleChange("email")}
                  required
                  className="border-[#BFE3DE] focus-visible:ring-[#2C7A78]"
                  style={{ backgroundColor: "#fff" }}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="modal-phone" className="text-sm font-medium" style={{ color: "#0F3D3A" }}>
                  Phone Number <span style={{ color: "#2C7A78" }}>*</span>
                </label>
                <Input
                  id="modal-phone"
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={formState.phone}
                  onChange={handleChange("phone")}
                  required
                  className="border-[#BFE3DE] focus-visible:ring-[#2C7A78]"
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
                  background: "linear-gradient(135deg, #2C7A78, #164E4A)",
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
                    Register Now
                  </span>
                )}
              </Button>

              <p className="text-xs text-center" style={{ color: "#2E5B57" }}>
                You will receive a confirmation email with your event ticket.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Floating ripples ────────────────────────────────────────────────────────

function FloatingRipples() {
  const ripples = [
    { top: "10%", left: "5%", size: 12, delay: 0, duration: 8, opacity: 0.15 },
    { top: "25%", right: "8%", size: 8, delay: 2, duration: 10, opacity: 0.12 },
    { top: "60%", left: "3%", size: 14, delay: 4, duration: 9, opacity: 0.1 },
    { top: "75%", right: "5%", size: 10, delay: 1, duration: 11, opacity: 0.13 },
    { top: "40%", left: "10%", size: 6, delay: 3, duration: 7, opacity: 0.08 },
    { top: "50%", right: "12%", size: 11, delay: 5, duration: 12, opacity: 0.1 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {ripples.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            width: p.size,
            height: p.size,
            backgroundColor: "#2C7A78",
            opacity: p.opacity,
            animation: `drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-20px) scale(1.1); }
          50% { transform: translateY(-10px) scale(0.9); }
          75% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

// ── Section data ────────────────────────────────────────────────────────────

const experienceItems = [
  { emoji: "🌊", label: "Soaking Worship" },
  { emoji: "🙏", label: "Prayer" },
  { emoji: "🕊️", label: "Stillness Before God" },
  { emoji: "❤️", label: "Encounter" },
  { emoji: "✨", label: "Restoration" },
  { emoji: "🌿", label: "Renewal" },
]

const benefitItems = [
  { emoji: "🌊", label: "Rest Deeply", icon: Waves },
  { emoji: "❤️", label: "Worship Freely", icon: Heart },
  { emoji: "👁️", label: "Hear God Clearly", icon: Eye },
  { emoji: "🌿", label: "Be Renewed", icon: Sprout },
]

const vibeItems = ["Warm", "Still", "Deep", "Peaceful", "Presence-filled"]

const expectItems = [
  "An atmosphere of rest",
  "Extended worship",
  "Quiet reflection",
  "Ministration & prayer",
  "Spiritual refreshment",
]

const comeAsYouAreItems = ["Leave Refreshed", "You are welcome here"]

// ── Main Page ───────────────────────────────────────────────────────────────

export default function SoakingRoomPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F2F7F6" }}>
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #F2F7F6 0%, #E2F0EE 30%, #CFE8E4 60%, #E2F0EE 100%)",
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(44,122,120,0.2) 0%, transparent 70%)",
            animation: "glow-pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(127,200,194,0.25) 0%, transparent 70%)",
            animation: "glow-pulse 8s ease-in-out 2s infinite",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(44,122,120,0.14) 0%, transparent 70%)",
            animation: "glow-pulse 7s ease-in-out 4s infinite",
          }}
        />

        {/* Decorative top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(90deg, transparent, #2C7A78, #7FC8C2, #2C7A78, transparent)",
          }}
        />

        <FloatingRipples />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8">
              <p
                className="font-medium tracking-[0.2em] text-sm uppercase"
                style={{ color: "#2C7A78" }}
              >
                A Sacred Gathering
              </p>

              {/* Main heading */}
              <div className="relative">
                <h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
                  style={{ color: "#0F3D3A" }}
                >
                  THE{" "}
                  <span className="italic font-bold" style={{ color: "#2C7A78" }}>
                    SOAKING
                  </span>{" "}
                  ROOM
                </h1>
              </div>

              {/* Subheading */}
              <p
                className="text-xl md:text-2xl font-light leading-relaxed"
                style={{ color: "#0F3D3A" }}
              >
                Come away and soak in His presence
              </p>

              {/* Tagline */}
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: "#2E5B57" }}
              >
                An afternoon of deep worship, stillness and encounter with God.
              </p>

              {/* YOU BELONG HERE */}
              <div
                className="w-full sm:w-auto text-center sm:text-left px-8 py-4 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(44,122,120,0.12), rgba(127,200,194,0.12))",
                  border: "1px solid rgba(44,122,120,0.25)",
                }}
              >
                <p
                  className="text-xl md:text-2xl font-bold tracking-wider"
                  style={{ color: "#2C7A78" }}
                >
                  YOU BELONG HERE
                </p>
              </div>

              {/* Date / Time badges */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl w-full sm:w-auto"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(191,227,222,0.8)",
                  }}
                >
                  <CalendarDays className="w-5 h-5 shrink-0" style={{ color: "#2C7A78" }} />
                  <div>
                    <p className="font-medium text-sm" style={{ color: "#0F3D3A" }}>
                      Sunday 18th October, 2026
                    </p>
                    <p className="text-xs" style={{ color: "#2E5B57" }}>
                      Mark your calendar
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl w-full sm:w-auto"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(191,227,222,0.8)",
                  }}
                >
                  <Clock className="w-5 h-5 shrink-0" style={{ color: "#2C7A78" }} />
                  <div>
                    <p className="font-medium text-sm" style={{ color: "#0F3D3A" }}>
                      Time: 4:00 PM Prompt
                    </p>
                    <p className="text-xs" style={{ color: "#2E5B57" }}>
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
                  border: "1px solid rgba(191,227,222,0.6)",
                }}
              >
                <MapPin className="w-5 h-5 shrink-0" style={{ color: "#2C7A78" }} />
                <div>
                  <p className="font-medium text-sm" style={{ color: "#0F3D3A" }}>
                    Charis Hub, Atlantic Mall
                  </p>
                  <p className="text-xs" style={{ color: "#2E5B57" }}>
                    Utako, Abuja
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={() => setModalOpen(true)}
                className="font-medium rounded-xl px-10 py-7 text-lg shadow-lg border-0"
                size="lg"
                style={{
                  background: "linear-gradient(135deg, #2C7A78, #164E4A)",
                  color: "#fff",
                  boxShadow: "0 8px 32px rgba(44,122,120,0.35)",
                }}
              >
                <Ticket className="w-5 h-5 mr-3" />
                Register Now
              </Button>
            </div>

            {/* Right: Flyer */}
            <div className="relative flex justify-center">
              <div
                className="absolute inset-0 rounded-[32px]"
                style={{
                  background: "linear-gradient(135deg, rgba(44,122,120,0.16), rgba(127,200,194,0.16))",
                  border: "1px solid rgba(44,122,120,0.25)",
                  transform: "rotate(3deg)",
                }}
              />
              <div
                className="relative w-full max-w-md rounded-[32px] overflow-hidden"
                style={{
                  border: "1px solid rgba(191,227,222,0.9)",
                  boxShadow: "0 24px 64px rgba(15,61,58,0.18)",
                }}
              >
                <Image
                  src="/soaking-room.webp"
                  alt="The Soaking Room event flyer"
                  width={864}
                  height={1080}
                  priority
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #F2F7F6, transparent)",
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
                  backgroundColor: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(191,227,222,0.7)",
                }}
              >
                <span className="text-lg md:text-xl shrink-0">{item.emoji}</span>
                <span className="text-xs md:text-sm font-medium leading-snug" style={{ color: "#0F3D3A" }}>
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
              backgroundColor: "rgba(44,122,120,0.08)",
              border: "1px solid rgba(44,122,120,0.18)",
            }}
          >
            <Quote className="w-8 h-8 md:w-10 md:h-10 mx-auto" style={{ color: "#2C7A78", opacity: 0.5 }} />
            <p
              className="text-lg md:text-2xl lg:text-3xl font-light italic leading-relaxed"
              style={{ color: "#0F3D3A" }}
            >
              &ldquo;Be still, and know that I am God.&rdquo;
            </p>
            <p className="text-sm font-semibold tracking-wide" style={{ color: "#2C7A78" }}>
              — PSALM 46:10
            </p>
          </div>
        </div>
      </section>

      {/* ── THIS IS YOUR TIME TO… ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-10">
          <h2
            className="text-2xl md:text-4xl font-bold text-center tracking-tight"
            style={{ color: "#0F3D3A" }}
          >
            THIS IS YOUR TIME TO&hellip;
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {benefitItems.map(({ emoji, label, icon: Icon }) => (
              <div
                key={label}
                className="group text-center space-y-3 md:space-y-4 px-3 md:px-4 py-6 md:py-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 h-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(191,227,222,0.7)",
                }}
              >
                <div
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, rgba(44,122,120,0.12), rgba(127,200,194,0.12))",
                    border: "1px solid rgba(44,122,120,0.2)",
                  }}
                >
                  <Icon className="w-5 h-5 md:w-7 md:h-7" style={{ color: "#2C7A78" }} />
                </div>
                <p className="text-sm md:text-base font-medium" style={{ color: "#0F3D3A" }}>
                  {emoji} {label}
                </p>
              </div>
            ))}
          </div>

          {/* Mood tagline */}
          <p
            className="text-center text-xs md:text-sm tracking-[0.2em] md:tracking-[0.25em] uppercase font-light"
            style={{ color: "#2C7A78" }}
          >
            still &bull; soft &bull; sacred &bull; soaking
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
              backgroundColor: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(191,227,222,0.7)",
            }}
          >
            <h3 className="text-lg font-bold tracking-wide" style={{ color: "#2C7A78" }}>
              THE VIBE
            </h3>
            <ul className="space-y-3">
              {vibeItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "#2C7A78" }}
                  />
                  <span className="text-sm" style={{ color: "#0F3D3A" }}>
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
              backgroundColor: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(191,227,222,0.7)",
            }}
          >
            <h3 className="text-lg font-bold tracking-wide" style={{ color: "#2C7A78" }}>
              WHAT TO EXPECT
            </h3>
            <ul className="space-y-3">
              {expectItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "#2C7A78" }}
                  />
                  <span className="text-sm" style={{ color: "#0F3D3A" }}>
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
              backgroundColor: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(191,227,222,0.7)",
            }}
          >
            <h3 className="text-lg font-bold tracking-wide" style={{ color: "#2C7A78" }}>
              COME AS YOU ARE
            </h3>
            <ul className="space-y-3">
              {comeAsYouAreItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "#2C7A78" }}
                  />
                  <span className="text-sm" style={{ color: "#0F3D3A" }}>
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
              background: "linear-gradient(135deg, rgba(44,122,120,0.1), rgba(127,200,194,0.1))",
              border: "1px solid rgba(44,122,120,0.15)",
            }}
          >
            <p
              className="text-sm sm:text-lg md:text-xl font-light tracking-[0.1em] sm:tracking-[0.15em] leading-relaxed"
              style={{ color: "#0F3D3A" }}
            >
              BE STILL &bull; SOAK IN HIS PRESENCE &bull; LEAVE REFRESHED.
            </p>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 pb-24">
        <div className="text-center space-y-6">
          <h3 className="text-2xl md:text-4xl font-bold" style={{ color: "#0F3D3A" }}>
            Don&apos;t Miss This Moment
          </h3>
          <p className="max-w-md mx-auto text-sm md:text-base" style={{ color: "#2E5B57" }}>
            Secure your spot today and come ready to soak in the presence of God.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => setModalOpen(true)}
              className="font-medium rounded-xl px-8 md:px-10 py-6 md:py-7 text-base md:text-lg shadow-lg border-0 w-full sm:w-auto"
              size="lg"
              style={{
                background: "linear-gradient(135deg, #2C7A78, #164E4A)",
                color: "#fff",
                boxShadow: "0 8px 32px rgba(44,122,120,0.35)",
              }}
            >
              <Sparkles className="w-5 h-5 mr-3" />
              Register Now
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
