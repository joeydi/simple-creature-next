import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "@/styles/tailwind.css"

export const metadata: Metadata = {
  title: "Interactive Animation Studio » Simple Creature",
  description:
    "Simple Creature blends web design, animation, and development to create thoughtful websites, apps, motion graphics, and digital experiences.",
}

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
