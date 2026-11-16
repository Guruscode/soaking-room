import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { cn } from "@/lib/utils"

const galleryImages = [
  { src: "/image-1.JPG", alt: "Moses Akoh portrait", title: "Ministry Leader", span: "md:row-span-2" },
  { src: "/image-5.jpg", alt: "Moses performing on stage with guitar", title: "Live Performance", span: "" },
  { src: "/image-3.jpg", alt: "Moses singing with guitar", title: "Worship Session", span: "" },
]

export function Gallery() {
  return (
    <section className="bg-surface-soft py-20 md:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="A few moments"
          title={<>From the ministry</>}
          description="Moments from worship services, live ministrations, and encounters in His presence."
          action={
            <Link
              href="/gallery"
              className="group inline-flex min-h-11 items-center gap-2 border-b border-[#9a7946] text-sm text-[#201e1a] transition-colors hover:text-[#907447]"
            >
              View the gallery
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-3 md:h-[38rem] md:grid-cols-[1.1fr_1fr] md:grid-rows-2 md:gap-4">
          {galleryImages.map((image) => (
            <Link
              key={image.src}
              href="/gallery"
              className={cn("group relative block h-80 overflow-hidden bg-[#ded8ce] md:h-auto", image.span)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                quality={60}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-7">
                <h4 className="font-serif text-xl text-white">{image.title}</h4>
                <ArrowRight className="size-4 text-white/80 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
