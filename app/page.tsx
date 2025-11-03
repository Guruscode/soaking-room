import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Gallery } from "@/components/gallery"
import { Testimonials } from "@/components/testimonials"
import { Donation } from "@/components/donation"
import { YoutubeMinistration } from "@/components/youtube-ministration"
import { MusicLinks } from "@/components/music-links"
import { BankDetails } from "@/components/bank-details"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Gallery />
      <Testimonials />
      <YoutubeMinistration />
      <Donation />
      <MusicLinks />
      <BankDetails />
      <Footer />
    </main>
  )
}
