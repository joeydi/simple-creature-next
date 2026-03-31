"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Joe from "@/images/props/lego-joe.png"
import PurpleBackground from "@/../public/about-bg-purple.jpg"
import styles from "./AboutJoe.module.scss"

import Cup1 from "@/images/props/cup-1.png"
import Cup2 from "@/images/props/cup-2.png"
import Laptop1 from "@/images/props/laptop-1.png"
import Laptop2 from "@/images/props/laptop-2.png"
import Laptop3 from "@/images/props/laptop-3.png"
import Laptop4 from "@/images/props/laptop-4.png"
import Mug1 from "@/images/props/mug-1.png"
import Mug2 from "@/images/props/mug-2.png"

interface Props {
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export default function AboutJoe({ containerRef }: Props) {
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
          <Image className={styles.lego} src={Joe} alt="" />
          <Image className={styles.cup1} src={Cup1} alt="" />
          <Image className={styles.cup2} src={Cup2} alt="" />
          <Image className={styles.laptop1} src={Laptop1} alt="" />
          <Image className={styles.laptop2} src={Laptop2} alt="" />
          <Image className={styles.laptop3} src={Laptop3} alt="" />
          <Image className={styles.laptop4} src={Laptop4} alt="" />
          <Image className={styles.mug1} src={Mug1} alt="" />
          <Image className={styles.mug2} src={Mug2} alt="" />
        </div>
      </div>
    </>
  )
}
