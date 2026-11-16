"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type Slide = { src: string; alt: string }

const INTERVAL_MS = 5200

// Cross-fading photo stack. Only the first photo loads with the page; the rest load once the browser is idle.
export function HeroSlideshow({ slides, className }: { slides: Slide[]; className?: string }) {
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const visibleRef = useRef(true)

  useEffect(() => {
    const start = () => setReady(true)
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const timer = setTimeout(start, 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!ready) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return
    const timer = setInterval(() => {
      if (visibleRef.current && !document.hidden) setActive((i) => (i + 1) % slides.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [ready, slides.length])

  return (
    <div ref={rootRef} className={cn("relative overflow-hidden bg-slate-200", className)}>
      {slides.map((slide, i) => {
        if (i > 0 && !ready) return null
        const isActive = i === active
        return (
          <div
            key={slide.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1400ms] ease-[var(--ease-settle)]",
              isActive ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "low"}
              sizes="(max-width: 1024px) 90vw, 40vw"
              className={cn("object-cover will-change-transform", isActive && "animate-[ken-burns_7s_var(--ease-settle)_both]")}
            />
          </div>
        )
      })}

      <div className="absolute right-5 bottom-5 z-10 flex gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show photo ${i + 1}`}
            onClick={() => {
              setReady(true)
              setActive(i)
            }}
            className={cn(
              "h-1.5 rounded-full bg-white/50 transition-all duration-500",
              i === active ? "w-6 bg-white" : "w-1.5 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </div>
  )
}
