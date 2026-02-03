"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, Briefcase, Award, Globe, Music, Users, Brain, Volume2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function About() {
  return (
    <>
      <Header />
      <section className="min-h-screen bg-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Hero-like Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-black mb-4">
              Moses Oche <span className="text-cyan-600">Akoh</span>
            </h1>
            <p className="text-xl text-gray-600 font-light">
              Music Director | Pastor | Producer | Worship Leader
            </p>
          </motion.div>

          {/* Grid Layout for Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column: Image + Contacts */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-3xl">
                <motion.div
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -inset-1 bg-gradient-to-tr from-cyan-400 to-transparent rounded-3xl blur-xl -z-10"
                />
                <Image
                  src="/image-1.JPG" // Assuming this is Moses' photo from Hero
                  alt="Moses Akoh"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              {/* Contacts */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 space-y-4 text-gray-700"
              >
                <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                  <Globe className="w-6 h-6 text-cyan-600" />
                  Contacts
                </h2>
                <p>Atlantic Mall, Utako, FCT Abuja</p>
                <p className="flex items-center gap-2">
                  Phone: 09057027326
                </p>
                <p className="flex items-center gap-2">
                  Email: soakingroomworship@gmail.com
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column: Bio */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-2">
                  <Users className="w-7 h-7 text-cyan-600" />
                  Biography
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Moses Oche Akoh is a recording artist, music producer, singer, songwriter and ordained pastor with a unique blend of creative depth and ministry passion. He has built a career that bridges music, worship leadership and missions, using sound and storytelling to inspire people across cultures. Moses is known for his warm stage presence, strong vocal abilities and skill in directing and coaching worship teams. As a guitarist and producer, he shapes music that carries both spiritual weight and artistic excellence.
                </p>
                {/* ... rest of bio paragraphs remain unchanged ... */}
              </div>
            </motion.div>
          </div>

          {/* Additional Sections */}
          <div className="mt-24 space-y-24">
            {/* Education */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* ... Education content unchanged ... */}
            </motion.section>

            {/* Certifications & Trainings */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* ... Certifications content unchanged ... */}
            </motion.section>

            {/* Skills */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* ... Skills content unchanged ... */}
            </motion.section>

            {/* Discography */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* ... Discography content unchanged ... */}
            </motion.section>

            {/* === NEW SECTION: New Song Alert === */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative space-y-8 bg-gradient-to-br from-cyan-50 via-white to-blue-50 rounded-3xl p-10 shadow-xl border border-cyan-100/50 overflow-hidden"
            >
              {/* Subtle background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-50"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-black flex items-center gap-3">
                    <Volume2 className="w-10 h-10 text-cyan-600 animate-pulse" />
                    New Song Alert
                  </h2>
                  <span className="px-5 py-2 bg-cyan-600 text-white text-sm font-bold rounded-full shadow-md">
                    Fresh Release • 2026
                  </span>
                </div>

                <p className="text-3xl font-bold text-cyan-700 mb-4">
                  PROPHESY
                </p>
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  A powerful prophetic anthem written and executive produced by Moses Akoh. This release calls believers to declare faith, spiritual clarity, and divine favor over the new season. Featuring rich production, anointed background vocals, and a stirring music video — it's already blessing thousands!
                </p>

                {/* Embedded Video Player */}
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-cyan-200/50">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/edwrLWhFx6o"
                    title="Moses Akoh | PROPHESY | Official Music Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>

                <p className="text-center mt-8 text-gray-600 italic">
                  "Get ready to prophesy your breakthrough — watch, listen, and declare!"<br />
                  Available now on YouTube — link in bio or search "Moses Akoh PROPHESY"
                </p>
              </div>
            </motion.section>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
