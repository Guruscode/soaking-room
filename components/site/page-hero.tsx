import type { ReactNode } from "react"
import { Eyebrow } from "@/components/site/section-heading"
import { cn } from "@/lib/utils"
import { delay } from "@/lib/motion"

// Shared opening band for sub-pages: eyebrow, two-weight headline, intro, optional visual on the right.
export function PageHero({
  eyebrow,
  title,
  description,
  aside,
  children,
  className,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  aside?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-[#e3dfd5] bg-[#f7f5f0]", className)}>
      <div
        className={cn(
          "container-page relative grid gap-12 py-16 md:py-24",
          aside ? "items-center lg:grid-cols-[1.15fr_1fr]" : "",
        )}
      >
        <div className="max-w-3xl">
          {eyebrow ? (
            <div className="animate-rise">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          ) : null}
          <h1
            className="mt-6 font-serif text-[clamp(2.75rem,7vw,5.5rem)] font-normal leading-[0.98] tracking-[-0.04em] text-ink animate-rise"
            style={delay(100)}
          >
            {title}
          </h1>
          {description ? (
            <div className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 animate-rise md:text-xl" style={delay(220)}>
              {description}
            </div>
          ) : null}
          {children ? (
            <div className="mt-8 animate-rise" style={delay(340)}>
              {children}
            </div>
          ) : null}
        </div>
        {aside ? (
          <div className="relative animate-scale-in" style={delay(200)}>
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  )
}
