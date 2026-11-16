import type { Metadata } from "next"

export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.thesoakingroom.com"
export const SITE_NAME = "The Soaking Room"

export function createPageMetadata({
  title,
  description,
  path,
  image = "/image-16.jpg",
}: {
  title: string
  description: string
  path: string
  image?: string
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_NG",
      images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.PNG`,
      },
      description:
        "A global worship ministry led by Moses Akoh, devoted to worship, obedience, and keeping our eyes on Jesus.",
      sameAs: [
        "https://www.instagram.com/mosesakoh",
        "https://www.facebook.com/mosesakohoche/",
        "https://www.youtube.com/@TheMosesAkoh",
        "https://www.tiktok.com/@mosesakoh",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
  ],
}
