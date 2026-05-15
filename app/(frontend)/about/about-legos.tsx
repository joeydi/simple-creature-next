"use client"

import Image from "next/image"
import { useCallback, useRef } from "react"
import SplitReveal from "@/components/SplitReveal"
import AboutJoe from "./about-joe"
import AboutJames from "./about-james"

export default function AboutLegos() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftBioRef = useRef<HTMLDivElement>(null)
  const rightBioRef = useRef<HTMLDivElement>(null)

  const handleFrame = useCallback((lerpedX: number) => {
    if (leftBioRef.current) {
      leftBioRef.current.style.transform = `translateX(${lerpedX - 50}%)`
      leftBioRef.current.style.opacity = lerpedX <= 50 ? "0" : "1"
      leftBioRef.current.style.filter = lerpedX > 50 ? "blur(00px)" : "blur(20px)"
    }

    if (rightBioRef.current) {
      rightBioRef.current.style.transform = `translateX(${lerpedX - 50}%)`
      rightBioRef.current.style.opacity = lerpedX > 50 ? "0" : "1"
      rightBioRef.current.style.filter = lerpedX > 50 ? "blur(20px)" : "blur(0px)"
    }
  }, [])

  return (
    <SplitReveal
      containerRef={containerRef}
      onFrame={handleFrame}
      left={
        <>
          <AboutJoe containerRef={containerRef} />
          <div
            ref={leftBioRef}
            className="md:p-(--spacing-sm) absolute left-0 top-[60%] max-w-lg rounded-lg bg-black/15 px-4 py-2 text-white backdrop-blur-xl [transition:opacity_250ms,filter_250ms,transform_0ms] lg:left-[10%] lg:top-[25%] lg:w-[40%]"
          >
            <div className="flex items-center gap-4">
              <Image
                width="800"
                height="800"
                className="hidden size-16 rounded-full sm:block"
                src={"/jd.jpg"}
                alt="Joe di Stefano"
              />
              <div>
                <h3 className="mb-0">Joe di Stefano</h3>
                <p className="font-sm text-white/70">Technical Director</p>
              </div>
            </div>
            <p className="mt-3 hidden text-balance lg:block">
              Joe is a designer and developer who specializes in crafting high-performance digital experiences that
              blend thoughtful design with clean, scalable code.
            </p>
          </div>
        </>
      }
      right={
        <>
          <AboutJames containerRef={containerRef} />
          <div
            ref={rightBioRef}
            className="md:p-(--spacing-sm) absolute right-0 top-[20%] max-w-lg rounded-lg bg-black/15 px-4 py-2 text-white backdrop-blur-xl [transition:opacity_250ms,filter_250ms,transform_0ms] lg:right-[10%] lg:top-[25%] lg:w-[40%]"
          >
            <div className="flex items-center gap-4">
              <Image
                width="800"
                height="800"
                className="hidden size-16 rounded-full sm:block"
                src={"/jk.jpg"}
                alt="James Kowalski"
              />
              <div>
                <h3 className="mb-0">James Kowalski</h3>
                <p className="font-sm text-white/70">Creative Director</p>
              </div>
            </div>
            <p className="mt-3 hidden text-balance lg:block">
              James is a motion designer and visual storyteller known for creating cinematic animations, immersive
              interfaces, and richly detailed digital experiences.
            </p>
          </div>
        </>
      }
    />
  )
}
