"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Gallery() {
  const galleryImages = [
    {
      src: "/image-1.JPG",
      alt: "Moses Akoh portrait",
      title: "Ministry Leader",
    },
    {
      src: "image-2.jpg",
      alt: "Moses performing on stage with guitar",
      title: "Live Performance",
    },
    {
      src: "image-3.jpg",
      alt: "Moses singing with guitar",
      title: "Worship Session",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">Ministry Gallery</h3>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Moments from worship services, live ministrations, and encounters in His presence.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition"
          >
            View More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryImages.map((image, i) => (
            <div
              key={i}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-black/5"
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/80">Featured</p>
                  <h4 className="text-white font-semibold text-lg">{image.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
