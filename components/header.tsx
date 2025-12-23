"use client"

import Link from "next/link"
import Image from "next/image"  // ← add this if you haven't already
import { Heart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Updated nav items including Booking
  const navItems = ["Home", "About", "Gallery", "TSR Academy", "Contact", "Booking"]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-lg overflow-hidden">
              <Image
                src="/logo.PNG"
                alt="The Soaking Room Logo"
                width={44}
                height={44}
                className="w-11 h-11 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black tracking-tight">
                The Soaking Room
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                Worship  • Obedience • eyes on Jesus
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                href={
                  item === "Home" ? "/" :
                  item === "About" ? "/about" :
                  item === "Gallery" ? "/gallery" :
                  item === "TSR Academy" ? "/tsr-academy" :
                  item === "Donate" ? "/donate" :
                  item === "Contact" ? "/contact" :
                  item === "Booking" ? "/booking" : "#"  // ← your booking page
                }
                className="text-sm font-medium text-gray-700 hover:text-black relative"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-300 hover:w-full" />
              </motion.a>
            ))}

            <Button
              size="lg"
              asChild
              className="bg-black hover:bg-gray-900 text-white font-medium px-8 py-6 rounded-2xl shadow-xl hover:shadow-cyan-500/20"
            >
              <Link href="/donate">
                <Heart className="w-5 h-5 mr-2 fill-current" />
                Support Us
              </Link>
            </Button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay & Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col p-8 pt-24 space-y-8">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={
                      item === "Home" ? "/" :
                      item === "About" ? "/about" :
                      item === "Gallery" ? "/gallery" :
                      item === "TSR Academy" ? "/tsr-academy" :
                      item === "Donate" ? "/donate" :
                      item === "Contact" ? "/contact" :
                      item === "Booking" ? "/booking" : "#"
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-medium text-gray-800 hover:text-black transition"
                  >
                    {item}
                  </a>
                ))}

                <Button
                  size="lg"
                  asChild
                  className="w-full mt-8 bg-black hover:bg-gray-900 text-white text-lg py-8 rounded-2xl shadow-xl"
                >
                  <Link href="/donate" onClick={() => setMobileMenuOpen(false)}>
                    <Heart className="w-6 h-6 mr-3 fill-current" />
                    Support This Ministry
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
