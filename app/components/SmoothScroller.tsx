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
  const { isActive, setIsActive } = useMenu()
  const smoother = useRef<ReturnType<typeof ScrollSmoother.create> | null>(null)

  const [scale, setScale] = useState(0.75)
  const [translate, setTranslate] = useState(20)

  useGSAP(() => {
    smoother.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 0.5,
      smoothTouch: 0.1,
    })
  })

  useEffect(() => {
    let rafId: number | null = null

    const calc = () => {
      // Cancel previous frame if queued
      if (rafId) cancelAnimationFrame(rafId)

      // Use RAF to avoid forced reflows during resize
      rafId = requestAnimationFrame(() => {
        const menu = document.querySelector("#menu")

        if (!menu) return

        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        const paddingX = fluidValue(20, 80, undefined, undefined, windowWidth)
        const menuRect = menu.getBoundingClientRect()

        if (windowWidth >= 768) {
          const availableWidth = menuRect.x - paddingX * 2
          setScale(availableWidth / windowWidth)
        } else {
          const availableHeight = windowHeight - 200
          setScale(availableHeight / windowHeight)
        }

        setTranslate(paddingX)
      })
    }

    // Calculate once on mount
    calc()

    // Calculate on window resize
    window.addEventListener("resize", calc, { passive: true })

    return () => {
      // Remove resize handler on unmount
      window.removeEventListener("resize", calc)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      smoother.current?.refresh()
      ScrollTrigger.refresh()
    })

    return () => window.cancelAnimationFrame(id)
  }, [pathname])

  useEffect(() => {
    const id = window.setTimeout(() => {
      smoother.current?.refresh()
      ScrollTrigger.refresh()
    }, 1001)

    return () => window.clearTimeout(id)
  }, [pathname])

  return (
    <div id="menu-scroll" className="fixed inset-0 h-screen origin-[15%]">
      <div
        id="smooth-wrapper"
        className={cn(
          "h-screen origin-left bg-[#FAFBFE] transition-all duration-1000",
          "ease-[cubic-bezier(0.62,0.21,0,1)] translate-x-(--translate) scale-(--scale)",
          isActive ? "rounded-media" : "rounded-none",
        )}
        style={{
          ["--translate" as any]: isActive ? `${translate}px` : "0px",
          ["--scale" as any]: isActive ? scale : 1,
        }}
      >
        <div id="smooth-content">{children}</div>
      </div>
    </div>
  )
}

export default SmoothScroller
