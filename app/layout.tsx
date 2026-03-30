import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { getSessionUser } from "@/lib/session"
import "./globals.css"

export const metadata: Metadata = {
  title: "Moses Akoh - Music Ministry",
  description:
    "Support the music ministry of Moses Akoh. Donate to bless the ministry and spread the gospel through music.",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialUser = await getSessionUser()

  return (
    <html lang="en">
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
