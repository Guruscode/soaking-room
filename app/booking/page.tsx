// app/booking/page.tsx
"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import Script from "next/script"        // ← this is the key
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// Extend window only for this file (no global pollution)
declare global {
  interface Window {
    Calendly?: any
  }
}

export default function BookingPage() {
  // Re-initialise Calendly when the script finishes loading
  const handleCalendlyLoad = () => {
    if (window.Calendly) {
      window.Calendly.initInlineWidgets()
    }
  }

  return (
    <>
      <Header />

      <section className="min-h-screen bg-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-black mb-6">
              Host <span className="text-cyan-600">Minister Moses Akoh</span>
            </h1>

            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xl text-gray-700 font-light leading-relaxed">
                <strong className="font-semibold text-black">
                  MINISTERIAL HOSTING REQUIREMENT QUESTIONNAIRE FOR MINISTER MOSES AKOH
                </strong>
              </p>
              <p className="text-lg text-gray-600 mt-6 leading-relaxed">
                Minister Moses Akoh is a worship leader, pastor, songwriter, and missionary with a heart to lead God’s people into His presence through music that blends Gospel, Contemporary, Rock, and African styles. 
                Committed to excellence and integrity, this questionnaire helps ensure a smooth, God-honoring event by clarifying expectations for both parties.
              </p>
              <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                We appreciate your partnership and ask you to complete this form to facilitate a joyful and impactful ministry experience. 
                Responses will form the basis of our mutual agreement.
              </p>
            </div>
          </motion.div>

          {/* Calendly – Perfectly styled & guaranteed to load */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-500">
              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/bookingmosesakoh/new-meeting"
                style={{ minHeight: "750px" }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-20"
          >
            <p className="text-xl text-gray-600 font-light">
              Select an available time above to schedule a discovery call.<br />
              We’ll send the full questionnaire right after you book.
            </p>
          </motion.div>

        </div>
      </section>

      <Footer />

      {/* This is the magic line – loads Calendly properly in Next.js */}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={handleCalendlyLoad}
      />
    </>
  )
}