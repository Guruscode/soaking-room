import type React from "react"
import type { Metadata, Viewport } from "next"
import { Figtree, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { getSessionUser } from "@/lib/session"
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.thesoakingroom.com"),
  title: "Moses Akoh - Music Ministry",
  description:
    "Support the music ministry of Moses Akoh. Donate to bless the ministry and spread the gospel through music.",
  generator: "v0.app",
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
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
