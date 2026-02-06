"use client"

import styles from "./Header.module.scss"
import { useEffect, useRef } from "react"
import { cn, fluid } from "@/lib/utils"
import Container from "./Container"
import { useMenu } from "@/contexts/MenuContext"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import Link from "next/link"

const links = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Work",
    url: "/work",
  },
  {
    title: "News",
    url: "/news",
  },
  {
    title: "About",
    url: "/about",
  },
  {
    title: "Contact",
    url: "/contact",
  },
]

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

  const timings = ["delay-300", "delay-280", "delay-260", "delay-240", "delay-220"]
  const timingsReverse = ["delay-20", "delay-40", "delay-60", "delay-80", "delay-100"]
  const translations = ["-translate-y-12", "-translate-y-24", "-translate-y-36", "-translate-y-48", "-translate-y-60"]

  return (
    <header className="fixed z-10 flex h-[clamp(100px,84px+5vw,180px)] w-full items-center" ref={headerRef}>
      <Container className="flex justify-end">
        <div className="relative">
          <button className={cn(styles.menuButton, isActive ? styles.menuButtonActive : "")} onClick={clickHandler}>
            <span>Menu</span>
          </button>
          <ul
            id="menu"
            className={cn(
              "absolute -right-3 top-[calc(100%+16px)] flex min-w-80 origin-top list-none flex-col gap-px rounded-2xl transition-all",
              "bg-white/25 p-2 shadow-xl backdrop-blur-[20px] md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none",
              isActive ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {links.map((link, i) => {
              return (
                <li
                  key={link.title}
                  className={cn(
                    "duration-500",
                    isActive
                      ? `${timings[i]} translate-y-0 scale-y-100 opacity-100 blur-none`
                      : `${timingsReverse[i]} ${translations[i]} scale-y-150 opacity-0 blur-md delay-0`,
                  )}
                >
                  <Link
                    style={{ fontSize: fluid(36, 72) }}
                    className={cn(
                      "block rounded-lg px-8 py-4 text-right text-7xl font-[450] md:font-normal",
                      "text-black backdrop-blur-none duration-100 hover:bg-white/15 hover:duration-0 md:text-white",
                    )}
                    href={link.url}
                  >
                    {link.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </header>
  )
}

export default Header
