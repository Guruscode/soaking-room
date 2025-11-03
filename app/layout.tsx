import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const figtree = Figtree({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Moses Akor - Music Ministry",
  description:
    "Support the music ministry of Moses Akor. Donate to bless the ministry and spread the gospel through music.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
