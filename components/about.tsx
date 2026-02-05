"use client"
import Image from "next/image"
import { Volume2 } from "lucide-react" // npm install lucide-react if needed

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

          {/* Content - unchanged, but reduced bottom spacing */}
          <div className="space-y-8 pb-12 md:pb-0">
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

        {/* === VERY PRONOUNCED NEW SONG ALERT - Full-width standout section === */}
        <div className="mt-16 md:mt-24">
          <div className="relative bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950 rounded-3xl p-10 md:p-16 shadow-2xl overflow-hidden border-4 border-cyan-400/30">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-blue-500/20 animate-gradient-x opacity-70 pointer-events-none" />

            <div className="relative z-10 text-center space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                <Volume2 className="w-16 h-16 md:w-20 md:h-20 text-cyan-300 animate-pulse" />
                <h3 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg">
                  NEW SONG ALERT!
                </h3>
                <span className="px-6 py-3 bg-yellow-400 text-black text-xl md:text-2xl font-bold rounded-full shadow-lg animate-bounce-slow uppercase">
                  OUT NOW • Jan 2026
                </span>
              </div>

              <h4 className="text-4xl md:text-6xl font-bold text-cyan-200 drop-shadow-md">
                PROPHESY
              </h4>

              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto">
                A powerful prophetic declaration and anthem for 2026! Written and executive produced by Moses Akoh.  
                Declare it, receive it — something will SHIFT as you listen and watch. The Spirit has been poured out!
              </p>

              {/* Larger embedded video */}
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-8 border-cyan-300/40 max-w-5xl mx-auto">
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

              <p className="text-lg md:text-xl text-cyan-100 italic font-medium">
                "PROPHESY PROPHESY... Speak into your year!"<br />
                Available everywhere — YouTube, Spotify, Apple Music, Boomplay & more.  
                Watch, listen, and begin to prophesy your breakthrough!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
