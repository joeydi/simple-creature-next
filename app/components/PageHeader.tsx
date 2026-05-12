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
  <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 100 100" aria-hidden="true">
    <path
      fill="currentColor"
      d="M50,0 C77.6142375,0 100,22.3857625 100,50 C100,77.6142375 77.6142375,100 50,100 C22.3857625,100 0,77.6142375 0,50 C0,22.3857625 22.3857625,0 50,0 Z M78.8087396,30.46875 L54.3943854,30.46875 L54.3943854,69.53125 L78.8087396,69.53125 L78.8087396,59.765625 L64.1600104,59.765625 L64.1600104,40.234375 L78.8087396,40.234375 L78.8087396,30.46875 Z M50.4875276,30.46875 L21.1912604,30.46875 L21.1912604,54.8828733 L40.7222673,54.8828733 L40.7222673,59.7655034 L21.1912604,59.7655034 L21.1912604,69.53125 L50.4875276,69.53125 L50.4875276,45.1176129 L30.9565207,45.1176129 L30.9565207,40.2340103 L50.4875276,40.2340103 L50.4875276,30.46875 Z"
    ></path>
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
