import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Sparkles, ArrowRight, Droplets } from "lucide-react"
import Link from "next/link"

const events = [
  {
    title: "The Spirit Spa",
    subtitle: "The Soaking Room Presents",
    date: "August 29th, 2026",
    venue: "ATW Center, CBD Abuja",
    description:
      "A sacred gathering for worship, prayer, and spiritual refreshment. Come and be renewed in the presence of God.",
    slug: "spirit-spa",
    accent: "emerald" as const,
    icon: Droplets,
  },
]

function EventCard({ event }: { event: (typeof events)[number] }) {
  const Icon = event.icon
  const gradientFrom =
    event.accent === "emerald" ? "from-emerald-950 via-teal-900 to-cyan-950" : "from-blue-950 via-indigo-900 to-violet-950"
  const accentLight = event.accent === "emerald" ? "text-emerald-300" : "text-blue-300"
  const badgeBg = event.accent === "emerald" ? "bg-emerald-500/20 border-emerald-300/30" : "bg-blue-500/20 border-blue-300/30"

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientFrom} p-8 md:p-12 transition-transform duration-500 hover:scale-[1.02]`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

        <div className="relative grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-medium uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Upcoming Event
            </div>

            <div className="space-y-2">
              <p className={`${accentLight} font-semibold tracking-widest text-xs uppercase`}>{event.subtitle}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h2>
              <p className="text-white/70 max-w-lg leading-relaxed">{event.description}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <CalendarDays className="w-4 h-4 shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{event.venue}</span>
              </div>
            </div>

            <Button
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 rounded-xl"
              size="lg"
            >
              View Event
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className={`w-32 h-32 rounded-full ${badgeBg} backdrop-blur-sm border flex items-center justify-center`}>
              <Icon className="w-14 h-14 text-white/80" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">Events</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Stay connected with The Soaking Room community. Join us for worship, prayer gatherings, and
            life-changing events.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card py-20 text-center space-y-3">
            <CalendarDays className="w-12 h-12 text-muted-foreground/50 mx-auto" />
            <h2 className="text-xl font-semibold">No Upcoming Events</h2>
            <p className="text-muted-foreground">Check back soon for upcoming events.</p>
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
