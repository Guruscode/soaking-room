"use client"

import Image from "next/image"

export function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/image-16.jpg"
                alt="Moses performing on stage"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/image-13.jpg"
                alt="Moses singing with guitar"
                fill
                className="object-cover"
              />
            </div>
            <div className="col-span-2 relative h-56 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/image-20.jpg"
                alt="Moses Akor portrait"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">About The Soaking Room</h3>
              <p className="text-base text-foreground/80 leading-relaxed mb-4">
                The Soaking Room is a worship movement founded by Moses Akoh, a Nigerian pastor, gospel artist,
                songwriter, and producer. This movement, which began in the Philippines, has expanded globally, aiming
                to glorify God and foster intimacy with Him through music and worship.
              </p>
              <p className="text-base text-foreground/80 leading-relaxed mb-4">
                Moses Akoh's music style blends rock, contemporary, and African gospel sounds, inspiring listeners to
                deepen their connection with God. As the founder and president of The Soaking Room, Akoh has released
                several albums, including "The Sound," "Satisfied," and "Volume of the Book". His songs, such as "Mighty
                God" and "Come and See," have gained significant popularity, with millions of streams on platforms like
                Boomplay.
              </p>
              <p className="text-base text-foreground/80 leading-relaxed">
                The Soaking Room isn't just a music project but a community centred around worship and spiritual growth,
                reflecting Moses Akoh's passion for ministry and music.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-foreground">Why Support This Movement?</h4>
              <ul className="space-y-3">
                {[
                  "Reach more people globally with messages of faith and worship",
                  "Support quality music production and worship experiences",
                  "Enable community outreach and spiritual programs worldwide",
                  "Help sustain ongoing ministry and worship initiatives",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-foreground/80">
                    <span className="text-primary font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
