"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Sparkles, ArrowRight, Flower2 } from "lucide-react"
import { motion } from "framer-motion"

export function SpiritSpaPromo() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#F8F1E9" }}>
      {/* Warm background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #F8F1E9 0%, #F0E6D8 40%, #E8D5C8 100%)",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(216,168,160,0.25) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(201,166,107,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Decorative top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: "linear-gradient(90deg, transparent, #D8A8A0, #C9A66B, #D8A8A0, transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(216,168,160,0.15)",
                border: "1px solid rgba(216,168,160,0.25)",
                color: "#5A4A3A",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#C9A66B" }} />
              Special Event — August 29th, 2026
            </div>

            <div className="space-y-3">
              <p className="font-semibold tracking-widest text-xs uppercase" style={{ color: "#C9A66B" }}>
                The Soaking Room Presents
              </p>
              <h2 className="text-3xl md:text-5xl font-bold" style={{ color: "#3D2E24" }}>
                The <span className="italic" style={{ color: "#D8A8A0" }}>Spirit</span> Spa
              </h2>
              <p className="max-w-lg leading-relaxed" style={{ color: "#5A4A3A" }}>
                A signature women&apos;s worship experience — a sacred space where women can pause,
                breathe, and be renewed in the presence of God.
              </p>
            </div>

            {/* YOU BELONG HERE */}
            <div
              className="inline-block px-6 py-3 rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(216,168,160,0.12), rgba(201,166,107,0.08))",
                border: "1px solid rgba(216,168,160,0.2)",
              }}
            >
              <p className="text-sm font-bold tracking-wider" style={{ color: "#D8A8A0" }}>
                ✦ YOU BELONG HERE ✦
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm" style={{ color: "#5A4A3A" }}>
                <CalendarDays className="w-4 h-4 shrink-0" style={{ color: "#D8A8A0" }} />
                <span>August 29, 2026</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "#5A4A3A" }}>
                <MapPin className="w-4 h-4 shrink-0" style={{ color: "#D8A8A0" }} />
                <span>ATW Center, CBD Abuja</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                className="font-medium rounded-xl px-8 py-6 shadow-lg border-0"
                size="lg"
                style={{
                  background: "linear-gradient(135deg, #D8A8A0, #C9A66B)",
                  color: "#fff",
                  boxShadow: "0 8px 32px rgba(216,168,160,0.35)",
                }}
              >
                <Link href="/events/spirit-spa">
                  Register Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden md:flex items-center justify-center"
          >
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(216,168,160,0.2), transparent)",
                }}
              />
              <div
                className="relative w-full h-full rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(216,168,160,0.15), rgba(201,166,107,0.1))",
                  border: "1px solid rgba(216,168,160,0.2)",
                }}
              >
                <div className="text-center space-y-3">
                  <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto"
                    style={{
                      background: "linear-gradient(135deg, rgba(216,168,160,0.2), rgba(201,166,107,0.1))",
                      border: "1px solid rgba(216,168,160,0.25)",
                    }}
                  >
                    <Flower2 className="w-10 h-10" style={{ color: "#D8A8A0", opacity: 0.8 }} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg" style={{ color: "#5A4A3A" }}>
                      Spirit Spa
                    </p>
                    <p className="text-xs" style={{ color: "#C9A66B" }}>
                      Refresh &bull; Renew &bull; Restore
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
