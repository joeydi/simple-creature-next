"use client"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { SplitText } from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

interface Props {
  delay?: number
  reset?: boolean
}

const SplitHeading = ({ reset = false, delay = 0, children }: React.PropsWithChildren<Props>) => {
  const divRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!divRef.current) {
      return
    }

    const split = new SplitText(divRef.current, { type: "lines,words" })

    // Apply the final line styling up front. Doing this here (rather than a
    // frame later) avoids a post-mount layout shift from the collapsing
    // line-height, which would knock anchor scroll positions off.
    gsap.set(split.lines, {
      overflow: "hidden",
      display: "block",
      lineHeight: "1",
      marginBottom: "-0.2em",
    })

    // Use RAF to batch reads after writes complete
    const rafId = requestAnimationFrame(() => {
      if (!divRef.current || split.lines.length < 2) return

      // Lines are full-width blocks, so we can't read their content width
      // directly — measure it from each line's word children instead.
      const contentWidth = (line: Element) => {
        const words = line.querySelectorAll("div")
        if (!words.length) return 0
        const first = words[0].getBoundingClientRect()
        const last = words[words.length - 1].getBoundingClientRect()
        return last.right - first.left
      }

      // Batch all reads together to avoid forced reflows
      const divWidth = divRef.current.getBoundingClientRect().width

      // Calculate values before any more writes
      const line1Offset = divWidth - contentWidth(split.lines[0])
      const line2Offset = (divWidth - contentWidth(split.lines[1])) / 2

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
        0 + delay,
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
        0 + delay,
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
        0 + delay,
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
        0 + delay,
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
        0 + delay,
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
        0 + delay,
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
