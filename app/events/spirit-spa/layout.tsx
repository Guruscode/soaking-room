import type { ReactNode } from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "The Spirit Spa Worship Experience",
  description:
    "Discover The Spirit Spa, a signature women's worship experience by The Soaking Room in Abuja.",
  path: "/events/spirit-spa",
})

export default function SpiritSpaLayout({ children }: { children: ReactNode }) {
  return children
}
