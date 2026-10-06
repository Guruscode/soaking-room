import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  CalendarDays,
  Clock,
  Sparkles,
  Crown,
  UtensilsCrossed,
  ExternalLink,
  Ticket,
  Quote,
} from "lucide-react"

// ── Event details ───────────────────────────────────────────────────────────

const GOOGLE_FORM_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdyNIJY70dhFE_5HOmNrYK0LVw5fzi4XaIhIZcwcBoNVFciwA/viewform?embedded=true"

const GOOGLE_FORM_PUBLIC_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdyNIJY70dhFE_5HOmNrYK0LVw5fzi4XaIhIZcwcBoNVFciwA/viewform"

const experienceItems = [
  { emoji: "🍷", label: "An evening of fine worship" },
  { emoji: "👑", label: "Dining in the presence of the King" },
  { emoji: "📖", label: "The Word — Jesus, My Kingsman Redeemer" },
  { emoji: "🤝", label: "Communion & divine fellowship" },
]

// ── Main Page ───────────────────────────────────────────────────────────────

export default function KitchenInTheSkyPage() {
  return (
    <main className="min-h-screen bg-[#0B0919]">
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, #0B0919 0%, #17123A 35%, #1E1B4B 60%, #2B1A5E 100%)",
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 70%)",
            animation: "gold-pulse 7s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(124,92,255,0.16) 0%, transparent 70%)",
            animation: "gold-pulse 9s ease-in-out 2s infinite",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)",
            animation: "gold-pulse 8s ease-in-out 4s infinite",
          }}
        />

        {/* Decorative top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(90deg, transparent, #D4AF37, #F3E5AB, #D4AF37, transparent)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8">
              <p
                className="font-medium tracking-[0.2em] text-sm uppercase"
                style={{ color: "#D4AF37" }}
              >
                A Call to Dine with the Divine
              </p>

              <div className="relative">
                <h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white"
                >
                  A{" "}
                  <span
                    className="italic font-bold"
                    style={{
                      background: "linear-gradient(120deg, #F3E5AB, #D4AF37)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    KITCHEN
                  </span>{" "}
                  IN THE SKY
                </h1>
              </div>

              {/* Subheading */}
              <p
                className="text-xl md:text-2xl font-light leading-relaxed"
                style={{ color: "#F3E5AB" }}
              >
                Jesus, My Kingsman Redeemer
              </p>

              {/* Strictly by registration badge */}
              <div
                className="w-full sm:w-auto text-center sm:text-left px-8 py-4 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.14), rgba(124,92,255,0.1))",
                  border: "1px solid rgba(212,175,55,0.3)",
                }}
              >
                <p
                  className="text-lg md:text-xl font-bold tracking-wider flex items-center gap-3 justify-center sm:justify-start"
                  style={{ color: "#D4AF37" }}
                >
                  <Ticket className="w-5 h-5" />
                  STRICTLY BY REGISTRATION
                </p>
              </div>

              {/* Date / Time badges */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl w-full sm:w-auto"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(212,175,55,0.25)",
                  }}
                >
                  <CalendarDays className="w-5 h-5 shrink-0" style={{ color: "#D4AF37" }} />
                  <div>
                    <p className="font-medium text-sm text-white">Sunday, 1st November 2026</p>
                    <p className="text-xs" style={{ color: "rgba(243,229,171,0.7)" }}>
                      Mark your calendar
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl w-full sm:w-auto"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(212,175,55,0.25)",
                  }}
                >
                  <Clock className="w-5 h-5 shrink-0" style={{ color: "#D4AF37" }} />
                  <div>
                    <p className="font-medium text-sm text-white">6:00 PM – 8:00 PM</p>
                    <p className="text-xs" style={{ color: "rgba(243,229,171,0.7)" }}>
                      Be on time
                    </p>
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-xl max-w-md"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(212,175,55,0.18)",
                }}
              >
                <Crown className="w-5 h-5 shrink-0" style={{ color: "#D4AF37" }} />
                <div>
                  <p className="font-medium text-sm text-white">A prepared table in His presence</p>
                  <p className="text-xs" style={{ color: "rgba(243,229,171,0.7)" }}>
                    Venue details are shared with registered guests
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Button
                asChild
                className="font-medium rounded-xl px-10 py-7 text-lg shadow-lg border-0"
                size="lg"
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                  color: "#0B0919",
                  boxShadow: "0 8px 32px rgba(212,175,55,0.3)",
                }}
              >
                <a href="#register">
                  <UtensilsCrossed className="w-5 h-5 mr-3" />
                  Reserve Your Seat
                </a>
              </Button>
            </div>

            {/* Right: Flyer */}
            <div className="relative flex justify-center">
              <div
                className="absolute inset-0 rounded-[32px]"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.16), rgba(124,92,255,0.14))",
                  border: "1px solid rgba(212,175,55,0.3)",
                  transform: "rotate(3deg)",
                }}
              />
              <div
                className="relative w-full max-w-md rounded-[32px] overflow-hidden"
                style={{
                  border: "1px solid rgba(212,175,55,0.35)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src="/kitchen-in-the-sky.webp"
                  alt="A Kitchen in the Sky — Jesus My Kingsman Redeemer event flyer"
                  width={1024}
                  height={1280}
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
          style={{ background: "linear-gradient(to top, #0B0919, transparent)" }}
        />
      </section>

      {/* ── EXPERIENCE GRID ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2
            className="text-2xl md:text-4xl font-bold text-center tracking-tight text-white"
          >
            AN EVENING SET APART
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {experienceItems.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-3 px-4 py-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 h-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs md:text-sm font-medium leading-snug text-white/90">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE BLOCK ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-14 text-center space-y-5"
            style={{
              backgroundColor: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            <Quote className="w-8 h-8 md:w-10 md:h-10 mx-auto" style={{ color: "#D4AF37", opacity: 0.5 }} />
            <p
              className="text-lg md:text-2xl lg:text-3xl font-light italic leading-relaxed text-white"
            >
              &ldquo;You prepare a table before me in the presence of my enemies&hellip; my cup
              overflows.&rdquo;
            </p>
            <p className="text-sm font-semibold tracking-wide" style={{ color: "#D4AF37" }}>
              — PSALM 23:5
            </p>
          </div>
        </div>
      </section>

      {/* ── REGISTRATION (GOOGLE FORM EMBED) ──────────────────────────────── */}
      <section id="register" className="max-w-5xl mx-auto px-6 lg:px-8 py-12 md:py-20 pb-24 scroll-mt-20">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Strictly by registration
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Reserve Your Seat</h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Entry is strictly by registration. Complete the form below to secure your place at the
            King&rsquo;s table.
          </p>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(212,175,55,0.25)",
            backgroundColor: "rgba(255,255,255,0.04)",
          }}
        >
          <iframe
            src={GOOGLE_FORM_EMBED_URL}
            title="A Kitchen in the Sky — Registration Form"
            className="w-full"
            style={{ height: "1400px", border: 0, backgroundColor: "#fff" }}
            loading="lazy"
            allowFullScreen
          />
        </div>

        <div className="text-center mt-6">
          <a
            href={GOOGLE_FORM_PUBLIC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            style={{ color: "#D4AF37" }}
          >
            Having trouble with the form? Open it in a new tab
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />

      {/* Animations */}
      <style>{`
        @keyframes gold-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </main>
  )
}
