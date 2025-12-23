"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Music, Radio, Headphones, Share2, Instagram, Facebook, Youtube, Music2 } from "lucide-react"

export function MusicLinks() {
  const featuredLinks = [
    {
      name: "Apple Music",
      subtitle: "Listen on Apple Music",
      url: "https://music.apple.com/ng/artist/moses-akoh/1224355061",
      icon: Music,
      badge: "Stream",
      description: "Albums, singles, and curated essentials.",
      color: "from-gray-900 to-gray-700",
      text: "text-white",
    },
    {
      name: "YouTube Music",
      subtitle: "Stream on YouTube Music",
      url: "https://music.youtube.com/channel/UCMNM6jPTpnGywuyNh-ta1yw?feature=gws_kp_artist",
      icon: Radio,
      badge: "Watch",
      description: "Videos, live moments, and worship sets.",
      color: "from-red-500 to-orange-500",
      text: "text-white",
    },
    {
      name: "AudioMack",
      subtitle: "Discover on AudioMack",
      url: "https://audiomack.com/moses-akoh",
      icon: Headphones,
      badge: "Discover",
      description: "Trending uploads and community favorites.",
      color: "from-amber-500 to-orange-600",
      text: "text-white",
    },
    {
      name: "SoundCloud",
      subtitle: "Follow on SoundCloud",
      url: "https://soundcloud.com/ocheakoh",
      icon: Share2,
      badge: "Follow",
      description: "Deep cuts, demos, and special drops.",
      color: "from-orange-400 to-amber-500",
      text: "text-white",
    },
    {
      name: "Spotify",
      subtitle: "Stream on Spotify",
      url: "https://open.spotify.com/artist/6mUEeS22r3xn9ksKKgENrT?si=i0BtWGX5Sgme1jiX-e3C7w",
      icon: Music2,
      badge: "Stream",
      description: "Latest releases, playlists, and soaking sessions.",
      color: "from-[#1DB954] to-emerald-600",
      text: "text-white",
    },
  ]

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
      url: "https://audiomack.com/mosesakoh",
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
    {
      name: "Spotify",
      icon: Music2,
      url: "https://open.spotify.com/artist/6mUEeS22r3xn9ksKKgENrT?si=i0BtWGX5Sgme1jiX-e3C7w",
      color: "bg-[#1DB954] hover:bg-[#18a348]",
      description: "Stream on Spotify",
    },
  ]

  const socialPlatforms = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/mosesakoh?igsh=amgyaGV5c3FxeTJo&utm_source=qr",
      icon: Instagram,
      color: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#515bd4] hover:brightness-95",
    },
    {
      name: "Spotify",
      url: "https://open.spotify.com/artist/6mUEeS22r3xn9ksKKgENrT?si=i0BtWGX5Sgme1jiX-e3C7w",
      icon: Music2,
      color: "bg-[#1DB954] hover:bg-[#18a348]",
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@mosesakoh",
      icon: Music2,
      color: "bg-black hover:bg-black/90",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/mosesakohoche/",
      icon: Facebook,
      color: "bg-[#1877F2] hover:bg-[#166ad8]",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/channel/UCMNM6jPTpnGywuyNh-ta1yw",
      icon: Youtube,
      color: "bg-red-600 hover:bg-red-700",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Listen & Follow</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stream Moses Akoh's music across all major platforms and stay connected on social media
          </p>
        </div>

        {/* Featured Ministration Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {featuredLinks.map((link, idx) => {
            const Icon = link.icon
            return (
              <a
                key={`${link.name}-${idx}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl overflow-hidden shadow-lg bg-foreground text-background transition-transform hover:-translate-y-1"
              >
                <div className={`h-full p-6 md:p-7 bg-gradient-to-br ${link.color} ${link.text}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide bg-white/20 px-2 py-1 rounded-full">
                          {link.badge}
                        </span>
                        <span className="text-sm opacity-90">{link.subtitle ?? "Ministration"}</span>
                      </div>
                      <h4 className="text-2xl font-bold leading-tight">{link.name}</h4>
                      <p className="text-sm opacity-90 max-w-xl">{link.subtitle}</p>
                      <p className="text-xs opacity-80">{link.description}</p>
                    </div>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* Music Streaming Platforms */}
        {/* <div className="mb-12">
          <h4 className="text-xl font-semibold text-foreground mb-6 text-center">Music Streaming</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platforms.map((platform, i) => {
              const Icon = platform.icon
              return (
                <a key={i} href={platform.url} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className="rounded-xl border-border h-full hover:shadow-xl transition-all cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                      <div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${platform.color} text-white transition-colors shadow-md`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <h5 className="font-semibold text-foreground mb-1">{platform.name}</h5>
                      <p className="text-sm text-muted-foreground max-w-xs">{platform.description}</p>
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        </div> */}

        {/* Social Media Links */}
        <div className="bg-muted/50 rounded-xl p-8">
          <h4 className="text-xl font-semibold text-foreground mb-6 text-center">Follow on Social Media</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {socialPlatforms.map((platform, i) => {
              const Icon = platform.icon
              return (
                <a
                  key={i}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-border bg-background hover:shadow-lg transition-all"
                >
                  <div className="p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${platform.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{platform.name}</p>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        Tap to connect
                      </p>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
