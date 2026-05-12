"use client"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { SplitText } from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

interface Props {
  reset?: boolean
}

const SplitHeading = ({ reset = false, children }: React.PropsWithChildren<Props>) => {
  const divRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!divRef.current) {
      return
    }

    const split = new SplitText(divRef.current, { type: "lines,words" })

    // First batch of writes
    gsap.set(split.lines, {
      overflow: "hidden",
      display: "inline-block",
    })

    // Use RAF to batch reads after writes complete
    const rafId = requestAnimationFrame(() => {
      if (!divRef.current || split.lines.length < 2) return

      // Batch all reads together to avoid forced reflows
      const divRect = divRef.current.getBoundingClientRect()
      const line1Rect = split.lines[0].getBoundingClientRect()
      const line2Rect = split.lines[1].getBoundingClientRect()

      // Calculate values before any more writes
      const line1Offset = divRect.width - line1Rect.width
      const line2Offset = (divRect.width - line2Rect.width) / 2

      // Then do all writes together
      gsap.set(split.lines, {
        display: "block",
        lineHeight: "1",
        marginBottom: "-0.2em",
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: divRef.current,
          toggleActions: `play resume resume ${reset ? "reset" : "resume"}`,
        },
      })

      timeline.fromTo(
        split.lines[0],
        {
          y: " -0.1em",
        },
        {
          y: "0em",
          duration: 2,
          ease: "power3.inOut",
        },
        0,
      )

      timeline.fromTo(
        split.lines[1],
        {
          y: "0.1em",
        },
        {
          y: "0em",
          duration: 2,
          ease: "power3.inOut",
        },
        0,
      )

      timeline.fromTo(
        split.lines[0].querySelectorAll("div"),
        {
          yPercent: 100,
        },
        {
          yPercent: 0,
          duration: 2,
          stagger: 0.125,
          ease: "power3.out",
        },
        0,
      )

      timeline.fromTo(
        split.lines[0].querySelectorAll("div"),
        {
          x: line1Offset,
        },
        {
          x: 0,
          duration: 2,
          stagger: 0.125,
          ease: "power3.inOut",
        },
        0,
      )

      timeline.fromTo(
        split.lines[1].querySelectorAll("div"),
        {
          yPercent: -100,
        },
        {
          yPercent: 0,
          duration: 2,
          stagger: 0.125,
          ease: "power3.out",
        },
        0,
      )

      timeline.fromTo(
        split.lines[1].querySelectorAll("div"),
        {
          x: line2Offset,
        },
        {
          x: 0,
          duration: 2,
          stagger: 0.125,
          ease: "power3.inOut",
        },
        0,
      )

      gsap.set(divRef.current, {
        opacity: 1,
      })
    })

    return () => {
      cancelAnimationFrame(rafId)
      split.revert()
    }
  })

  return (
    <div ref={divRef} style={{ opacity: 0 }} className="[&>div]:overflow-hidden">
      {children}
    </div>
  )
}

export default SplitHeading
