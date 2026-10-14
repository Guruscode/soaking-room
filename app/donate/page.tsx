import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BankDetails } from "@/components/bank-details"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DonatePage() {
  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <section className="bg-gradient-to-br from-cyan-50 via-white to-emerald-50 border-b border-muted/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Partner With Us</p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Partner with us by sowing, as we take the Gospel of Jesus, through worship, to all nations.
              </h1>
            </div>
          </div>
        </section>

        <section className="border-b border-amber-200/70 bg-amber-50/70">
          <div className="max-w-6xl mx-auto flex flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">Special event</p>
              <h2 className="text-xl font-bold text-foreground">Giving to Worship Night?</h2>
              <p className="text-sm text-muted-foreground">
                View the event poster and dedicated giving details.
              </p>
            </div>
            <Button asChild className="rounded-lg bg-amber-800 text-white hover:bg-amber-900">
              <Link href="/worship-night-donate">
                Give to Worship Night
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <BankDetails />
      </main>
      <Footer />
    </>
  )
}
