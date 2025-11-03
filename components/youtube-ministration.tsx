"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"

export function YoutubeMinistration() {
  const videos = [
    {
      id: "dQw4w9WgXcQ",
      title: "Latest Ministration",
      description: "Watch the latest ministration from Moses Akor",
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Gospel Performance",
      description: "Powerful gospel performance and worship",
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Ministry Message",
      description: "Inspiring message through music",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Latest Ministrations</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch Moses Akor's latest ministrations and worship sessions on YouTube
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
            href="https://www.youtube.com/channel/UCMNM6jPTpnGywuyNh-ta1yw"
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
