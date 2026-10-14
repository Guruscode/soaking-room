import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Worship Night Giving | The Soaking Room",
  description: "Event-specific giving details for Worship Night with Moses Akoh.",
}

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
      <main className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-amber-50 via-white to-orange-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:items-center md:py-20 lg:px-8">
            <div className="space-y-6">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-900 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                All donation options
              </Link>
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
                  Special event giving
                </p>
                <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
                  Worship Night
                </h1>
                <p className="text-xl font-medium text-amber-900">With Moses Akoh</p>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                  Thank you for supporting Worship Night. Choose the giving details for your currency below.
                  These account details are provided specifically for this event.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-xl">
              <Image
                src="/donation-image.png"
                alt="Worship Night with Moses Akoh event poster, including Naira, CAD, and UK giving details"
                width={2500}
                height={3176}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="mb-8 max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">Ways to give</p>
            <h2 className="text-3xl font-bold text-foreground">Worship Night giving details</h2>
            <p className="text-muted-foreground">
              Please double-check the account details and include Worship Night in your transfer reference where
              possible.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {givingMethods.map((method) => (
              <article
                key={method.currency}
                className="rounded-2xl border border-amber-200/80 bg-white p-6 shadow-sm"
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
                  {method.currency}
                </p>
                <h3 className="mb-5 text-lg font-bold text-foreground">{method.title}</h3>
                <dl className="space-y-4">
                  {method.details.map(([label, value]) => (
                    <div key={label} className="space-y-1">
                      <dt className="text-sm text-muted-foreground">{label}</dt>
                      <dd className="break-words font-semibold text-foreground">
                        {method.email ? (
                          <a
                            href={`mailto:${value}`}
                            className="inline-flex items-center gap-2 text-amber-900 underline underline-offset-4"
                          >
                            <Mail className="h-4 w-4 shrink-0" />
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
            <Button asChild variant="outline" className="rounded-lg">
              <Link href="/donate">View ministry donation details</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
