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
        <div className="mb-(--spacing-sm) rounded-(--media-radius) relative aspect-[2.9] overflow-hidden bg-black">
          <AnimatedGradient
            // colors={["#B6FD6E", "#4A79A6", "#1A3EBF", "#000000", "#4A79A6"]}
            colors={["#1A3EBF", "#4A79A6", "#1A3EBF", "#000000", "#F43791"]}
            amount={0.15}
            frequencyX={2}
            frequencyY={2}
            speed={0.2}
          />
          <div ref={logoRef} className="aspect-1217/1401 absolute left-0 top-0 w-full">
            <LogoDistortion />
          </div>
          <AlphaVideo src="/clothLoop_alpha.mp4" />
        </div>
        <Row className="justify-between">
          <Column lg="6">
            <h1 className="ml-4">
              <SplitHeading>
                Technically <br />
                Creative
              </SplitHeading>
            </h1>
          </Column>
          <Column lg="4" className="lg:mt-4">
            <p data-lag="0.05">
              <ScrambleText>
                Since 2014, we&rsquo;ve been quietly threading technical craft into the fabric of our work—never loud,
                always present, and always in service of the story at the center.
              </ScrambleText>
            </p>
            <p data-lag="0.05">
              <ScrambleText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
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
