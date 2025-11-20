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
                  The Soaking Room 
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
               
              </div>
            </div>

            {/* Right Image */}
     <div className="relative h-[350px] md:h-[450px] lg:h-[650px] min-h-96 rounded-2xl overflow-hidden shadow-2xl
                group
                border border-white/10
                bg-gradient-to-br from-white/5 via-transparent to-white/5
                p-1 md:p-2"> {/* This "p-1" creates the outer glow trick */}

  {/* Inner container that holds the image */}
  <div className="h-full w-full rounded-2xl overflow-hidden 
                  bg-black/20 
                  ring-1 ring-white/20 
                  shadow-inner">
    <Image
      src="/image-1.JPG"
      alt="Moses Akor - Music Minister"
      fill
      className="object-cover transition-transform duration-1000 group-hover:scale-105"
      priority
    />
  </div>

  {/* Optional subtle floating glow orb (very elegant) */}
  <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl" />
  <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
</div>
          </div>
        </div>
      </section>

      <DonationModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
