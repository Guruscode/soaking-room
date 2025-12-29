"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function BookingPage() {
  return (
    <>
      <Header />

      <section className="min-h-screen bg-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-black mb-6">
              Host <span className="text-cyan-600">Minister Moses Akoh</span>
            </h1>

            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-700 font-light leading-relaxed">
                <strong className="font-semibold text-black">
                  MINISTERIAL HOSTING REQUIREMENT QUESTIONNAIRE FOR MINISTER MOSES AKOH
                </strong>
              </p>

              <p className="text-lg text-gray-600 mt-6 leading-relaxed">
                Minister Moses Akoh is a worship leader, pastor, songwriter, and missionary with a heart to lead God’s people
                into His presence through music that blends Gospel, Contemporary, Rock, and African styles.
              </p>

              <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                To ensure a smooth, God-honoring and impactful ministry experience, kindly complete the hosting questionnaire
                using the button below.
              </p>
            </div>
          </motion.div>

          {/* Redirect Button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="flex justify-center"
          >
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSf54vDckuYWtWspOu69T2q9FEcRKhUWiu9ZrKOamLGUPvJSyA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center justify-center
                px-12 py-5
                text-lg font-semibold text-white
                bg-cyan-600
                rounded-full
                shadow-lg
                hover:bg-cyan-700
                hover:shadow-cyan-500/30
                transition-all duration-300
              "
            >
              Fill Hosting Questionnaire
            </a>
          </motion.div>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-20"
          >
            <p className="text-xl text-gray-600 font-light">
              Kindly complete the questionnaire using the button above.<br />
              Our team will review your submission and contact you shortly.
            </p>
          </motion.div>

        </div>
      </section>

      <Footer />
    </>
  )
}
