import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

const publicRoutes = [
  "/",
  "/about",
  "/booking",
  "/contact",
  "/donate",
  "/events",
  "/events/kitchen-in-the-sky",
  "/events/soaking-room",
  "/events/spirit-spa",
  "/gallery",
  "/tsr-academy",
  "/worship-night",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/events" || path === "/about" ? 0.8 : 0.6,
  }))
}
