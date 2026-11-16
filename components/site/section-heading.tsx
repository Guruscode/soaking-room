import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Eyebrow({ children, className, tone = "light" }: { children: ReactNode; className?: string; tone?: "light" | "dark" }) {
  return (
    <p
      className={cn(
        "eyebrow inline-flex items-center gap-3",
        tone === "dark" ? "text-[#d6bc8b]" : "text-[#907447]",
        className,
      )}
    >
      <span className={cn("h-px w-8", tone === "dark" ? "bg-[#d6bc8b]/70" : "bg-[#9a7946]/70")} />
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  tone = "light",
  className,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  align?: "left" | "center"
  action?: ReactNode
  tone?: "light" | "dark"
  className?: string
}) {
  return (
    <div
      className={cn(
        "reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl space-y-4", align === "center" && "mx-auto flex flex-col items-center")}>
        {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
        <h2
          className={cn(
            "font-serif text-4xl font-normal tracking-tight md:text-5xl lg:text-[3.5rem] lg:leading-[1.02]",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className={cn("text-lg leading-relaxed", tone === "dark" ? "text-slate-300" : "text-slate-600")}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
