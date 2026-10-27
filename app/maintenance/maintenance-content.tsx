"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Wrench } from "lucide-react"

export function MaintenanceContent() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">
      {/* Subtle animated background, matching the homepage hero */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        <motion.div
          animate={{ x: [-100, 100], y: [-100, 100] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-0 h-72 w-72 rounded-full bg-cyan-400 opacity-10 blur-3xl md:left-20 md:h-96 md:w-96"
        />
        <motion.div
          animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 bottom-20 h-64 w-64 rounded-full bg-cyan-500 opacity-10 blur-3xl md:right-10 md:h-80 md:w-80"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative mx-auto mb-10 h-24 w-24"
        >
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-cyan-400"
          />
          <Image
            src="/logo.PNG"
            alt="The Soaking Room"
            width={96}
            height={96}
            className="relative h-24 w-24 rounded-full object-cover shadow-xl ring-4 ring-white"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-sm font-medium tracking-wider text-cyan-700 uppercase"
        >
          <Wrench className="h-4 w-4" />
          Under Maintenance
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-6 text-5xl leading-none font-bold text-black md:text-7xl"
        >
          The Soaking <span className="text-cyan-600">Room</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-slate-600 md:text-xl"
        >
          We&apos;re making some improvements to serve you better. The website will be back shortly — thank you for
          your patience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              className="h-2.5 w-2.5 rounded-full bg-cyan-500"
            />
          ))}
        </motion.div>
      </motion.div>
    </main>
  )
}
