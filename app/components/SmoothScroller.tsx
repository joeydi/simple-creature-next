"use client"

import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
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
    })
  })

  // Native anchor scrolling doesn't work with ScrollSmoother (the page is
  // pinned and faked via transforms), so drive hash navigation through the
  // smoother instead.
  const scrollToHash = useCallback((smooth: boolean) => {
    const hash = window.location.hash
    if (!hash || hash.length < 2) return

    const target = document.querySelector(hash)
    if (!target) return

    // Leave a little breathing room above the target (scroll-padding-top).
    smoother.current?.scrollTo(target as HTMLElement, smooth, "top 40px")
  }, [])

  useEffect(() => {
    // Initial load and cross-page navigation are handled by the refresh effect
    // below (it must re-measure the smoother before scrolling). Here we only
    // need to handle in-page hash changes (clicking an anchor link).
    const onHashChange = () => scrollToHash(true)
    window.addEventListener("hashchange", onHashChange)

    return () => window.removeEventListener("hashchange", onHashChange)
  }, [scrollToHash])

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
        const paddingX = fluidValue(20, 120, undefined, undefined, windowWidth)
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
      scrollToHash(false)
    })

    return () => window.cancelAnimationFrame(id)
  }, [pathname, scrollToHash])

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
          "h-screen origin-left bg-[#FAFBFE] transition-[translate,scale,border-radius,corner-shape] duration-1000",
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
