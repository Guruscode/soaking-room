import Image from "next/image"
import { Check, Volume2 } from "lucide-react"
import { Eyebrow } from "@/components/site/section-heading"
import { LiteYouTube } from "@/components/site/lite-youtube"

const reasons = [
  "Reach more people globally with messages of faith and worship",
  "Support quality music production and worship experiences",
  "Enable community outreach and spiritual programs worldwide",
  "Help sustain ongoing ministry and worship initiatives",
]

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-surface-soft py-20 md:py-32">
      <div className="container-page">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="reveal-scale relative aspect-[4/5] overflow-hidden bg-slate-200">
                <Image src="/image-16.jpg" alt="Moses performing on stage" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 hover:scale-[1.02]" />
              </div>
              <div className="reveal-scale relative mt-12 aspect-[4/5] overflow-hidden bg-slate-200">
                <Image src="/image-13.jpg" alt="Moses singing with guitar" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 hover:scale-[1.02]" />
              </div>
              <div className="reveal-scale relative col-span-2 aspect-[16/9] overflow-hidden bg-slate-200">
                <Image src="/image-20.jpg" alt="Moses Akoh portrait" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-[center_30%] transition-transform duration-700 hover:scale-[1.02]" />
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-10">
            <div className="reveal space-y-6">
              <Eyebrow>Worship • Obedience • Eyes on Jesus</Eyebrow>
              <h3 className="font-serif text-4xl tracking-tight text-ink md:text-5xl">
                About <span className="font-bold">The Soaking Room</span>
              </h3>
              <div className="space-y-4 text-base leading-relaxed text-slate-600 md:text-[1.05rem]">
                <p>
                  The Soaking Room is a worship movement founded by Moses Akoh, a Nigerian pastor, gospel artist,
                  songwriter, and producer. This movement, which began in the Philippines, has expanded globally, aiming
                  to glorify God and foster intimacy with Him through music and worship.
                </p>
                <p>
                  Moses Akoh&apos;s music style blends rock, contemporary, and African gospel sounds, inspiring listeners to
                  deepen their connection with God. As the founder and president of The Soaking Room, Akoh has released
                  several albums, including &quot;The Sound,&quot; &quot;Satisfied,&quot; and &quot;Volume of the Book&quot;. His songs, such as &quot;Mighty
                  God&quot; and &quot;Come and See,&quot; have gained significant popularity, with millions of streams on platforms like
                  Boomplay.
                </p>
                <p>
                  The Soaking Room isn&apos;t just a music project but a community centred around worship and spiritual growth,
                  reflecting Moses Akoh&apos;s passion for ministry and music.
                </p>
              </div>
            </div>

            <div className="reveal border-t border-slate-300 pt-6">
              <h4 className="font-serif text-xl text-ink">Why Support This Movement?</h4>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {reasons.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-strong" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* New release */}
        <div className="reveal-scale mt-24 border-t border-[#c4a36a] bg-[#201e1a] p-6 text-white md:mt-32 md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-[#d6bc8b]">
                  <Volume2 className="size-4" />
                  <span className="text-xs uppercase tracking-[0.18em]">New release</span>
                </span>
                <span className="text-xs uppercase tracking-[0.15em] text-white/55">
                  Out now · Jan 2026
                </span>
              </div>

              <h4 className="font-serif text-5xl tracking-tight text-[#e2c99a] md:text-7xl">Prophesy</h4>

              <p className="text-lg leading-relaxed text-white/80">
                A powerful prophetic declaration and anthem for 2026! Written and executive produced by Moses Akoh.
                Declare it, receive it — something will SHIFT as you listen and watch. The Spirit has been poured out!
              </p>

              <blockquote className="border-l border-[#c4a36a] pl-5 text-white/80">
                <p className="font-serif text-lg italic">&quot;PROPHESY PROPHESY... Speak into your year!&quot;</p>
                <p className="mt-2 text-sm text-white/55">
                  Available everywhere — YouTube, Spotify, Apple Music, Boomplay &amp; more. Watch, listen, and begin to
                  prophesy your breakthrough!
                </p>
              </blockquote>
            </div>

            <LiteYouTube
              id="edwrLWhFx6o"
              title="Moses Akoh | PROPHESY | Official Music Video"
              className="border border-white/15"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
