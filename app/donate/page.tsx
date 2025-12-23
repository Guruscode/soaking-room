import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Donation } from "@/components/donation"
import { BankDetails } from "@/components/bank-details"

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

        <Donation />
        <BankDetails />
      </main>
      <Footer />
    </>
  )
}
