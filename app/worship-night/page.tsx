import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { WorshipNightExperience } from "@/components/events/worship-night-experience"

export const metadata: Metadata = {
  title: "Worship Night with Moses Akoh | The Soaking Room",
  description:
    "Join The Soaking Room for Worship Night with Moses Akoh on Sunday, 29th November 2026, in Utako, Abuja.",
  openGraph: {
    title: "Worship Night with Moses Akoh",
    description: "Sunday, 29th November 2026 · 4 PM WAT · Celeb8 Centre, Utako, Abuja",
    images: ["/worship-night.jpeg"],
  },
}

export default function WorshipNightPage() {
  return (
    <>
      <Header />
      <WorshipNightExperience />
      <Footer />
    </>
  )
}
