"use client"

import Image from "next/image"
import Joe from "@/../public/about-jd.png"
import James from "@/../public/about-jk.png"
import PurpleBackground from "@/../public/about-bg-purple.jpg"
import GreenBackground from "@/../public/about-bg-green.jpg"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function AboutLegos() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const leftBioRef = useRef<HTMLDivElement>(null)
  const rightBioRef = useRef<HTMLDivElement>(null)
  const lastX = useRef(40) // Start in the middle
  const lerpXFactor = useRef(0.05) // Start in the middle

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      onEnter: () => {
        lastX.current = 90
      },
      onEnterBack: () => {
        lastX.current = 90
      },
      onLeave: () => {
        lastX.current = 40
        lerpXFactor.current = 0.05
      },
      onLeaveBack: () => {
        lastX.current = 40
        lerpXFactor.current = 0.05
      },
    })
  })

  useEffect(() => {
    if (!containerRef.current) return

    let lastTime = performance.now()
    let velocity = 0
    let lerpedVelocity = 0
    let lerpedX = 50 // Current clip position (0-100%)
    let animationFrameId: number
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const handleMousemove = (e: MouseEvent) => {
      if (!containerRef.current) return

      lerpXFactor.current = 0.1

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100

      // Calculate velocity
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTime

      if (deltaTime > 0) {
        const deltaX = percentage - lastX.current
        velocity = deltaX / deltaTime // pixels per millisecond

        // clamp velocity
        velocity = Math.max(-1, Math.min(1, velocity))
      }

      lastX.current = percentage
      lastTime = currentTime
    }

    const animate = () => {
      // Lerp velocity back to 0 (damping factor)
      velocity *= 0.9
      lerpedVelocity = lerp(lerpedVelocity, velocity, 0.1)

      // Update position based on velocity
      lerpedX = lerp(lerpedX, lastX.current, lerpXFactor.current)

      // Apply clip-path to left image
      if (leftRef.current) {
        const curveX = lastX.current + 40 * lerpedVelocity
        const clipPath = `shape(from 0 0, line to ${(lerpedX - 0.4).toFixed(3)}% 0, curve to ${(lerpedX - 0.4).toFixed(3)}% 100% with ${curveX.toFixed(3)}% 50%, line to 0 100%, line to 0 0`
        leftRef.current.style.clipPath = clipPath
      }

      // Apply clip-path to right image
      if (rightRef.current) {
        const curveX = lastX.current + 40 * lerpedVelocity
        const clipPath = `shape(from ${lerpedX.toFixed(3)}% 0, line to 100% 0, line to 100% 100%, line to ${lerpedX.toFixed(3)}% 100%, curve to ${lerpedX.toFixed(3)}% 0 with ${curveX.toFixed(3)}% 50%)`
        rightRef.current.style.clipPath = clipPath
      }

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

      animationFrameId = requestAnimationFrame(animate)
    }

    containerRef.current.addEventListener("mousemove", handleMousemove)
    animate()

    return () => {
      containerRef.current?.removeEventListener("mousemove", handleMousemove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative aspect-video overflow-hidden">
      <div ref={leftRef} className="absolute inset-0">
        <Image className="absolute inset-0 w-full" src={PurpleBackground} quality={90} alt="" />
        <div
          className="absolute inset-0 w-full opacity-20 mix-blend-darken"
          style={{ backgroundImage: "url(/noise.gif)" }}
        ></div>
        <Image className="absolute inset-0 w-full" src={Joe} alt="" />
      </div>
      <div ref={rightRef} className="absolute inset-0">
        <Image className="absolute inset-0 w-full" src={GreenBackground} quality={90} alt="" />
        <div
          className="absolute inset-0 w-full opacity-20 mix-blend-darken"
          style={{ backgroundImage: "url(/noise.gif)" }}
        ></div>
        <Image className="absolute inset-0 w-full" src={James} alt="" />
      </div>
      <div
        ref={leftBioRef}
        className="absolute left-[10%] top-[25%] w-[40%] max-w-lg rounded-lg bg-black/15 p-12 text-white backdrop-blur-xl [transition:opacity_250ms,filter_250ms,transform_0ms]"
      >
        <div className="mb-3 flex items-center gap-4">
          <Image width="800" height="800" className="size-16 rounded-full" src={"/jd.jpg"} alt="Joe di Stefano" />
          <div>
            <h3 className="mb-0">Joe di Stefano</h3>
            <p className="font-sm text-white/70">Technical Director</p>
          </div>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo.
        </p>
      </div>
      <div
        ref={rightBioRef}
        className="absolute right-[10%] top-[25%] w-[40%] max-w-lg rounded-lg bg-black/15 p-12 text-white backdrop-blur-xl [transition:opacity_250ms,filter_250ms,transform_0ms]"
      >
        <div className="mb-3 flex items-center gap-4">
          <Image width="800" height="800" className="size-16 rounded-full" src={"/jk.jpg"} alt="James Kowalskiadd" />
          <div>
            <h3 className="mb-0">James Kowalski</h3>
            <p className="font-sm text-white/70">Creative Director</p>
          </div>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo.
        </p>
      </div>
    </div>
  )
}
