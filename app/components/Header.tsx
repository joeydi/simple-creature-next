"use client"

import Link from "next/link"
import styles from "./Header.module.scss"
import { useEffect, useRef } from "react"
import { cn, fluid } from "@/lib/utils"
import Container from "./Container"
import { useMenu } from "@/contexts/MenuContext"
import { usePathname } from "next/navigation"

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

    return () => {
      window.removeEventListener("scroll", scrollHandler)
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

  const clickHandler = () => {
    setIsActive(!isActive)
  }

  const timings = ["delay-0", "delay-40", "delay-60", "delay-80", "delay-100"]

  return (
    <header className="fixed z-10 flex h-[clamp(100px,84px+5vw,180px)] w-full items-center" ref={headerRef}>
      <Container className="flex justify-end">
        <div className="relative">
          <ul
            className={cn(
              "absolute -right-3 top-[calc(100%+16px)] flex min-w-80 origin-top list-none flex-col gap-px rounded-2xl transition-all",
              // isActive ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
            )}
          >
            {links.map((link, i) => {
              return (
                <li key={link.title}>
                  <Link
                    style={{ fontSize: fluid(24, 72) }}
                    className={cn(
                      "duration-250 block rounded-lg px-8 py-4 text-right text-7xl backdrop-blur-[20px] hover:duration-0",
                      "text-white backdrop-blur-[0px] hover:bg-white/10 hover:text-black hover:backdrop-blur-[20px]",
                      isActive ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 delay-0",
                      timings[i],
                    )}
                    href={link.url}
                  >
                    {link.title}
                  </Link>
                </li>
              )
            })}
          </ul>
          <button className={cn(styles.menuButton, isActive ? styles.menuButtonActive : "")} onClick={clickHandler}>
            <span>Menu</span>
          </button>
        </div>
      </Container>
    </header>
  )
}

export default Header
