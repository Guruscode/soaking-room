import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#201e1a] text-white">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="space-y-5 md:col-span-5">
            <div className="flex items-center gap-3">
              <Image src="/logo.PNG" alt="The Soaking Room Logo" width={40} height={40} className="size-10 object-contain" />
              <div>
                <h3 className="font-serif text-xl">The Soaking Room</h3>
                <p className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/50">Worship · Obedience · Eyes on Jesus</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Spreading the gospel through music and inspiring hearts with messages of faith and hope.
            </p>
          </div>

          <div className="space-y-4 md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.18em] text-[#c4a36a]">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:col-span-4">
            <h4 className="text-xs uppercase tracking-[0.18em] text-[#c4a36a]">Support</h4>
            <p className="text-sm leading-relaxed text-white/60">
              Your donation helps us continue spreading the gospel through music.
            </p>
            <div className="inline-flex items-center gap-2 border-b border-[#c4a36a] pb-1 text-sm text-white/85">
              <Link href="/donate" className="inline-flex items-center gap-2">
                Support this ministry
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-8 text-sm text-white/45 md:flex-row">
          <p>&copy; {currentYear} Moses Akoh Ministry. All rights reserved.</p>
          <p>Spreading faith and hope through music.</p>
        </div>
      </div>
    </footer>
  )
}
