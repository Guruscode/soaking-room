import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/site/page-hero"
import { GalleryGrid } from "@/components/site/gallery-grid"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Worship and Ministry Photo Gallery",
  description:
    "Browse photos of Moses Akoh, live worship, and ministry gatherings from The Soaking Room.",
  path: "/gallery",
  image: "/image-1.JPG",
})

const galleryImages = [
  { src: "/image-1.JPG", alt: "Image 1", width: 2400, height: 3000 },
  { src: "/image-2.jpg", alt: "Image 2", width: 1920, height: 2400 },
  { src: "/image-3.jpg", alt: "Image 3", width: 2400, height: 1600 },
  { src: "/image-4.jpg", alt: "Image 4", width: 1365, height: 1365 },
  { src: "/image-5.jpg", alt: "Image 5", width: 1440, height: 1799 },
  { src: "/image-6.jpg", alt: "Image 6", width: 1440, height: 960 },
  { src: "/image-7.jpg", alt: "Image 7", width: 1080, height: 1346 },
  { src: "/image-8.jpg", alt: "Image 8", width: 1440, height: 960 },
  { src: "/image-9.jpg", alt: "Image 9", width: 1440, height: 1800 },
  { src: "/image-10.jpg", alt: "Image 10", width: 1440, height: 901 },
  { src: "/image-11.jpg", alt: "Image 11", width: 1440, height: 1799 },
  { src: "/image-12.jpg", alt: "Image 12", width: 1440, height: 1800 },
  { src: "/image-13.jpg", alt: "Image 13", width: 1440, height: 1800 },
  { src: "/image-14.jpg", alt: "Image 14", width: 1440, height: 1800 },
  { src: "/image-15.jpg", alt: "Image 15", width: 1440, height: 1914 },
  { src: "/image-16.jpg", alt: "Image 16", width: 1440, height: 1791 },
  { src: "/image-17.jpg", alt: "Image 17", width: 1440, height: 1800 },
  { src: "/image-18.jpg", alt: "Image 18", width: 1537, height: 2048 },
  { src: "/image-19.jpg", alt: "Image 19", width: 1364, height: 1364 },
  { src: "/image-20.jpg", alt: "Image 20", width: 2048, height: 2048 },
]

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <PageHero
          eyebrow="Ministry Gallery"
          title={<span className="font-bold">Gallery</span>}
          description="Moments from worship services, live ministrations, and encounters in His presence."
        />
        <div className="container-page py-14 md:py-20">
          <GalleryGrid images={galleryImages} />
        </div>
      </main>
      <Footer />
    </>
  )
}
