"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import BookingWizard from "@/components/booking-wizard"

export default function BookingPage() {
  return (
    <>
      <Header />

      <section className="min-h-screen overflow-hidden bg-gradient-to-b from-white via-cyan-50/40 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Ministry Booking</p>
            <h1 className="mt-3 text-4xl font-bold text-black sm:text-5xl md:text-6xl">
              Host <span className="text-cyan-600">Minister Moses Akoh</span>
            </h1>
            <div className="mx-auto mt-6 max-w-3xl">
              <p className="text-base text-gray-700 sm:text-lg">
                <strong className="font-semibold text-black">MINISTERIAL HOSTING REQUIREMENT QUESTIONNAIRE</strong>
              </p>
              <p className="mt-3 text-sm text-gray-600 sm:text-base">
                Minister Moses Akoh is a worship leader, pastor, songwriter, and missionary with a heart to lead God&rsquo;s
                people into His presence through music that blends Gospel, Contemporary, Rock, and African styles. Select
                your preferred date(s) on the calendar, complete the questionnaire, and our team will review your request.
              </p>

              <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 sm:text-base">
                <p>
                  <strong>Important:</strong> Due to the high demand and limited availability in Minister Moses Akoh&rsquo;s
                  booking schedule, we strongly recommend submitting your booking request at least <strong>30 days</strong> before
                  the proposed date of your programme to allow sufficient time for scheduling and confirmation.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <BookingWizard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-gray-500">
              Bookings remain pending until approved by the ministry team. You will be notified by email at every step.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}
