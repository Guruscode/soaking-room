import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BankDetails } from "@/components/bank-details"
import { PageHero } from "@/components/site/page-hero"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Support The Soaking Room",
  description:
    "Partner with The Soaking Room ministry and support gospel music, worship gatherings, and outreach led by Moses Akoh.",
  path: "/donate",
})

export default function DonatePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <PageHero
          eyebrow="Partner With Us"
          title={
            <>
              Partner with us by <span className="font-bold">sowing</span>, as we take the Gospel of Jesus, through
              worship, to all nations.
            </>
          }
          className="[&_h1]:text-[clamp(2.25rem,5vw,4rem)]"
        />

        <section className="container-page pt-10">
          <div className="reveal flex flex-col gap-5 rounded-[1.75rem] border border-amber-200/80 bg-amber-50/80 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="space-y-1">
              <p className="eyebrow text-amber-800">Special event</p>
              <h2 className="text-2xl font-semibold text-ink">Giving to Worship Night?</h2>
              <p className="text-sm text-slate-600">View the event poster and dedicated giving details.</p>
            </div>
            <Link
              href="/worship-night-donate"
              className="group inline-flex h-12 items-center gap-3 self-start rounded-full bg-amber-800 pr-1.5 pl-6 text-sm font-semibold text-white transition-colors hover:bg-amber-900 md:self-auto"
            >
              Give to Worship Night
              <span className="grid size-9 place-items-center rounded-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0.5">
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </div>
        </section>

        <BankDetails />
      </main>
      <Footer />
    </>
  )
}
