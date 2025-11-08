import type { Metadata } from "next"
import localFont from "next/font/local"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { MenuProvider } from "@/contexts/MenuContext"
import "@/styles/tailwind.css"
import "@/styles/global.scss"
import Scroller from "@/components/scroller"
import { cn } from "@/lib/utils"

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
    <html lang="en" className="h-full overflow-hidden overscroll-none">
      <body className={cn("h-full overflow-hidden bg-indigo-500 antialiased", clash.variable)}>
        <MenuProvider>
          <Header />
          <Scroller>
            <main>{children}</main>
            <Footer />
          </Scroller>
        </MenuProvider>
      </body>
    </html>
  )
}
