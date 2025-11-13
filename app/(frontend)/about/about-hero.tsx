"use client"

import AnimatedGradient from "@/components/animated-gradient"
import LogoDistortion from "@/components/LogoDistortion"
import { AlphaVideo } from "@/components/alpha-video"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const GRADIENT_COLORS = ["#4A79A6", "#000000", "#1A3EBF", "#B6FD6E", "#4A79A6"]

export default function AboutHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    requestIdleCallback(() => {
      const timeline = gsap.timeline()

      // Scroll the logo in a loop
      timeline.to(
        logoRef.current,
        {
          yPercent: -66,
          ease: "none",
          duration: 30,
          repeat: Infinity,
        },
        0,
      )

      // Fade in the video
      timeline.fromTo(
        videoRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
        },
        0,
      )

      // Fade in the gradient
      timeline.fromTo(
        gradientRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 3,
        },
        0,
      )

      // Fade in the logo
      timeline.fromTo(
        logoRef.current,
        {
          filter: "blur(100px)",
          opacity: 0,
        },
        {
          filter: "blur(0px)",
          opacity: 1,
          duration: 2.5,
          ease: "expo.out",
        },
        0.5,
      )
    })
  })

  return (
    <div ref={heroRef} className="rounded-(--media-radius) relative aspect-video overflow-hidden bg-black">
      <div ref={gradientRef} className="opacity-0">
        <AnimatedGradient colors={GRADIENT_COLORS} amount={0.15} frequencyX={2} frequencyY={2} speed={0.5} />
      </div>
      <div ref={logoRef} className="aspect-1217/1401 absolute -left-0.5 top-0 w-[calc(100%+4px)] opacity-0">
        <LogoDistortion />
      </div>
      <div ref={videoRef} className="opacity-0">
        <AlphaVideo src="/aboutLoop_alpha.mp4" />
      </div>
    </div>
  )
}
