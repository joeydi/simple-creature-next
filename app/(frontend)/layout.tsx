import type { Metadata } from "next"
import localFont from "next/font/local"
import Header from "@/components/Header"
import { MenuProvider } from "@/contexts/MenuContext"
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
  title: "Interactive Animation Studio » Simple Creature",
  description: "Simple Creature is a fun-size digital design and interactive animation studio in Burlington, VT.",
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
          <Header />
          <BackgroundGradient />
          <FooterContent />
          <SmoothScroller>
            <main className="pb-24">{children}</main>
          </SmoothScroller>
        </MenuProvider>
      </body>
    </html>
  )
}
