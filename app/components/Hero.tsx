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
import { HeroVideo } from "./HeroVideo"
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
    <div className="mb-(--spacing-xxl)" ref={heroRef}>
      <Container>
        <Row className="items-end" style={{ margin: "10vw 0 5vw 0" }}>
          <Column lg="7">
            <h1>
              <SplitHeading>
                Technically <br />
                Creative
              </SplitHeading>
            </h1>
          </Column>
          <Column lg="5">
            <p data-lag="0.05">
              <ScrambleText>
                Since 2014, we&rsquo;ve been quietly threading technical craft into the fabric of our work—never loud,
                always present, and always in service of the story at the center.
              </ScrambleText>
            </p>
          </Column>
        </Row>
        <div className="mb-(--spacing-xl) rounded-(--media-radius) relative aspect-video overflow-hidden bg-black">
          <AnimatedGradient
            colors={["#B6FD6E", "#4A79A6", "#1A3EBF", "#000000", "#4A79A6"]}
            amount={0.15}
            frequencyX={2}
            frequencyY={2}
            speed={0.2}
          />
          <div ref={logoRef} className="aspect-1217/1401 absolute left-[2%] top-[4%] w-[96%] text-gray-800">
            <LogoDistortion />
          </div>
          <HeroVideo />
        </div>
      </Container>
    </div>
  )
}
export default Hero
