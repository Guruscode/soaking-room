import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"

export function SpiritSpaPromo() {
  return (
    <section className="bg-white pb-20 md:pb-28">
      <div className="container-page">
        <div className="grid gap-10 border-y border-[#c4a36a] bg-[#f7f5f0] p-7 md:grid-cols-[1.2fr_0.8fr] md:items-center md:p-12 lg:p-16">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#907447]">The Soaking Room presents</p>
            <h2 className="font-serif text-5xl tracking-tight text-[#201e1a] md:text-7xl">
              The Spirit Spa
            </h2>
            <p className="max-w-xl text-lg leading-8 text-[#625e55]">
              A signature women&apos;s worship experience — a sacred space to pause, breathe, and be renewed in the
              presence of God.
            </p>
            <p className="text-sm italic text-[#877f71]">You belong here.</p>
          </div>

          <div className="border-t border-[#ded8ce] pt-5 md:border-l md:border-t-0 md:pt-0 md:pl-8">
            <p className="text-xs uppercase tracking-[0.18em] text-[#907447]">Join us</p>
            <div className="mt-5 space-y-4">
              <p className="flex items-start gap-3 text-sm text-[#49453d]">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-[#9a7946]" />
                August 29, 2026
              </p>
              <p className="flex items-start gap-3 text-sm text-[#49453d]">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#9a7946]" />
                ATW Center, CBD Abuja
              </p>
            </div>
            <Link
              href="/events/spirit-spa"
              className="group mt-8 inline-flex min-h-12 items-center gap-4 bg-[#201e1a] px-6 text-sm text-white transition-colors hover:bg-[#443e33]"
            >
              Register free
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
