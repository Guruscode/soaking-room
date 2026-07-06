"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Sparkles, ArrowRight, Droplets } from "lucide-react"
import { motion } from "framer-motion"

export function SpiritSpaPromo() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-400/15 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-400/15 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />

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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-emerald-200 text-xs font-medium uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Special Event — August 29th, 2026
            </div>

            <div className="space-y-3">
              <p className="text-emerald-300 font-semibold tracking-widest text-xs uppercase">The Soaking Room Presents</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                The <span className="text-emerald-300">Spirit</span> Spa
              </h2>
              <p className="text-emerald-100/70 max-w-lg leading-relaxed">
                A sacred gathering for worship, prayer, and spiritual refreshment. Come and be renewed in the presence of God.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-emerald-100/80">
                <CalendarDays className="w-4 h-4 text-emerald-300" />
                <span>August 29, 2026</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-100/80">
                <MapPin className="w-4 h-4 text-emerald-300" />
                <span>ATW Center, CBD Abuja</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl px-8 py-6 shadow-xl shadow-emerald-900/30"
                size="lg"
              >
                <Link href="/events/spirit-spa">
                  Register Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              {/* <Button
                asChild
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-xl px-8 py-6"
                size="lg"
              >
                <Link href="/events/spirit-spa">
                  Learn More
                </Link>
              </Button> */}
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
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/10 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-400/10 to-emerald-600/20 border border-emerald-400/20 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-300/30 mx-auto">
                    <Droplets className="w-10 h-10 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-white/80 font-semibold text-lg">Spirit Spa</p>
                    <p className="text-emerald-300/60 text-xs">Refresh • Renew • Restore</p>
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
