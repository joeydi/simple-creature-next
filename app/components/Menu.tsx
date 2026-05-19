"use client"

import { cn, fluid } from "@/lib/utils"
import { useMenu } from "@/contexts/MenuContext"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { SplitText } from "gsap/SplitText"
import { CustomEase } from "gsap/CustomEase"
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin"
import { useRef } from "react"

gsap.registerPlugin(SplitText, ScrambleTextPlugin, CustomEase)

const SCRAMBLE_CHARS = "#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~"

interface MenuLinkProps {
  title: string
  url: string
}

const MenuLink = ({ title, url }: MenuLinkProps) => {
  const { setIsActive } = useMenu()
  const linkRef = useRef<HTMLAnchorElement>(null)
  const charsRef = useRef<HTMLElement[]>([])
  const originalsRef = useRef<string[]>([])
  const duration = 0.5

  useGSAP(
    () => {
      if (!linkRef.current) return
      const split = new SplitText(linkRef.current, { type: "chars" })
      charsRef.current = split.chars as HTMLElement[]
      originalsRef.current = split.chars.map((c) => c.textContent || "")

      const measureChars = () => {
        const chars = charsRef.current
        chars.forEach((char) => {
          char.style.width = ""
        })
        chars.forEach((char) => {
          char.style.width = `${char.clientWidth}px`
        })
      }

      measureChars()

      const observer = new ResizeObserver(measureChars)
      observer.observe(linkRef.current)

      return () => {
        observer.disconnect()
        split.revert()
      }
    },
    { scope: linkRef },
  )

  const handleMouseEnter = () => {
    const chars = charsRef.current
    const originals = originalsRef.current
    if (!chars.length) return

    gsap.killTweensOf(chars)
    chars.forEach((char, i) => {
      char.textContent = originals[i]
    })

    gsap.to(chars, {
      duration: duration,
      scrambleText: {
        text: "{original}",
        chars: SCRAMBLE_CHARS,
        speed: 1,
      },
      stagger: duration / chars.length / 2,
      ease: "none",
    })

    gsap.to(chars, {
      opacity: 0.5,
      scale: 1.333,
      filter: "blur(8px)",
      duration: duration / 4,
      stagger: duration / chars.length / 2,
      ease: "none",
    })

    gsap.to(chars, {
      delay: duration / 4,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: duration / 2,
      stagger: duration / chars.length / 2,
      ease: "none",
    })
  }

  return (
    <Link
      ref={linkRef}
      style={{ fontSize: fluid(36, 72) }}
      className={cn(
        "block whitespace-nowrap p-2 text-7xl font-[450] md:p-4 md:font-normal",
        "text-black transition-transform duration-300 hover:-translate-x-6 md:text-white",
      )}
      href={url}
      onMouseEnter={handleMouseEnter}
      onClick={() => setIsActive(false)}
    >
      {title}
    </Link>
  )
}

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
    title: "Services",
    url: "/services",
  },
  {
    title: "About",
    url: "/about",
  },
]

const timings = ["delay-300", "delay-280", "delay-260", "delay-240", "delay-220"]
const timingsReverse = ["delay-20", "delay-40", "delay-60", "delay-80", "delay-100"]
const translations = ["-translate-y-12", "-translate-y-24", "-translate-y-36", "-translate-y-48", "-translate-y-60"]

const Menu = () => {
  const { isActive } = useMenu()

  return (
    <ul
      id="menu"
      className={cn(
        "absolute -right-3 top-[calc(100%+16px)] flex min-w-60 origin-top list-none flex-col items-end gap-px rounded-2xl transition-all",
        "bg-white/25 px-2 py-4 shadow-xl backdrop-blur-[20px] md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none",
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
            <MenuLink title={link.title} url={link.url} />
          </li>
        )
      })}
    </ul>
  )
}

export default Menu
