"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Container from "@/components/Container"
import Row from "@/components/Row"
import Column from "@/components/Column"
import LogoDistortion from "./LogoDistortion"
import ScrambleText from "@/components/ScrambleText"
import SplitHeading from "./SplitHeading"
import { AlphaVideo } from "./alpha-video"
import AnimatedGradient from "./animated-gradient"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const GRADIENT_COLORS = ["#1A3EBF", "#4A79A6", "#1A3EBF", "#000000", "#F43791"]

const Hero = () => {
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
    <div className="mb-(--spacing-lg)" ref={heroRef}>
      <Container>
        <div className="mb-(--spacing-xs) rounded-media relative aspect-[2.55] overflow-hidden bg-black">
          <div ref={gradientRef} className="opacity-0">
            <AnimatedGradient colors={GRADIENT_COLORS} amount={0.15} frequencyX={2} frequencyY={2} speed={0.2} />
          </div>
          <div ref={logoRef} className="aspect-1217/1401 absolute left-0 top-0 w-full opacity-0">
            <LogoDistortion />
          </div>
          <div ref={videoRef} className="opacity-0">
            <AlphaVideo src="/clothLoop_alpha.mp4" />
          </div>
        </div>
        <Row className="justify-between">
          <Column lg="6">
            <h1 className="ml-4">
              <SplitHeading>
                Web Design <br />
                &amp; Animation
              </SplitHeading>
            </h1>
          </Column>
          <Column lg="4" className="lg:mt-4">
            <p data-lag="0.05">
              <ScrambleText>
                We believe the best digital work feels effortless &mdash; precisely because it&rsquo;s built with care.
              </ScrambleText>
            </p>
            <p data-lag="0.05">
              <ScrambleText>
                Since 2014, we&rsquo;ve been shaping creative ideas through a lens of technical excellence, bringing
                clarity, motion, and meaning to the digital world.
              </ScrambleText>
            </p>
          </Column>
          <Column lg="2"></Column>
        </Row>
      </Container>
    </div>
  )
}
export default Hero
