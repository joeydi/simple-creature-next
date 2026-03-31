"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface SplitRevealProps {
  left: React.ReactNode
  right: React.ReactNode
  className?: string
  containerRef: React.RefObject<HTMLDivElement>
  onFrame?: (lerpedX: number) => void
}

export default function SplitReveal({ left, right, className, containerRef, onFrame }: SplitRevealProps) {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const lastX = useRef(40)
  const lerpXFactor = useRef(0.05)
  const onFrameRef = useRef(onFrame)
  onFrameRef.current = onFrame

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      onEnter: () => {
        lastX.current = 85
      },
      onEnterBack: () => {
        lastX.current = 15
      },
      onLeave: () => {
        lastX.current = 60
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
    let lerpedX = 50
    let animationFrameId: number
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const handleMousemove = (e: MouseEvent) => {
      if (!containerRef.current) return

      lerpXFactor.current = 0.1

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100

      const currentTime = performance.now()
      const deltaTime = currentTime - lastTime

      if (deltaTime > 0) {
        const deltaX = percentage - lastX.current
        velocity = deltaX / deltaTime
        velocity = Math.max(-1, Math.min(1, velocity))
      }

      lastX.current = percentage
      lastTime = currentTime
    }

    const animate = () => {
      velocity *= 0.9
      lerpedVelocity = lerp(lerpedVelocity, velocity, 0.1)
      lerpedX = lerp(lerpedX, lastX.current, lerpXFactor.current)

      if (leftRef.current) {
        const curveX = lastX.current + 40 * lerpedVelocity
        const clipPath = `shape(from 0 0, line to ${(lerpedX - 0.4).toFixed(3)}% 0, curve to ${(lerpedX - 0.4).toFixed(3)}% 100% with ${curveX.toFixed(3)}% 50%, line to 0 100%, line to 0 0`
        leftRef.current.style.clipPath = clipPath
      }

      if (rightRef.current) {
        const curveX = lastX.current + 40 * lerpedVelocity
        const clipPath = `shape(from ${lerpedX.toFixed(3)}% 0, line to 100% 0, line to 100% 100%, line to ${lerpedX.toFixed(3)}% 100%, curve to ${lerpedX.toFixed(3)}% 0 with ${curveX.toFixed(3)}% 50%)`
        rightRef.current.style.clipPath = clipPath
      }

      onFrameRef.current?.(lerpedX)

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
    <div ref={containerRef} className={className ?? "relative aspect-video overflow-hidden"}>
      <div ref={leftRef} className="absolute inset-0">
        {left}
      </div>
      <div ref={rightRef} className="absolute inset-0">
        {right}
      </div>
    </div>
  )
}
