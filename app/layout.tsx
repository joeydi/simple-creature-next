import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./styles/global.scss";

const clash = localFont({
  src: "./fonts/ClashGrotesk-Variable.woff2",
  variable: "--font-clash",
  weight: "200 700",
});

export const metadata: Metadata = {
  title: "Interactive Animation Studio » Simple Creature",
  description: "Simple Creature is a fun-size digital design and interactive animation studio in Burlington, VT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${clash.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
