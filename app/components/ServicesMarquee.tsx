"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Container from "@/components/Container"
import MaskHeading from "@/components/MaskHeading"
import { fluid } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const MarqueeSpan = ({ children }: React.ComponentProps<"span">) => {
  return <span className="block whitespace-nowrap odd:self-start even:self-end">{children}</span>
}

const ServicesMarquee = () => {
  const spacerRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const oddChildren = marqueeRef.current?.querySelectorAll("span:nth-child(odd)")
    const evenChildren = marqueeRef.current?.querySelectorAll("span:nth-child(even)")

    const timeline = gsap.timeline({
      scrollTrigger: {
        invalidateOnRefresh: true,
        trigger: spacerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    if (oddChildren) {
      timeline.to(
        oddChildren,
        {
          x: (_, el) => {
            const width = el.getBoundingClientRect().width
            return (window.innerWidth - width) / 4
          },
          duration: 1,
          ease: "none",
        },
        0,
      )
    }

    if (evenChildren) {
      timeline.to(
        evenChildren,
        {
          x: (_, el) => {
            const width = el.getBoundingClientRect().width
            return (width - window.innerWidth) / 4
          },
          duration: 1,
          ease: "none",
        },
        0,
      )
    }

    timeline.fromTo(
      marqueeRef.current,
      {
        y: -100,
      },
      { y: 100, duration: 1, ease: "none" },
      0,
    )
  })

  return (
    <section className="z-1 relative -mb-1">
      <Container>
        <h2 className="mb-(--spacing-sm)">
          <MaskHeading reset={true}>Our Services</MaskHeading>
        </h2>
      </Container>
      <div ref={spacerRef} className="overflow-hidden bg-black">
        <div
          ref={marqueeRef}
          style={{ fontSize: fluid(90, 180) }}
          className="text-h1 flex flex-col bg-black py-[100px] leading-[1.2] text-white"
        >
          <MarqueeSpan>
            Strategy &bull; Design &bull; Motion &bull; Consulting &bull; Interactive &bull; Production
          </MarqueeSpan>
          <MarqueeSpan>Direction &bull; User Experience &bull; Branding &bull; Installations</MarqueeSpan>
          <MarqueeSpan>
            3D Modeling &bull; Creative Direction &bull; Interface Design &bull; Creative Development
          </MarqueeSpan>
          <MarqueeSpan>
            Strategy &bull; Design &bull; Motion &bull; Consulting &bull; Interactive &bull; Production
          </MarqueeSpan>
        </div>
      </div>
    </section>
  )
}

export default ServicesMarquee
