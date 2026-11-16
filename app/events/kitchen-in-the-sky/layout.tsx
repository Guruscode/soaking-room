import type { ReactNode } from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "A Kitchen in the Sky",
  description:
    "A Kitchen in the Sky is an evening of worship, fellowship, and dining in the presence of the King, presented by The Soaking Room.",
  path: "/events/kitchen-in-the-sky",
  image: "/kitchen-in-the-sky.webp",
})

export default function KitchenInTheSkyLayout({ children }: { children: ReactNode }) {
  return children
}
