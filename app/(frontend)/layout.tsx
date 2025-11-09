import type { Metadata } from "next"
import localFont from "next/font/local"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { MenuProvider } from "@/contexts/MenuContext"
import "@/styles/tailwind.css"
import "@/styles/global.scss"
import { cn } from "@/lib/utils"
import SmoothScroller from "@/components/SmoothScroller"
import AnimatedGradient from "@/components/animated-gradient"

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
          <SmoothScroller>
            <main>{children}</main>
            <Footer />
          </SmoothScroller>
          <AnimatedGradient
            colors={["#B6FD6E", "#4A79A6", "#1A3EBF", "#000000", "#F43791"]}
            amount={0.1}
            frequencyX={2}
            frequencyY={3}
            speed={0.1}
          />
        </MenuProvider>
      </body>
    </html>
  )
}
