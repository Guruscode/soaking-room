"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

// Shows the video thumbnail and only loads the YouTube player after a click.
export function LiteYouTube({ id, title, className }: { id: string; title: string; className?: string }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={cn("relative aspect-video overflow-hidden bg-ink", className)}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 size-full" aria-label={`Play ${title}`}>
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover opacity-80 transition-[transform,opacity] duration-700 ease-[var(--ease-settle)] group-hover:scale-105 group-hover:opacity-60"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="relative grid size-20 place-items-center rounded-full bg-white text-ink shadow-2xl transition-transform duration-500 group-hover:scale-110">
              <span className="absolute inset-0 rounded-full bg-white animate-pulse-ring" />
              <Play className="relative ml-1 size-7 fill-current" />
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
