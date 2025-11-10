"use client"

import PageHeader from "@/components/PageHeader"
import MaskHeading from "@/components/MaskHeading"
import ScrambleText from "@/components/ScrambleText"
import Container from "@/components/Container"
import AboutScene from "./about-scene"
import Column from "@/components/Column"
import Row from "@/components/Row"
import AnimatedGradient from "@/components/animated-gradient"
import LogoDistortion from "@/components/LogoDistortion"
import { useRef } from "react"
import { AlphaVideo } from "@/components/alpha-video"

export default function About() {
  const logoRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <PageHeader>
        <h1 className="text-h2">
          <ScrambleText duration={0.5}>a veritable force</ScrambleText>
        </h1>
      </PageHeader>

      <Container className="relative">
        <div className="mb-(--spacing-xl) rounded-(--media-radius) relative aspect-video overflow-hidden bg-black">
          <AnimatedGradient
            colors={["#4A79A6", "#000000", "#1A3EBF", "#B6FD6E", "#4A79A6"]}
            amount={0.15}
            frequencyX={2}
            frequencyY={2}
            speed={0.5}
          />
          <div ref={logoRef} className="aspect-1217/1401 absolute left-[2%] top-[4%] w-[96%] text-gray-800">
            {/* <LogoDistortion /> */}
          </div>
          <AlphaVideo src="/aboutLoop_alpha.mp4" />
        </div>
      </Container>

      <div className="mb-(--spacing-xxl)">
        <Container>
          <Row className="items-end" style={{ margin: "10vw 0 5vw 0" }}>
            <Column lg="7">
              <h1>
                <MaskHeading>Who is we?</MaskHeading>
              </h1>
            </Column>
            <Column lg="5">
              <p data-lag="0.05">
                <ScrambleText>
                  We&rsquo;re James Kowalski and Joe di Stefano—long-time friends and a design-development duo crafting
                  bold digital experiences. From CMS websites and mobile apps to motion graphics, explainer videos,
                  visual effects, and UI/UX design, we combine creative design with reliable code to build thoughtful,
                  engaging digital work.
                </ScrambleText>
              </p>
            </Column>
          </Row>
        </Container>
      </div>

      {/* <div className="mb-(--spacing-xxl)">
        <Container>
          <AboutScene />
        </Container>
      </div> */}
    </>
  )
}
