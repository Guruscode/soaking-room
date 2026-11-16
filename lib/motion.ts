import type { CSSProperties } from "react"

// Inline style that staggers the CSS entrance utilities (animate-rise, animate-fade, ...).
export function delay(ms: number, extra?: Record<string, string | number>): CSSProperties {
  return { "--d": `${ms}ms`, ...extra } as CSSProperties
}
