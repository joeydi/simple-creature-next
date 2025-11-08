"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { useMenu } from "@/contexts/MenuContext"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother)

const SmoothScroller = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname()
  const { isActive } = useMenu()
  const smoother = useRef<ReturnType<typeof ScrollSmoother.create> | null>(null)

  useGSAP(() => {
    smoother.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
      normalizeScroll: true,
    })
  })

  // useEffect(() => {
  //   const id = window.setTimeout(() => {
  //     smoother.current?.refresh()
  //     ScrollTrigger.refresh()
  //   }, 500)

  //   return () => window.clearTimeout(id)
  // }, [pathname])

  useEffect(() => {
    smoother.current?.scrollTo(0, false)

    const id = requestAnimationFrame(() => {
      // console.log(pathname, smoother.current)
      smoother.current?.refresh()
      ScrollTrigger.refresh()
    })

    return () => window.cancelAnimationFrame(id)
  }, [pathname])

  return (
    <div
      id="smooth-wrapper"
      className={cn(
        "ease-[cubic-bezier(0.08,0.94,0.26,0.95)] over h-full bg-white transition duration-500",
        // isActive ? "-translate-x-[6.125%] scale-75 rounded-xl" : "scale-100 rounded-none",
      )}
    >
      <div id="smooth-content">{children}</div>
    </div>
  )
}

export default SmoothScroller
