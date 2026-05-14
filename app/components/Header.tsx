"use client"

import styles from "./Header.module.scss"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import Container from "./Container"
import Menu from "./Menu"
import { useMenu } from "@/contexts/MenuContext"
import { usePathname } from "next/navigation"
import gsap from "gsap"

const Header = () => {
  const lastScrollRef = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  const { isActive, setIsActive } = useMenu()
  const pathname = usePathname()
  const menuScrollProgress = useRef(0)
  const menuScrollLerped = useRef(0)
  const rafRef = useRef<number | null>(null)
  const isActiveRef = useRef(isActive)
  const isWheelingRef = useRef(false)

  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])

  useEffect(() => {
    setIsActive(false)
  }, [pathname])

  useEffect(() => {
    const scrollHandler = () => {
      // Hide the menu if the user has scrolled more than 100px
      if (Math.abs(lastScrollRef.current - window.scrollY) > 100) {
        setIsActive(false)
      }
    }
    window.addEventListener("scroll", scrollHandler, { passive: true })

    let wheelTimeout = 0

    const wheelHandler = (e: WheelEvent) => {
      if (isActiveRef.current) return

      const scrollY = window.scrollY
      const scrollRemainder = document.documentElement.scrollHeight - window.innerHeight - scrollY

      isWheelingRef.current = true
      window.clearTimeout(wheelTimeout)
      wheelTimeout = window.setTimeout(() => {
        isWheelingRef.current = false
      }, 100)

      if ((scrollRemainder < 100 && e.deltaY > 0) || e.deltaY < 0) {
        menuScrollProgress.current = gsap.utils.clamp(0, 600, menuScrollProgress.current + e.deltaY)
      }

      if (menuScrollProgress.current >= 600) {
        setIsActive(true)
      }
    }

    window.addEventListener("wheel", wheelHandler)

    return () => {
      window.removeEventListener("scroll", scrollHandler)
      window.removeEventListener("wheel", wheelHandler)
    }
  }, [])

  useEffect(() => {
    const header = headerRef.current

    if (!header) {
      return
    }

    if (isActive) {
      lastScrollRef.current = window.scrollY
    }
  }, [isActive])

  useEffect(() => {
    const updateCircle = () => {
      // lerp menuScrollProgress back to zero
      if (!isActiveRef.current) {
        menuScrollProgress.current *= isWheelingRef.current ? 0.98 : 0.8
      } else {
        menuScrollProgress.current *= 0.9
      }

      menuScrollLerped.current = gsap.utils.interpolate(menuScrollLerped.current, menuScrollProgress.current, 0.1)

      const wrapper: HTMLDivElement | null = document.querySelector("#menu-scroll")
      if (wrapper) {
        const scale = gsap.utils.mapRange(0, 600, 1, 0.95, menuScrollLerped.current)
        const scaleClamped = gsap.utils.clamp(0, 1, scale)
        wrapper.style.scale = `${scaleClamped}`
      }

      rafRef.current = requestAnimationFrame(updateCircle)
    }

    rafRef.current = requestAnimationFrame(updateCircle)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const clickHandler = () => {
    setIsActive(!isActive)
  }

  return (
    <header
      className="pointer-events-none fixed z-10 flex h-[clamp(100px,84px+5vw,180px)] w-full items-center"
      ref={headerRef}
    >
      <Container className="flex justify-end">
        <div className="pointer-events-auto relative">
          <button className={cn(styles.menuButton, isActive ? styles.menuButtonActive : "")} onClick={clickHandler}>
            <span>Menu</span>
          </button>
          <Menu />
        </div>
      </Container>
    </header>
  )
}

export default Header
