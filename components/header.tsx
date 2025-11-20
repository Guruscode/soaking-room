"use client"
import Link from "next/link"

import { Music } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Music className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <Link href="/">
            <h1 className="text-xl font-bold text-foreground">The Soaking Room</h1>
            <p className="text-xs text-muted-foreground">A Worship Movement</p>
            </Link>
          </div>
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            About
          </a>
          <a href="#donate" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Donate
          </a>
           <a href="/gallery" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Gallery
          </a>
          <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </header>
  )
}
