"use client"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface Props {
  duration?: number
  delay?: number
  reset?: boolean
}

const FadeIn = ({ duration = 1, delay = 0, reset = false, children }: React.PropsWithChildren<Props>) => {
  const spanRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const onLeave = reset ? "reset" : "resume"

    gsap.fromTo(
      spanRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: spanRef.current,
          toggleActions: `play ${onLeave} resume ${onLeave}`,
        },
      },
    )
  }, [])

  return (
    <span ref={spanRef} style={{ opacity: 0 }}>
      {children}
    </span>
  )
}

export default FadeIn
