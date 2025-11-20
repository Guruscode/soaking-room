// app/gallery/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// Your images data — just add/remove as needed
const galleryImages = [
  { src: "/image-1.JPG", alt: "Image 1" },
  { src: "/image-2.JPG", alt: "Image 2" },
  { src: "/image-3.JPG", alt: "Image 3" },
  { src: "/image-4.JPG", alt: "Image 4" },
  { src: "/image-5.JPG", alt: "Image 5" },
  { src: "/image-6.JPG", alt: "Image 6" },
  { src: "/image-7.JPG", alt: "Image 7" },
  { src: "/image-8.JPG", alt: "Image 8" },
  { src: "/image-9.JPG", alt: "Image 9" },
  { src: "/image-10.JPG", alt: "Image 10" },
  { src: "/image-11.JPG", alt: "Image 11" },
  { src: "/image-12.JPG", alt: "Image 12" },
  { src: "/image-13.JPG", alt: "Image 13" },
  { src: "/image-14.JPG", alt: "Image 14" },
  { src: "/image-15.JPG", alt: "Image 15" },
  { src: "/image-16.JPG", alt: "Image 16" },
  { src: "/image-17.JPG", alt: "Image 17" },
  { src: "/image-18.JPG", alt: "Image 18" },
  { src: "/image-19.JPG", alt: "Image 19" },
  { src: "/image-20.JPG", alt: "Image 20" },
  // Add more here if needed → { src: "/image-21.JPG", alt: "Image 21" },
] as const;

// Grid configuration
const COLUMNS: 2 | 3 | 4 | 5 = 4;

const columnClasses = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
} as const;

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
            Gallery
          </h1>

          <div className={`grid ${columnClasses[COLUMNS]} gap-6`}>
            {galleryImages.map((image, index) => (
              <div
                key={image.src}
                onClick={() => setSelectedImage(image.src)}
                className="relative overflow-hidden rounded-xl shadow-lg cursor-zoom-in group aspect-square bg-gray-200 transition-shadow hover:shadow-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority={index < 12} // Load first ~12 images faster
                  unoptimized // Required for .JPG with uppercase extension
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to enlarge
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full">
            <Image
              src={selectedImage}
              alt="Enlarged view"
              width={1800}
              height={1200}
              className="max-w-full max-h-screen object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-6xl font-thin hover:text-gray-300 transition"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}