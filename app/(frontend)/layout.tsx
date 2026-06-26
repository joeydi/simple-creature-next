import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import localFont from "next/font/local"
import Header from "@/components/Header"
import { MenuProvider } from "@/contexts/MenuContext"
import { PlayableVideoProvider } from "@/contexts/PlayableVideoContext"
import "@/styles/tailwind.css"
import "@/styles/global.scss"
import { cn } from "@/lib/utils"
import SmoothScroller from "@/components/SmoothScroller"
import BackgroundGradient from "@/components/background-gradient"
import FooterContent from "@/components/footer-content"

const clash = localFont({
  src: "../fonts/ClashGrotesk-Variable.woff2",
  variable: "--font-clash",
  weight: "200 700",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    template: "%s » Simple Creature",
    default: "Simple Creature » Interactive Animation Studio",
  },
  description: "Simple Creature is a fun-size digital design and interactive animation studio in Burlington, VT.",
  openGraph: {
    url: "/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={cn("h-full bg-indigo-500 antialiased", clash.variable)}>
        <MenuProvider>
          <PlayableVideoProvider>
            <Header />
            <BackgroundGradient />
            <SmoothScroller>{children}</SmoothScroller>
            <FooterContent />
          </PlayableVideoProvider>
        </MenuProvider>
        <Analytics />
      </body>
    </html>
  )
}
