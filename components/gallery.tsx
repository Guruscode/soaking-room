"use client"

import Image from "next/image"

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
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ministry Gallery</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Moments from our worship services and ministry events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryImages.map((image, i) => (
            <div
              key={i}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <h4 className="text-white font-semibold text-lg">{image.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
