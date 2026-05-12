"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Container from "./Container"
import styles from "./PageHeader.module.scss"

export type Crumb = { href: string; label: React.ReactNode }

type Props = React.PropsWithChildren<{
  crumbs?: Crumb[]
}>

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M6 21q-1.25 0-2.125-.875T3 18v-6q0-.6.225-1.15t.65-.975l6-6q.425-.45.988-.663T12 3t1.125.213t1 .662l.75.75L7 12.5V17h10v-4.5l-3.6-3.6l2.875-2.85l3.85 3.825q.425.425.65.975T21 12v6q0 1.25-.875 2.125T18 21z"
    />
  </svg>
)

const PageHeader = ({ children, crumbs }: Props) => {
  const trailRef = useRef<HTMLElement | null>(null)
  const [trailWidth, setTrailWidth] = useState(0)
  const [hovered, setHovered] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const el = trailRef.current
    if (!el) return

    const measure = () => setTrailWidth(el.getBoundingClientRect().width)
    measure()

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(measure)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [pathname, crumbs])

  return (
    <div className={styles.pageHeader}>
      <Container>
        <div
          className={`${styles.row}${hovered ? ` ${styles.hovered}` : ""}`}
          style={{ "--trail-width": `${trailWidth}px` } as React.CSSProperties}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {crumbs && (
            <nav aria-label="Breadcrumb" className={styles.trail} ref={trailRef}>
              <Link href="/" className={styles.crumb} aria-label="Home">
                <HomeIcon />
              </Link>
              {crumbs.map((c) => (
                <Fragment key={c.href}>
                  <span className={styles.separator}>/</span>
                  <Link href={c.href} className={styles.crumb}>
                    {c.label}
                  </Link>
                </Fragment>
              ))}
              <span className={styles.separator}>/</span>
              <wbr />
            </nav>
          )}
          <hgroup className={styles.title}>{children}</hgroup>
        </div>
      </Container>
    </div>
  )
}

export default PageHeader
