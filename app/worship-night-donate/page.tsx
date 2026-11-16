import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Rays } from "@/components/site/rays"
import { delay } from "@/lib/motion"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Worship Night Giving Details",
  description:
    "View event-specific Naira, CAD, and UK giving details for Worship Night with Moses Akoh and The Soaking Room.",
  path: "/worship-night-donate",
  image: "/donation-image.jpg",
})

const givingMethods = [
  {
    currency: "Naira",
    title: "Naira Account (GTBank)",
    details: [
      ["Account name", "The Soaking Room Ministry"],
      ["Account number", "0724648927"],
    ],
  },
  {
    currency: "CAD",
    title: "CAD Account",
    details: [["E-transfer email", "Ocheakoh@gmail.com"]],
    email: true,
  },
  {
    currency: "UK",
    title: "UK Account",
    details: [
      ["Account name", "Moses Akoh"],
      ["Sort code", "040005"],
      ["Account number", "72755449"],
    ],
  },
]

export default function WorshipNightDonatePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50">
          <Rays className="pointer-events-none absolute -top-32 -left-32 size-[28rem] text-amber-900/10 animate-spin-slow" />
          <div className="container-page relative grid gap-12 py-14 md:grid-cols-2 md:items-center md:py-24">
            <div className="space-y-7">
              <Link
                href="/donate"
                className="group inline-flex items-center gap-2 rounded-full border border-amber-900/15 bg-white/70 py-1.5 pr-4 pl-1.5 text-sm font-medium text-amber-900 animate-rise hover:border-amber-900/30"
              >
                <span className="grid size-7 place-items-center rounded-full bg-amber-900 text-white transition-transform duration-500 group-hover:-translate-x-0.5">
                  <ArrowLeft className="size-3.5" />
                </span>
                All donation options
              </Link>
              <div className="space-y-4 animate-rise" style={delay(120)}>
                <p className="eyebrow text-amber-800">Special event giving</p>
                <h1 className="text-6xl font-light leading-[0.95] tracking-[-0.04em] text-ink md:text-7xl">
                  Worship <span className="font-bold">Night</span>
                </h1>
                <p className="text-xl font-medium text-amber-900">With Moses Akoh</p>
                <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                  Thank you for supporting Worship Night. Choose the giving details for your currency below. These
                  account details are provided specifically for this event.
                </p>
              </div>
              <Link
                href="/worship-night"
                className="group inline-flex h-12 items-center gap-3 rounded-full border border-amber-900/20 bg-white pr-1.5 pl-6 text-sm font-semibold text-ink animate-rise hover:border-amber-900/40"
                style={delay(240)}
              >
                Event details &amp; registration
                <span className="grid size-9 place-items-center rounded-full bg-amber-800 text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </div>

            <div className="relative animate-scale-in" style={delay(160)}>
              <div className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white shadow-[0_50px_100px_-40px_rgb(120_53_15/0.45)] md:rotate-2 md:transition-transform md:duration-700 md:hover:rotate-0">
                <Image
                  src="/donation-image.jpg"
                  alt="Worship Night with Moses Akoh event poster, including Naira, CAD, and UK giving details"
                  width={1800}
                  height={2287}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container-page py-16 md:py-24">
          <div className="reveal mb-10 max-w-2xl space-y-3">
            <p className="eyebrow text-amber-800">Ways to give</p>
            <h2 className="text-4xl font-light tracking-tight text-ink">
              Worship Night <span className="font-bold">giving details</span>
            </h2>
            <p className="text-slate-600">
              Please double-check the account details and include Worship Night in your transfer reference where
              possible.
            </p>
          </div>

          <div className="reveal-stagger grid gap-5 md:grid-cols-3">
            {givingMethods.map((method) => (
              <article key={method.currency} className="rounded-[1.75rem] border border-amber-200/80 bg-white p-7 lift">
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-900">
                  {method.currency}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-ink">{method.title}</h3>
                <dl className="mt-6 space-y-4">
                  {method.details.map(([label, value]) => (
                    <div key={label} className="space-y-1 border-t border-amber-100 pt-4">
                      <dt className="text-xs font-medium text-slate-500">{label}</dt>
                      <dd className="break-words font-mono text-[0.95rem] font-semibold tabular-nums text-ink">
                        {method.email ? (
                          <a href={`mailto:${value}`} className="inline-flex items-center gap-2 font-sans text-amber-900 underline underline-offset-4">
                            <Mail className="size-4 shrink-0" />
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/donate"
              className="inline-flex h-12 items-center rounded-full border border-slate-300 px-6 text-sm font-semibold text-ink transition-colors hover:border-ink"
            >
              View ministry donation details
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
