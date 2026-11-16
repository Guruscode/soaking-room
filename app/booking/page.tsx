import { AlertTriangle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/site/page-hero"
import BookingWizard from "@/components/booking-wizard"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Book Moses Akoh",
  description:
    "Invite Moses Akoh to lead worship at your church or ministry event. Submit a hosting request for The Soaking Room team to review.",
  path: "/booking",
})

export default function BookingPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <PageHero
          eyebrow="Ministry Booking"
          title={
            <>
              Host <span className="font-bold text-brand">Minister Moses Akoh</span>
            </>
          }
          description={
            <div className="space-y-3">
              <p className="eyebrow text-ink">MINISTERIAL HOSTING REQUIREMENT QUESTIONNAIRE</p>
              <p className="text-base md:text-lg">
                Minister Moses Akoh is a worship leader, pastor, songwriter, and missionary with a heart to lead God&rsquo;s
                people into His presence through music that blends Gospel, Contemporary, Rock, and African styles. Select
                your preferred date(s) on the calendar, complete the questionnaire, and our team will review your request.
              </p>
            </div>
          }
        >
          <div className="flex max-w-2xl items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 md:text-base">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <p>
              <strong>Important:</strong> Due to the high demand and limited availability in Minister Moses Akoh&rsquo;s
              booking schedule, we strongly recommend submitting your booking request at least <strong>30 days</strong>{" "}
              before the proposed date of your programme to allow sufficient time for scheduling and confirmation.
            </p>
          </div>
        </PageHero>

        <section className="container-page py-14 md:py-20">
          <div className="reveal mx-auto max-w-5xl">
            <BookingWizard />
          </div>
          <p className="mt-12 text-center text-sm text-slate-500">
            Bookings remain pending until approved by the ministry team. You will be notified by email at every step.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
