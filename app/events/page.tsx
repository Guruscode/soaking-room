import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, CalendarDays, Flower2, MapPin, Sparkles, UtensilsCrossed, Waves } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/site/page-hero"
import { Rays } from "@/components/site/rays"
import { cn } from "@/lib/utils"

const events = [
  {
    title: "The Soaking Room",
    subtitle: "A Sacred Gathering",
    date: "Sunday 18th October, 2026 · 4PM Prompt",
    venue: "Charis Hub, Atlantic Mall, Utako, Abuja",
    description: "An afternoon of deep worship, rest and encounter — come and soak in God's presence.",
    slug: "soaking-room",
    accent: "emerald" as const,
    icon: Waves,
    image: "/soaking-room.webp",
  },
  {
    title: "A Kitchen in the Sky",
    subtitle: "Jesus My Kingsman Redeemer",
    date: "Sunday 1st November, 2026 · 6PM – 8PM",
    venue: "Strictly by registration",
    description: "A call to dine with the divine — an evening set apart to feast in the presence of the King.",
    slug: "kitchen-in-the-sky",
    accent: "royal" as const,
    icon: UtensilsCrossed,
    image: "/kitchen-in-the-sky.webp",
  },
  {
    title: "The Spirit Spa",
    subtitle: "The Soaking Room Presents",
    date: "August 29th, 2026",
    venue: "ATW Center, CBD Abuja",
    description:
      "A signature women's worship experience — a sacred space where women can pause, breathe, and be renewed in the presence of God.",
    slug: "spirit-spa",
    accent: "blush" as const,
    icon: Flower2,
  },
]

const accents = {
  blush: { bg: "from-[#6B5544] via-[#5C4A3A] to-[#4A3D32]", text: "text-[#D8A8A0]", glow: "bg-[#D8A8A0]/25" },
  emerald: { bg: "from-emerald-950 via-teal-900 to-cyan-950", text: "text-emerald-300", glow: "bg-emerald-400/20" },
  royal: { bg: "from-[#1E1B4B] via-[#312E81] to-[#4C1D95]", text: "text-amber-300", glow: "bg-amber-300/15" },
}

function EventCard({ event }: { event: (typeof events)[number] }) {
  const Icon = event.icon
  const accent = accents[event.accent]

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "reveal-scale group relative block overflow-hidden rounded-[2rem] bg-gradient-to-br p-7 md:p-10 lg:p-12",
        accent.bg,
      )}
    >
      <div className={cn("pointer-events-none absolute -top-24 -right-24 size-80 rounded-full blur-3xl", accent.glow)} />
      <Rays className="pointer-events-none absolute -bottom-40 -left-40 size-96 text-white/[0.06] transition-transform duration-[2000ms] group-hover:rotate-45" />

      <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            Upcoming Event
          </span>

          <div className="space-y-3">
            <p className={cn("eyebrow", accent.text)}>{event.subtitle}</p>
            <h2 className="text-4xl font-light tracking-tight text-white md:text-5xl">{event.title}</h2>
            <p className="max-w-xl leading-relaxed text-white/70">{event.description}</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {[
              { icon: CalendarDays, text: event.date },
              { icon: MapPin, text: event.venue },
            ].map(({ icon: ItemIcon, text }) => (
              <span key={text} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/85 ring-1 ring-white/10">
                <ItemIcon className="size-4 shrink-0" />
                {text}
              </span>
            ))}
          </div>

          <span className="inline-flex h-12 items-center gap-3 rounded-full bg-white pr-1.5 pl-6 text-sm font-semibold text-ink">
            View Event
            <span className="grid size-9 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-4" />
            </span>
          </span>
        </div>

        <div className="hidden md:block">
          {event.image ? (
            <div className="w-52 rotate-3 overflow-hidden rounded-[1.5rem] shadow-2xl ring-1 ring-white/20 transition-transform duration-700 ease-[var(--ease-settle)] group-hover:rotate-0 group-hover:scale-105 lg:w-60">
              <Image src={event.image} alt={`${event.title} flyer`} width={480} height={600} sizes="240px" className="h-auto w-full" />
            </div>
          ) : (
            <div className="grid size-44 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
              <Icon className="size-16 text-white/80 transition-transform duration-700 group-hover:scale-110" />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <PageHero
        eyebrow="Upcoming Events"
        title={<span className="font-bold">Events</span>}
        description="Stay connected with The Soaking Room community. Join us for worship, prayer gatherings, and life-changing events."
      />

      <section className="container-page py-14 md:py-20">
        {events.length === 0 ? (
          <div className="space-y-3 rounded-[2rem] border border-dashed border-slate-300 bg-surface-soft py-20 text-center">
            <CalendarDays className="mx-auto size-12 text-slate-300" />
            <h2 className="text-xl font-semibold">No Upcoming Events</h2>
            <p className="text-slate-500">Check back soon for upcoming events.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
