import { ArrowUpRight, Facebook, Headphones, Instagram, Music, Music2, Radio, Share2, Youtube } from "lucide-react"

const featuredLinks = [
  {
    name: "Apple Music",
    url: "https://music.apple.com/ng/artist/moses-akoh/1224355061",
    icon: Music,
    description: "Albums, singles, and curated essentials.",
  },
  {
    name: "YouTube Music",
    url: "https://music.youtube.com/channel/UCMNM6jPTpnGywuyNh-ta1yw?feature=gws_kp_artist",
    icon: Radio,
    description: "Videos, live moments, and worship sets.",
  },
  {
    name: "AudioMack",
    url: "https://audiomack.com/moses-akoh",
    icon: Headphones,
    description: "Trending uploads and community favorites.",
  },
  {
    name: "SoundCloud",
    url: "https://soundcloud.com/ocheakoh",
    icon: Share2,
    description: "Deep cuts, demos, and special drops.",
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/artist/6mUEeS22r3xn9ksKKgENrT?si=i0BtWGX5Sgme1jiX-e3C7w",
    icon: Music2,
    description: "Latest releases, playlists, and soaking sessions.",
  },
]

const socialPlatforms = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/mosesakoh?igsh=amgyaGV5c3FxeTJo&utm_source=qr",
    icon: Instagram,
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/artist/6mUEeS22r3xn9ksKKgENrT?si=i0BtWGX5Sgme1jiX-e3C7w",
    icon: Music2,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@mosesakoh",
    icon: Music2,
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/mosesakohoche/",
    icon: Facebook,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/channel/UCMNM6jPTpnGywuyNh-ta1yw",
    icon: Youtube,
  },
]

export function MusicLinks() {
  return (
    <section id="music" className="bg-white py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[#907447]">Listen · Watch · Follow</p>
          <h2 className="mt-4 font-serif text-4xl tracking-tight text-[#201e1a] md:text-5xl">Music &amp; ministry</h2>
          <p className="mt-4 text-base leading-7 text-[#625e55]">
            Find Moses Akoh&apos;s music and worship sessions on your preferred platform.
          </p>
        </div>

        <div className="mt-10 grid border-y border-[#e8e2d8] sm:grid-cols-2 lg:grid-cols-5">
          {featuredLinks.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-40 flex-col justify-between border-b border-[#e8e2d8] p-5 transition-colors hover:bg-[#f7f5f0] sm:border-r sm:p-6 lg:border-b-0"
              >
                <span className="flex items-center justify-between text-[#907447]">
                  <Icon className="size-5" strokeWidth={1.5} />
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="mt-8">
                  <span className="block font-serif text-xl text-[#201e1a]">{link.name}</span>
                  <span className="mt-1 block text-xs leading-5 text-[#777166]">{link.description}</span>
                </span>
              </a>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-serif text-xl text-[#201e1a]">Stay connected</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon
              return (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform.name}
                  className="inline-flex items-center gap-2 text-sm text-[#625e55] transition-colors hover:text-[#907447]"
                >
                  <Icon className="size-4" />
                  {platform.name}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
