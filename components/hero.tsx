"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useState } from "react"
import { DonationModal } from "./donation-modal"

export function Hero() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  The Soaking Room: A Worship Movement
                </h2>
                <p className="text-lg text-muted-foreground">
                  Founded by Moses Akoh, a Nigerian pastor and gospel artist, The Soaking Room is a global worship
                  movement dedicated to fostering intimacy with God through music and worship.
                </p>
              </div>
              <p className="text-base text-foreground/80 leading-relaxed">
                Your donation helps sustain this worship movement, enabling us to reach more people with messages of
                hope, faith, and spiritual growth across the globe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                  onClick={() => setModalOpen(true)}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-lg border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 md:h-full min-h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-28%20at%206.16.24%20AM-3YxUOeRLfwXcKKoi0sA87awJUlxhsB.jpeg"
                alt="Moses Akor - Music Minister"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <DonationModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
