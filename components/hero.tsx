"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"  // nicer icon for "Learn More"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export function Hero() {
  const router = useRouter()

  const handleLearnMore = () => {
    // If you're on the homepage and have an #about section → smooth scroll
    // Otherwise → go to /about page
    if (window.location.pathname === "/" && document.getElementById("about")) {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push("/about")
    }
  }

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        {/* Subtle animated background */}
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
            className="absolute top-20 left-20 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-10"
          />
          <motion.div
            animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-32 right-10 w-80 h-80 bg-cyan-500 rounded-full blur-3xl opacity-5"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-cyan-600 font-medium tracking-wider uppercase text-sm mb-6"
              >
                Global Worship Movement
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-6xl md:text-7xl lg:text-8xl font-bold text-black leading-none"
              >
                The Soaking
                <br />
                <span className="text-cyan-600">Room</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 text-xl md:text-2xl text-gray-600 font-light max-w-2xl"
              >
               A sacred space for extended worship, led by Moses Akoh. 
                <br className="hidden md:block" />
               Where hearts linger in the presence of God.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-12"
              >
                <Button
                  size="lg"
                 onClick={() => router.push("/about")}
                  className="group relative overflow-hidden bg-black hover:bg-gray-900 text-white font-medium text-lg px-12 py-8 rounded-2xl shadow-2xl transition-all duration-500"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    Learn More
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-cyan-500"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
            </motion.div>

            {/* Right — Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-3xl">
                <motion.div
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -inset-1 bg-gradient-to-tr from-cyan-400 to-transparent rounded-3xl blur-xl -z-10"
                />

                <Image
                  src="/image-1.JPG"
                  alt="Moses Akoh"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-8 left-8 text-white">
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="text-4xl font-bold"
                  >
                    Moses Akoh
                  </motion.h3>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    className="text-cyan-300 text-lg"
                  >
                    Founder & Lead Worshipper
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}