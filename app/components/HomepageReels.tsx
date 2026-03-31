"use client"

import { useRef } from "react"
import SplitReveal from "./SplitReveal"

const HomepageReels = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <SplitReveal
      containerRef={containerRef}
      className="my-(--spacing-xl)"
      left={
        <video
          src="https://simplecreature.us/assets/reelEdit_web.mp4"
          width="1920"
          height="1080"
          autoPlay
          loop
          muted
          playsInline
        />
      }
      right={
        <video
          src="https://simple-creature-next.s3.us-east-1.amazonaws.com/assets/1770400809461-m1aewm1t5i-Ethos.mp4"
          width="1920"
          height="1080"
          autoPlay
          loop
          muted
          playsInline
        />
      }
    />
  )
}

export default HomepageReels
