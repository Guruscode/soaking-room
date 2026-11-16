import type React from "react"
import type { Metadata, Viewport } from "next"
import { Figtree, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { getSessionUser } from "@/lib/session"
import { organizationStructuredData, SITE_NAME, SITE_URL } from "@/lib/seo"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-figtree",
  display: "swap",
})

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-label",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Soaking Room | Global Worship Ministry",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "The Soaking Room is a global worship ministry led by Moses Akoh, creating space to encounter God through worship, music, and prayer.",
  applicationName: SITE_NAME,
  category: "Music and worship ministry",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_NG",
    title: "The Soaking Room | Global Worship Ministry",
    description:
      "A global worship ministry led by Moses Akoh, devoted to worship, obedience, and keeping our eyes on Jesus.",
    url: "/",
    images: [{ url: "/image-16.jpg", width: 1200, height: 630, alt: "The Soaking Room worship ministry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Soaking Room | Global Worship Ministry",
    description:
      "A global worship ministry led by Moses Akoh, devoted to worship, obedience, and keeping our eyes on Jesus.",
    images: ["/image-16.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialUser = await getSessionUser()

  return (
    <html lang="en" className={`${figtree.variable} ${monoFont.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider initialUser={initialUser}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationStructuredData).replace(/</g, "\\u003c"),
            }}
          />
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
