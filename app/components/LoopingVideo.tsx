"use client"

import { useEffect, useRef, useState } from "react"

type LoopingVideoProps = {
  src: string
  poster?: string
  width?: number
  height?: number
  className?: string
}

export function LoopingVideo({ src, poster, width, height, className }: LoopingVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [hasBeenNear, setHasBeenNear] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (hasBeenNear) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasBeenNear(true)
          io.disconnect()
        }
      },
      { rootMargin: "200px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasBeenNear])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => setIsVisible(entries[0]?.isIntersecting ?? false), {
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || !hasBeenNear) return
    if (isVisible) {
      el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [hasBeenNear, isVisible])

  return (
    <video
      ref={ref}
      src={hasBeenNear ? src : undefined}
      poster={poster}
      width={width}
      height={height}
      preload="none"
      loop
      muted
      playsInline
      className={className}
    />
  )
}
