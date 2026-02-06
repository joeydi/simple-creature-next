"use client"

import { cn } from "@/lib/utils"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Sticky = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  const stickyRef = useRef<HTMLDivElement>(null)
  const childRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: stickyRef.current,
      start: "top top",
      end: () => `bottom ${childRef.current?.getBoundingClientRect().height ?? 0}`,
      pin: childRef.current,
      invalidateOnRefresh: true,
    })
  })

  return (
    <div ref={stickyRef} className={cn("min-h-full", className)} {...props}>
      <div ref={childRef} className="will-change-transform">{children}</div>
    </div>
  )
}

export default Sticky
