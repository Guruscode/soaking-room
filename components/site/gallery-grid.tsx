"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react"

type GalleryImage = { src: string; alt: string; width: number; height: number }

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const open = index !== null

  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null)
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open, step])

  const current = index === null ? null : images[index]

  return (
    <>
      <div className="columns-2 gap-3 md:columns-3 md:gap-5 lg:columns-4">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setIndex(i)}
            className="reveal-scale group relative mb-3 block w-full cursor-zoom-in overflow-hidden rounded-[1.25rem] bg-slate-200 md:mb-5 md:rounded-[1.5rem]"
            aria-label={`Open ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={60}
              priority={i === 0}
              className="h-auto w-full transition-transform duration-[1200ms] ease-[var(--ease-settle)] group-hover:scale-[1.06]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="absolute right-3 bottom-3 grid size-10 translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <Maximize2 className="size-4" />
            </span>
          </button>
        ))}
      </div>

      {current ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950/95 backdrop-blur-md animate-fade" role="dialog" aria-modal="true" aria-label="Photo viewer">
          <div className="flex items-center justify-between p-4 text-white md:p-6">
            <span className="eyebrow text-slate-400 tabular-nums">
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setIndex(null)}
              className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 md:px-20" onClick={() => setIndex(null)}>
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="(max-width: 768px) 100vw, 90vw"
              quality={75}
              priority
              className="max-h-full w-auto rounded-2xl object-contain animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                step(-1)
              }}
              className="absolute left-3 grid size-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-6"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                step(1)
              }}
              className="absolute right-3 grid size-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-6"
              aria-label="Next photo"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
