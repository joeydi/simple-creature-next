import type { Metadata } from 'next'
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: 'Interactive Animation Studio » Simple Creature',
  description: 'Simple Creature is a fun-size digital design and interactive animation studio in Burlington, VT.',
}

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body>
        {children}
      </body>
    </html>
  )
}
