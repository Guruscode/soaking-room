"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-md overflow-hidden">
                <Image
                  src="/logo.PNG"
                  alt="The Soaking Room Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">The Soaking Room</h3>
                <p className="text-sm text-background/70">Worship • Obedience • Eyes on Jesus</p>
              </div>
            </div>
            <p className="text-sm text-background/80 leading-relaxed">
              Spreading the gospel through music and inspiring hearts with messages of faith and hope.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-background/80 hover:text-background transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-background/80 hover:text-background transition-colors">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-background/80 hover:text-background transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Support</h4>
            <p className="text-sm text-background/80">
              Your donation helps us continue spreading the gospel through music.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-primary" />
              <span>Thank you for your support!</span>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
            <p>&copy; {currentYear} Moses Akoh Ministry. All rights reserved.</p>
            <p>Spreading faith and hope through music.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
