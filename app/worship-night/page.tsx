import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { WorshipNightExperience } from "@/components/events/worship-night-experience"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Worship Night with Moses Akoh",
  description:
    "Join The Soaking Room for Worship Night with Moses Akoh on Sunday, 29 November 2026, at Celeb8 Centre in Utako, Abuja.",
  path: "/worship-night",
  image: "/worship-night.jpeg",
})

export default function WorshipNightPage() {
  return (
    <>
      <Header />
      <WorshipNightExperience />
      <Footer />
    </>
  )
}
