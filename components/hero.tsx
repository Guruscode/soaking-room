import type { CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative isolate min-h-[min(780px,calc(100svh-78px))] overflow-hidden bg-[#171511] text-white">
      <Image
        src="/image-16.jpg"
        alt="Moses Akoh leading the room in worship"
        fill
        priority
        quality={75}
        sizes="100vw"
        className="hero-image-drift -z-20 object-cover object-[center_42%]"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(17,16,14,0.94)_0%,rgba(17,16,14,0.79)_38%,rgba(17,16,14,0.3)_72%,rgba(17,16,14,0.12)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(17,16,14,0.65)_0%,transparent_36%)]" />

      <div className="container-page flex min-h-[min(780px,calc(100svh-78px))] flex-col justify-center py-20 md:py-24">
        <div className="max-w-3xl">
          <p
            className="hero-copy-in flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-[#dbc49a]"
            style={{ "--hero-delay": "100ms" } as CSSProperties}
          >
            <span className="h-px w-10 bg-[#c4a36a]" />
            Worship · Obedience · Eyes on Jesus
          </p>

          <h1 className="mt-8 font-serif text-[clamp(3.8rem,9vw,8.5rem)] leading-[0.91] tracking-[-0.045em] text-[#fffdf8]">
            <span className="hero-copy-in block" style={{ "--hero-delay": "220ms" } as CSSProperties}>
              The Soaking
            </span>
            <span
              className="hero-copy-in block text-[#e2c99a]"
              style={{ "--hero-delay": "360ms" } as CSSProperties}
            >
              Room.
            </span>
          </h1>

          <p
            className="hero-copy-in mt-8 max-w-xl text-base leading-7 text-white/80 md:text-lg md:leading-8"
            style={{ "--hero-delay": "500ms" } as CSSProperties}
          >
            A global worship movement led by Moses Akoh, creating space for people to encounter God through music,
            prayer, and the presence of Jesus.
          </p>

          <div
            className="hero-copy-in mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
            style={{ "--hero-delay": "640ms" } as CSSProperties}
          >
            <Link
              href="/booking"
              className="group inline-flex min-h-14 items-center gap-4 bg-[#c4a36a] px-7 text-sm font-medium text-[#1d1a15] transition-colors hover:bg-[#ddc89f]"
            >
              Book
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/events"
              className="inline-flex min-h-14 items-center gap-3 text-sm text-white/90 transition-colors hover:text-[#e2c99a]"
            >
              Join us in worship
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
