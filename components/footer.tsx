"use client"

import { Music, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Music className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Moses Akoh</h3>
                <p className="text-sm text-background/70">Music Ministry</p>
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
                <a href="#about" className="text-background/80 hover:text-background transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#donate" className="text-background/80 hover:text-background transition-colors">
                  Donate
                </a>
              </li>
              <li>
                <a href="#contact" className="text-background/80 hover:text-background transition-colors">
                  Contact
                </a>
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
            <p>&copy; {currentYear} Moses Akoh Music Ministry. All rights reserved.</p>
            <p>Spreading faith and hope through music.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
