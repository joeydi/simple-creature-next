"use client"

import Link from "next/link"
import styles from "./Header.module.scss"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import Container from "./Container"

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
  const [isScrolled, setIsScrolled] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const scrollHandler = () => {
      // Hide the menu if the user has scrolled more than 100px
      if (Math.abs(lastScrollRef.current - window.scrollY) > 100) {
        setIsActive(false)
      }

      setIsScrolled(window.scrollY >= 100)
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
  }, [isActive, isScrolled])

  const clickHandler = () => {
    setIsActive(!isActive)
  }

  return (
    <header
      className={cn(styles.header, "fixed z-10 flex h-[clamp(100px,84px+5vw,180px)] w-full items-center")}
      ref={headerRef}
    >
      <Container className="flex justify-end">
        <div className="relative">
          <ul
            className={cn(
              "absolute right-0 top-[calc(100%+16px)] flex min-w-48 origin-top list-none flex-col gap-px rounded-2xl bg-white/50 p-4 backdrop-blur-[20px] transition-all",
              isActive ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
            )}
          >
            {links.map((link) => {
              return (
                <li key={link.title}>
                  <Link
                    className="hover:bg-black/8 block rounded-sm px-4 py-1 text-right font-medium transition hover:transition-none"
                    href={link.url}
                    onClick={() => {
                      setIsActive(false)
                    }}
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
