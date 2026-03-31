"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import James from "@/images/props/lego-james.png"
import PurpleBackground from "@/../public/about-bg-purple.jpg"
import styles from "./AboutJames.module.scss"

import Tablet1 from "@/images/props/tablet-1.png"
import Tablet2 from "@/images/props/tablet-2.png"
import GPU1 from "@/images/props/gpu-1.png"
import GPU2 from "@/images/props/gpu-2.png"
import GPU3 from "@/images/props/gpu-3.png"
import GPU4 from "@/images/props/gpu-4.png"
import Sack1 from "@/images/props/sack-1.png"
import Sack2 from "@/images/props/sack-2.png"
import Sack3 from "@/images/props/sack-3.png"

interface Props {
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export default function AboutJames({ containerRef }: Props) {
  const maxRotation = 30

  const sceneRef = useRef<HTMLDivElement>(null)
  const propsRef = useRef<HTMLDivElement>(null)
  const current = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef?.current ?? sceneRef.current
    if (!container) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      const max = maxRotation
      target.current.y = nx * max
      target.current.x = ny * max * -0.25
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.08)
      current.current.y = lerp(current.current.y, target.current.y, 0.08)
      if (propsRef.current) {
        propsRef.current.style.setProperty("--rot-y", `${current.current.y}deg`)
        propsRef.current.style.setProperty("--rot-x", `${current.current.x}deg`)
        propsRef.current.style.setProperty("--translate-x", `${current.current.y * 0.1}%`)
        propsRef.current.style.transform = `rotateX(var(--rot-x)) rotateY(var(--rot-y))`
      }
      rafId.current = requestAnimationFrame(tick)
    }

    container.addEventListener("mousemove", onMouseMove)
    rafId.current = requestAnimationFrame(tick)

    return () => {
      container.removeEventListener("mousemove", onMouseMove)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      <Image className="absolute inset-0 w-full" src={PurpleBackground} quality={90} alt="" />
      <div
        className="absolute inset-0 w-full opacity-20 mix-blend-darken"
        style={{ backgroundImage: "url(/noise.gif)" }}
      ></div>
      <div className={styles.scene} ref={sceneRef}>
        <div className={styles.props} ref={propsRef}>
          <Image className={styles.lego} src={James} alt="" />
          <Image className={styles.tablet1} src={Tablet1} alt="" />
          <Image className={styles.tablet2} src={Tablet2} alt="" />
          <Image className={styles.gpu1} src={GPU1} alt="" />
          <Image className={styles.gpu2} src={GPU2} alt="" />
          <Image className={styles.gpu3} src={GPU3} alt="" />
          <Image className={styles.gpu4} src={GPU4} alt="" />
          <Image className={styles.sack1} src={Sack1} alt="" />
          <Image className={styles.sack2} src={Sack2} alt="" />
          <Image className={styles.sack3} src={Sack3} alt="" />
        </div>
      </div>
    </>
  )
}
