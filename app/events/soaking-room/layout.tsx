import type { ReactNode } from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "The Soaking Room Worship Gathering",
  description:
    "Join The Soaking Room for an Abuja worship gathering with music, prayer, and time in God's presence.",
  path: "/events/soaking-room",
  image: "/soaking-room.webp",
})

export default function SoakingRoomEventLayout({ children }: { children: ReactNode }) {
  return children
}
