"use client"

import AnimatedGradient from "@/components/animated-gradient"
import LogoDistortion from "@/components/LogoDistortion"
import { AlphaVideo } from "@/components/alpha-video"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { onIdle } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const GRADIENT_COLORS = ["#4A79A6", "#000000", "#1A3EBF", "#B6FD6E", "#4A79A6"]

export default function AboutHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    onIdle(() => {
      const timeline = gsap.timeline()

      gsap.set(heroRef.current, {
        transformOrigin: "50% 0%",
      })

      // Fade in the wrapper
      timeline.fromTo(
        heroRef.current,
        {
          opacity: 0,
          scale: 0.9,
        },
        {
          opacity: 1,
          scale: 1,
          ease: "expo.out",
          duration: 1,
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
          duration: 1.5,
          ease: "expo.out",
        },
        0.5,
      )

      // Fade in the gradient
      timeline.fromTo(
        gradientRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1.5,
          ease: "expo.out",
        },
        0,
      )
    })
  })

  return (
    <div ref={heroRef} className="rounded-media relative aspect-video overflow-hidden bg-black opacity-0">
      <div ref={gradientRef} className="opacity-0">
        <AnimatedGradient colors={GRADIENT_COLORS} amount={0.15} frequencyX={2} frequencyY={2} speed={0.5} />
      </div>
      <div ref={logoRef} className="absolute inset-0 opacity-0">
        <LogoDistortion />
      </div>
      <div ref={videoRef}>
        <AlphaVideo src="/aboutLoop_alpha.mp4" />
      </div>
    </div>
  )
}
