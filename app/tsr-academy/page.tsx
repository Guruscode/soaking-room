import React from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CalendarClock, GraduationCap, Users, ArrowRight, Instagram } from "lucide-react"

export default function TSRAcademyPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          {/* Background similar to hero */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
            <div className="absolute top-16 left-16 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-10" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-400 rounded-full blur-3xl opacity-10" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold uppercase tracking-[0.2em]">
                  Coming Soon
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  TSR Academy
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                  A school for worshippers—equipping you to carry presence, lead worship, and serve the nations. Register
                  your interest and be the first to know when admissions open.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Feature icon={GraduationCap} label="Training" text="Immersive teaching + practice" />
                  <Feature icon={Users} label="Community" text="Grow with other worshippers" />
                  <Feature icon={CalendarClock} label="Intensives" text="Labs, sessions, masterclasses" />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="group relative overflow-hidden bg-black hover:bg-gray-900 text-white px-8 py-7 rounded-2xl shadow-2xl">
                    <Link
                      href="https://docs.google.com/forms/u/0/create"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="flex items-center gap-3">
                        Join Waitlist
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-800 hover:text-white hover:bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] px-8 py-7 rounded-2xl transition-all"
                >
                  <Link
                    href="https://www.instagram.com/thesoakingroom?igsh=MWQ1ZHVicGI2NHV2NA%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="flex items-center gap-2">
                      <Instagram className="w-5 h-5" />
                      Follow on Instagram
                    </span>
                  </Link>
                </Button>
                </div>

                <p className="text-sm text-gray-500">
                  We’re finalizing the curriculum, mentors, and schedule. Drop your interest and you’ll get the first invite.
                </p>
              </div>

              {/* Right Content */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/40 via-transparent to-emerald-200/40 blur-3xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-3xl border border-white/60 bg-white/70 backdrop-blur p-8 space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900">What to expect</h2>
                  <ul className="space-y-3 text-gray-700">
                    <li>• Foundations of worship and presence</li>
                    <li>• Songwriting, voice, and musicianship labs</li>
                    <li>• Team leading, prophetic flow, and ministry labs</li>
                    <li>• Guest mentors and hands-on practicums</li>
                  </ul>
                  <div className="rounded-2xl bg-cyan-50 border border-cyan-100 p-5 text-sm text-cyan-900">
                    Want early access? Tap “Register Interest” and we’ll reach out with next steps as soon as dates are live.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Feature({
  icon: Icon,
  label,
  text,
}: {
  icon: React.ElementType
  label: string
  text: string
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
      <Icon className="w-5 h-5 text-cyan-600 mb-2" />
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <p className="text-xs text-gray-600">{text}</p>
    </div>
  )
}
