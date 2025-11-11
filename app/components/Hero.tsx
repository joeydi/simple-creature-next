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

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.to(logoRef.current, {
      yPercent: -25,
      ease: "none",
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        endTrigger: heroRef.current,
        end: "bottom top",
        scrub: true,
      },
    })
  })

  return (
    <div className="mb-(--spacing-lg)" ref={heroRef}>
      <Container>
        <div className="mb-(--spacing-xs) rounded-(--media-radius) relative aspect-[2.55] overflow-hidden bg-black">
          <AnimatedGradient
            // colors={["#4A79A6", "#1A3EBF", "#B6FD6E", "#000000", "#4A79A6"]}
            colors={["#1A3EBF", "#4A79A6", "#1A3EBF", "#000000", "#F43791"]}
            amount={0.15}
            frequencyX={2}
            frequencyY={2}
            speed={0.2}
          />
          <div
            ref={logoRef}
            className="aspect-1217/1401 rounded-(--media-radius) absolute left-0 top-0 w-full overflow-hidden"
          >
            <LogoDistortion />
          </div>
          <AlphaVideo src="/clothLoop_alpha.mp4" />
        </div>
        <Row className="justify-between">
          <Column lg="6">
            <h1 className="ml-4">
              <SplitHeading>
                Artfully <br />
                Engineered
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
