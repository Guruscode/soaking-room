"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Music, Radio, Headphones, Share2 } from "lucide-react"

export function MusicLinks() {
  const platforms = [
    {
      name: "Apple Music",
      icon: Music,
      url: "https://music.apple.com/ng/artist/moses-akoh/1224355061",
      color: "bg-black hover:bg-gray-900",
      description: "Listen on Apple Music",
    },
    {
      name: "YouTube Music",
      icon: Radio,
      url: "https://music.youtube.com/channel/UCMNM6jPTpnGywuyNh-ta1yw?feature=gws_kp_artist",
      color: "bg-red-600 hover:bg-red-700",
      description: "Stream on YouTube Music",
    },
    {
      name: "AudioMack",
      icon: Headphones,
      url: "https://audiomack.com/moses-akoh",
      color: "bg-orange-500 hover:bg-orange-600",
      description: "Discover on AudioMack",
    },
    {
      name: "SoundCloud",
      icon: Share2,
      url: "https://soundcloud.com/ocheakoh",
      color: "bg-orange-400 hover:bg-orange-500",
      description: "Follow on SoundCloud",
    },
  ]

  const socialPlatforms = [
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@mosesakoh",
      icon: "🎵",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/mosesakohoche/",
      icon: "f",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/channel/UCMNM6jPTpnGywuyNh-ta1yw",
      icon: "▶",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Listen & Follow</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stream Moses Akor's music across all major platforms and stay connected on social media
          </p>
        </div>

        {/* Music Streaming Platforms */}
        <div className="mb-12">
          <h4 className="text-xl font-semibold text-foreground mb-6 text-center">Music Streaming</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platforms.map((platform, i) => {
              const Icon = platform.icon
              return (
                <a key={i} href={platform.url} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className="rounded-xl border-border h-full hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                      <div
                        className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${platform.color} text-white transition-colors`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <h5 className="font-semibold text-foreground mb-1">{platform.name}</h5>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-muted/50 rounded-xl p-8">
          <h4 className="text-xl font-semibold text-foreground mb-6 text-center">Follow on Social Media</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {socialPlatforms.map((platform, i) => (
              <a
                key={i}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors"
              >
                {platform.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
