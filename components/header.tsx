"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowUpRight, Heart, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "TSR Academy", href: "/tsr-academy" },
  { label: "Login", href: "/tsr-academy/login" },
  { label: "Contact", href: "/contact" },
  { label: "Booking", href: "/booking" },
]

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  if (href === "/tsr-academy") return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e8e2d8] bg-[#f7f5f0]/95 backdrop-blur-sm">
        <div className="container-page flex min-h-[78px] items-center justify-between gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="The Soaking Room home">
            <Image src="/logo.PNG" alt="" width={42} height={42} className="size-10 object-contain" />
            <span className="leading-tight">
              <span className="block font-serif text-lg tracking-tight text-[#201e1a]">The Soaking Room</span>
              <span className="mt-0.5 hidden text-[0.58rem] uppercase tracking-[0.18em] text-[#777166] sm:block">
                Worship · Obedience · Eyes on Jesus
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-4 xl:flex" aria-label="Main">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "border-b py-2 text-[0.8rem] transition-colors",
                    active
                      ? "border-[#9a7946] text-[#201e1a]"
                      : "border-transparent text-[#69655c] hover:border-[#c5b18d] hover:text-[#201e1a]",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/donate"
              className="hidden min-h-11 items-center gap-2 border border-[#9a7946] px-5 text-sm text-[#201e1a] transition-colors hover:bg-[#9a7946] hover:text-white sm:inline-flex"
            >
              <Heart className="size-4" />
              Support Us
              <ArrowUpRight className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center border border-[#ded8ce] text-[#201e1a] transition-colors hover:border-[#9a7946] xl:hidden"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#f7f5f0] transition-[opacity,visibility] duration-300 xl:hidden",
          mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="container-page flex h-full flex-col pt-24 pb-5">
          <nav className="flex min-h-0 flex-col overflow-y-auto" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className={cn(
                  "flex items-center justify-between border-b border-[#e8e2d8] py-3 font-serif text-2xl",
                  isActive(pathname, item.href) ? "text-[#201e1a]" : "text-[#777166]",
                )}
              >
                {item.label}
                <ArrowUpRight className="size-5 text-[#9a7946]" />
              </Link>
            ))}
          </nav>
          <Link
            href="/donate"
            onClick={() => setMobileMenuOpen(false)}
            tabIndex={mobileMenuOpen ? 0 : -1}
            className="mt-4 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[#201e1a] text-sm text-white"
          >
            Give to the ministry
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </>
  )
}
