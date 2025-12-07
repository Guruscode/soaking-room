"use client"

import { motion } from "framer-motion"
import { Globe, Phone, Mail } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Contact() {
  return (
    <>
      <Header />
      <section className="min-h-screen bg-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-black mb-4">
              Get In <span className="text-cyan-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
              Reach out to Moses Oche Akoh or The Soaking Room Ministry. We're here to connect, collaborate, and share in the journey of worship and presence.
            </p>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {/* Address */}
            <div className="text-center p-8 rounded-3xl shadow-xl hover:shadow-cyan-500/20 transition-all duration-500">
              <Globe className="w-12 h-12 text-cyan-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-black mb-4">Address</h2>
              <p className="text-gray-600">
                26, NE Eduok Road,<br />
                NAF Valley Estate,<br />
                Asokoro, Abuja,<br />
                Nigeria
              </p>
            </div>

            {/* Phone */}
            <div className="text-center p-8 rounded-3xl shadow-xl hover:shadow-cyan-500/20 transition-all duration-500">
              <Phone className="w-12 h-12 text-cyan-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-black mb-4">Phone</h2>
              <p className="text-gray-600">
                08061157979
              </p>
            </div>

            {/* Email */}
            <div className="text-center p-8 rounded-3xl shadow-xl hover:shadow-cyan-500/20 transition-all duration-500">
              <Mail className="w-12 h-12 text-cyan-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-black mb-4">Email</h2>
              <p className="text-gray-600">
                soakingroomworship@gmail.com
              </p>
            </div>
          </motion.div>

          {/* Optional Map or Form Placeholder */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <p className="text-xl text-gray-600 font-light">
              Feel free to reach out for collaborations, inquiries, or to join our worship gatherings.
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  )
}