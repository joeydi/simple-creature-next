"use client"

import { useCallback, useRef } from "react"
import gsap from "gsap"
import SplitReveal from "./SplitReveal"

const HomepageReels = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftBioRef = useRef<HTMLDivElement>(null)
  const rightBioRef = useRef<HTMLDivElement>(null)

  const handleFrame = useCallback((lerpedX: number) => {
    const x = gsap.utils.mapRange(100, 0, -30, 30, lerpedX)

    if (leftBioRef.current) {
      leftBioRef.current.style.transform = `translateX(${x}vw)`
      leftBioRef.current.style.filter = lerpedX > 50 ? "blur(00px)" : "blur(20px)"
    }

    if (rightBioRef.current) {
      rightBioRef.current.style.transform = `translateX(${x}vw)`
      rightBioRef.current.style.filter = lerpedX > 50 ? "blur(20px)" : "blur(0px)"
    }
  }, [])

  return (
    <SplitReveal
      containerRef={containerRef}
      className="my-(--spacing-xl)"
      onFrame={handleFrame}
      left={
        <>
          <video
            src="https://simplecreature.us/assets/reelEdit_web.mp4"
            width="1920"
            height="1080"
            autoPlay
            loop
            muted
            playsInline
          />
          <div
            ref={leftBioRef}
            className="absolute left-[35%] top-[50%] w-[30%] max-w-lg translate-y-[-50%] rounded-full border border-white/25 bg-white/15 px-12 py-8 text-center text-black shadow-2xl backdrop-blur-xl backdrop-brightness-110 backdrop-saturate-150 [transition:opacity_250ms,filter_250ms,transform_0ms]"
          >
            <h3 className="text-h2 mb-0">Motion</h3>
          </div>
        </>
      }
      right={
        <>
          <video
            src="https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/sc_interactive_reel_edit_v1_web.mp4"
            width="1920"
            height="1080"
            autoPlay
            loop
            muted
            playsInline
          />
          <div
            ref={rightBioRef}
            className="absolute left-[35%] top-[50%] w-[30%] max-w-lg translate-y-[-50%] rounded-full border border-white/25 bg-black/15 px-12 py-8 text-center text-white shadow-2xl backdrop-blur-xl backdrop-brightness-90 backdrop-saturate-150 [transition:opacity_250ms,filter_250ms,transform_0ms]"
          >
            <h3 className="text-h2 mb-0">Interactive</h3>
          </div>
        </>
      }
    />
  )
}

export default HomepageReels
