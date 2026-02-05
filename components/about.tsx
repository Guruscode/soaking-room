"use client"
import Image from "next/image"
import { motion } from "framer-motion" // Add this import if you want animations (optional but recommended)
import { Volume2 } from "lucide-react" // Add lucide-react if not already installed: npm install lucide-react

export function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Images Grid - unchanged */}
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
                alt="Moses Akoh portrait"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-10"> {/* Increased spacing for better separation */}
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

            {/* === NEW SONG ALERT SECTION === */}
            <div className="relative bg-gradient-to-br from-blue-50 via-cyan-50/50 to-white rounded-2xl p-8 shadow-xl border border-cyan-100 overflow-hidden">
              {/* Optional subtle animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 animate-pulse-slow opacity-60 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-3xl md:text-4xl font-extrabold text-foreground flex items-center gap-3">
                    <Volume2 className="w-9 h-9 text-cyan-600 animate-pulse" />
                    New Song Alert
                  </h4>
                  <span className="px-4 py-1.5 bg-cyan-600 text-white text-sm font-bold rounded-full shadow-md uppercase tracking-wide">
                    Released Jan 5, 2026
                  </span>
                </div>

                <h5 className="text-2xl md:text-3xl font-bold text-cyan-700">
                  PROPHESY
                </h5>

                <p className="text-lg text-foreground/90 leading-relaxed">
                  A powerful prophetic anthem and declaration for 2026! Written and executive produced by Moses Akoh, this sound activates faith, calls forth divine promises, and invites the Holy Spirit to move. Featuring rich production, anointed vocals, and a stirring official music video — it's time to prophesy your breakthrough!
                </p>

                {/* Embedded YouTube Video - responsive aspect ratio */}
                <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-cyan-200/40">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/edwrLWhFx6o"
                    title="Moses Akoh | PROPHESY | Official Music Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <p className="text-center text-foreground/70 italic text-base">
                  "Something will SHIFT inside you as you listen..."<br />
                  Watch now, declare it, and let the Spirit move! Available on all major platforms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
