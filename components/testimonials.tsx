"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Community Member",
      role: "Ministry Supporter",
      text: "The music ministry has touched my heart deeply. Every performance brings me closer to my faith.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-28%20at%206.16.24%20AM-3YxUOeRLfwXcKKoi0sA87awJUlxhsB.jpeg",
    },
    {
      name: "Worship Attendee",
      role: "Regular Participant",
      text: "Moses's dedication to spreading the gospel through music is truly inspiring and transformative.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-28%20at%206.16.39%20AM%20%281%29-rCPKxnMGDltJtsNtcy0RkaWWMQKAOP.jpeg",
    },
    {
      name: "Ministry Partner",
      role: "Long-time Supporter",
      text: "Supporting this ministry has been one of the most fulfilling decisions I've made.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-28%20at%206.16.39%20AM-QMmoyoDFFRK2XS96d7wWsyU38fYpdZ.jpeg",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What People Say</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from those whose lives have been touched by this ministry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="border-border rounded-xl hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
