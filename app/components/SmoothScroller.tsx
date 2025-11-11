"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { useMenu } from "@/contexts/MenuContext"
import { cn, fluidValue } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother)

const SmoothScroller = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname()
  const { isActive } = useMenu()
  const smoother = useRef<ReturnType<typeof ScrollSmoother.create> | null>(null)

  const [scale, setScale] = useState(0.75)
  const [translate, setTranslate] = useState(20)

  useGSAP(() => {
    smoother.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 0.5,
      smoothTouch: 0.1,
      effects: true,
    })
  })

  useEffect(() => {
    const calc = () => {
      const menu = document.querySelector("#menu")

      if (!menu) return

      const windowWidth = window.innerWidth
      const padding = fluidValue(20, 80, undefined, undefined, windowWidth)
      const menuRect = menu.getBoundingClientRect()
      const availableWidth = windowWidth > 768 ? menuRect.x - padding * 2 : windowWidth - padding * 2

      setScale(availableWidth / windowWidth)
      setTranslate(padding)
    }

    // Calculate once on mount
    calc()

    // Calculate on window resize
    window.addEventListener("resize", calc)

    return () => {
      // Remove resize handler on unmount
      window.removeEventListener("resize", calc)
    }
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      smoother.current?.refresh()
      ScrollTrigger.refresh()
    }, 500)

    return () => window.clearTimeout(id)
  }, [pathname])

  useEffect(() => {
    smoother.current?.scrollTo(0, false)

    const id = requestAnimationFrame(() => {
      smoother.current?.refresh()
      ScrollTrigger.refresh()
    })

    return () => window.cancelAnimationFrame(id)
  }, [pathname])

  return (
    <div
      id="smooth-wrapper"
      className={cn(
        "origin-left bg-white transition-all duration-500",
        "ease-[cubic-bezier(0.62,0.21,0,1)] translate-x-(--translate) scale-(--scale)",
        isActive ? "rounded-4xl" : "rounded-none",
      )}
      style={{
        ["--translate" as any]: isActive ? `${translate}px` : "0px",
        ["--scale" as any]: isActive ? scale : 1,
      }}
    >
      <div id="smooth-content">{children}</div>
    </div>
  )
}

export default SmoothScroller
