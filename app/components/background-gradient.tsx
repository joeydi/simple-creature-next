"use client"

import { useMenu } from "@/contexts/MenuContext"
import AnimatedGradient from "./animated-gradient"
import { cn } from "@/lib/utils"

const COLORS = ["#1A3EBF", "#4A79A6", "#1A3EBF", "#000000", "#F43791"]

export default function BackgroundGradient() {
  const { isActive } = useMenu()

  return (
    <div
      className={cn(
        "fixed left-0 top-0 -z-10 h-screen w-screen transition-transform duration-1000",
        "ease-[cubic-bezier(0.62,0.21,0,1)]",
        isActive ? "scale-100" : "scale-150",
      )}
    >
      <AnimatedGradient colors={COLORS} amount={0.1} frequencyX={2} frequencyY={3} speed={0.1} isAnimating={true} />
    </div>
  )
}
