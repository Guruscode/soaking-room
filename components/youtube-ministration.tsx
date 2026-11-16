import { ArrowUpRight, Youtube } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { LiteYouTube } from "@/components/site/lite-youtube"

const videos = [
  {
    id: "fUHk79ZPmcU",
    title: "Unconditional Worship | Moses Akoh",
    description:
      "A worship session recorded at Graceville Christian Centre in Abuja, emphasizing healing, the Holy Spirit, and surrendering one's life as worship.",
  },
  {
    id: "Ezn6P0Dr8j0",
    title: "Worship Teaching Series (Christ’s School) | Moses Akoh | Soaking Room",
    description:
      "Part 1 of a teaching series on true worship in Spirit and Truth, exploring Jesus' life and the call to offer spiritual sacrifices.",
  },
  {
    id: "M3hxm234cwA",
    title: "High Praise & Warfare | Moses Akoh",
    description:
      "A powerful session of high praise and spiritual warfare at Qavah Evangelical Ministries, with declarations of love, joy, and invocation of the Holy Spirit.",
  },
]

export function YoutubeMinistration() {
  return (
    <section className="bg-[#201e1a] py-20 text-white md:py-28">
      <div className="container-page">
        <SectionHeading
          tone="dark"
          eyebrow="YouTube"
          title={
            <>
              Latest <span className="font-bold">Ministrations</span>
            </>
          }
          description="Watch Moses Akoh's latest ministrations and worship sessions on YouTube"
          action={
            <a
              href="https://www.youtube.com/@TheMosesAkoh"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 items-center gap-3 border border-white/30 px-5 text-sm text-white transition-colors hover:border-[#c4a36a] hover:text-[#e2c99a]"
            >
              <Youtube className="size-5 text-[#d6bc8b]" />
              Subscribe on YouTube
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          }
        />

        <div className="reveal-stagger mt-14 grid gap-6 md:grid-cols-3">
          {videos.map((video) => (
            <article key={video.id} className="overflow-hidden border-t border-white/20 pt-4">
              <LiteYouTube id={video.id} title={video.title} />
              <div className="space-y-2 p-6">
                <h4 className="font-semibold leading-snug text-white">{video.title}</h4>
                <p className="text-sm leading-relaxed text-slate-400">{video.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
