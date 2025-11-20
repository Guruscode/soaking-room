"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"

export function YoutubeMinistration() {
  const videos = [
    {
      id: "fUHk79ZPmcU",
      title: "Unconditional Worship | Moses Akoh",
      description: "A worship session recorded at Graceville Christian Centre in Abuja, emphasizing healing, the Holy Spirit, and surrendering one's life as worship.",
    },
    {
      id: "Ezn6P0Dr8j0",
      title: "Worship Teaching Series (Christ’s School) | Moses Akoh | Soaking Room",
      description: "Part 1 of a teaching series on true worship in Spirit and Truth, exploring Jesus' life and the call to offer spiritual sacrifices.",
    },
    {
      id: "M3hxm234cwA",
      title: "High Praise & Warfare | Moses Akoh",
      description: "A powerful session of high praise and spiritual warfare at Qavah Evangelical Ministries, with declarations of love, joy, and invocation of the Holy Spirit.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Latest Ministrations</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch Moses Akoh's latest ministrations and worship sessions on YouTube
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {videos.map((video, i) => (
            <Card key={i} className="rounded-xl overflow-hidden border-border hover:shadow-lg transition-shadow">
              <div className="relative bg-black aspect-video flex items-center justify-center group cursor-pointer">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                  <Play className="w-16 h-16 text-white fill-white" />
                </div>
              </div>
              <CardContent className="pt-4">
                <h4 className="font-semibold text-foreground mb-2">{video.title}</h4>
                <p className="text-sm text-muted-foreground">{video.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://www.youtube.com/@TheMosesAkoh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors"
          >
            Subscribe on YouTube
          </a>
        </div>
      </div>
    </section>
  )
}