"use client"

import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./ServicesPath.module.scss"
import Container from "./Container"
import { useEffect, useId, useMemo, useRef, useState } from "react"
import { BSpline } from "@/lib/BSpline"
import { ServiceItem } from "./ServiceItem"

gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger)

const NUM_SEGMENTS = 12
const STROKE_WIDTH = 48

export type Service = {
  label?: string
  description?: string
  trigger: number
  placeholder?: boolean
}

export type ServicesPathProps = {
  list1: Service[]
  list2: Service[]
  gradientColors: string[]
  textColors: string[]
}

export const ServicesPath = ({ list1, list2, gradientColors, textColors }: ServicesPathProps) => {
  const uid = useId().replace(/:/g, "")
  const maskId = `${uid}-line-mask`
  const gradId = (i: number) => `${uid}-grad-${i}`

  const sectionRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const polylineRef = useRef<SVGPolylineElement>(null)
  const list1Ref = useRef<HTMLUListElement>(null)
  const list2Ref = useRef<HTMLUListElement>(null)

  const [splinePoints, setSplinePoints] = useState<number[][]>()
  const [timelineProgress, setTimelineProgress] = useState(0)

  const [reset, setReset] = useState(0)

  useEffect(() => {
    const list1Items = list1Ref.current?.querySelectorAll("li")
    const list2Items = list2Ref.current?.querySelectorAll("li")

    const calculatePoints = () => {
      if (!sectionRef.current || !list1Ref.current || !list2Ref.current) {
        return
      }

      const sectionRect = sectionRef.current.getBoundingClientRect()
      const scaleFactor = window.innerWidth / sectionRect.width
      const list1Rect = list1Ref.current.getBoundingClientRect()
      const points: number[][] = []

      list1Items?.forEach((item) => {
        const itemRect = item.getBoundingClientRect()
        points.push([(itemRect.x - sectionRect.x) * scaleFactor, (itemRect.y - sectionRect.y) * scaleFactor])
      })

      // Insert one point at the start to the top left of the first item
      points.unshift([-window.innerWidth / 4, (points[0][1] + list1Rect.height / 4) * scaleFactor])

      // Insert one point after the first list to the right
      points.push([window.innerWidth * 1.25, (sectionRect.height / 2) * scaleFactor])

      list2Items?.forEach((item) => {
        const itemRect = item.getBoundingClientRect()
        points.push([
          (itemRect.x + itemRect.width - sectionRect.x) * scaleFactor,
          (itemRect.y - sectionRect.y) * scaleFactor,
        ])
      })

      // Insert one point at the end to the bottom left of the last item
      points.push([-window.innerWidth / 4, sectionRect.height * scaleFactor])

      const spline = new BSpline(points, 3, false)

      const tempPoints = []
      for (let t = 0; t <= 1; t += 0.001) {
        tempPoints.push(spline.calcAt(t))
      }

      setSplinePoints(tempPoints)
    }

    const resizeSVG = () => {
      if (sectionRef.current && svgRef.current) {
        const width = sectionRef.current.clientWidth
        const height = sectionRef.current.clientHeight

        svgRef.current.setAttribute("width", width + "")
        svgRef.current.setAttribute("height", height + "")
        svgRef.current.setAttribute("viewBox", `0 0 ${width} ${height}`)
      }
    }

    calculatePoints()
    resizeSVG()

    window.addEventListener("resize", calculatePoints, { passive: true })
    window.addEventListener("resize", resizeSVG, { passive: true })

    return () => {
      window.removeEventListener("resize", calculatePoints)
      window.removeEventListener("resize", resizeSVG)
    }
  }, [reset])

  const allPointsAttr = useMemo(() => {
    if (!splinePoints || !splinePoints.length) return ""
    return splinePoints.map(([x, y]) => `${x},${y}`).join(" ")
  }, [splinePoints])

  const segments = useMemo(() => {
    if (!splinePoints || splinePoints.length < 2) return []

    const cum: number[] = [0]
    for (let i = 1; i < splinePoints.length; i++) {
      const dx = splinePoints[i][0] - splinePoints[i - 1][0]
      const dy = splinePoints[i][1] - splinePoints[i - 1][1]
      cum.push(cum[i - 1] + Math.hypot(dx, dy))
    }
    const totalLength = cum[cum.length - 1]
    if (totalLength === 0) return []

    const indexAt = (targetLen: number) => {
      let lo = 0
      let hi = cum.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (cum[mid] < targetLen) lo = mid + 1
        else hi = mid
      }
      return lo
    }

    return Array.from({ length: NUM_SEGMENTS }, (_, i) => {
      const startIdx = indexAt((i * totalLength) / NUM_SEGMENTS)
      const endIdx = indexAt(((i + 1) * totalLength) / NUM_SEGMENTS)
      const slice = splinePoints.slice(startIdx, endIdx + 1)
      const [x1, y1] = slice[0]
      const [x2, y2] = slice[slice.length - 1]
      return {
        pointsAttr: slice.map(([x, y]) => `${x},${y}`).join(" "),
        x1,
        y1,
        x2,
        y2,
        color0: gsap.utils.interpolate(gradientColors, i / NUM_SEGMENTS - STROKE_WIDTH / 2 / totalLength),
        color1: gsap.utils.interpolate(gradientColors, (i + 1) / NUM_SEGMENTS),
      }
    })
  }, [splinePoints, gradientColors])

  useGSAP(() => {
    if (!splinePoints || !splinePoints.length || !polylineRef.current) {
      return
    }

    gsap.set(polylineRef.current, { drawSVG: "0% 0%" })

    gsap.to(polylineRef.current, {
      drawSVG: "0 100% live",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 90%",
        end: "bottom 75%",
        scrub: 1,
        onUpdate: (self) => {
          console.log(self.progress.toFixed(2))

          setTimelineProgress(self.progress)
        },
      },
    })
  }, [splinePoints])

  return (
    <section
      ref={sectionRef}
      className="relative"
      onClick={() => {
        setReset(reset + 1)
      }}
    >
      <svg ref={svgRef} className={styles.svg} width="1000" height="1000" viewBox="0 0 1000 1000">
        <defs>
          {segments.map((s, i) => (
            <linearGradient
              key={`grad-${i}`}
              id={gradId(i)}
              gradientUnits="userSpaceOnUse"
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
            >
              <stop offset="0%" stopColor={s.color0} />
              <stop offset="100%" stopColor={s.color1} />
            </linearGradient>
          ))}
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="black" />
            <polyline
              ref={polylineRef}
              points={allPointsAttr}
              stroke="white"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              fill="none"
            />
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          {segments.map((s, i) => (
            <polyline
              key={`seg-${i}`}
              points={s.pointsAttr}
              stroke={`url(#${gradId(i)})`}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>
      </svg>
      <Container>
        <ul ref={list1Ref} className={styles.list1}>
          {list1.map((service, i) => (
            <ServiceItem
              key={i}
              style={{
                "--color": gsap.utils.interpolate(textColors, service.trigger),
                "--colorStart": gsap.utils.interpolate(textColors, service.trigger - 0.05),
                "--colorEnd": gsap.utils.interpolate(textColors, service.trigger + 0.05),
              }}
              progress={timelineProgress}
              trigger={service.trigger}
              align="left"
              placeholder={service.placeholder}
              label={service.label}
              description={service.description}
            />
          ))}
        </ul>
        <ul ref={list2Ref} className={styles.list2}>
          {list2.map((service, i) => (
            <ServiceItem
              key={i}
              style={{
                "--color": gsap.utils.interpolate(textColors, service.trigger),
                "--colorStart": gsap.utils.interpolate(textColors, service.trigger - 0.05),
                "--colorEnd": gsap.utils.interpolate(textColors, service.trigger + 0.05),
              }}
              progress={timelineProgress}
              trigger={service.trigger}
              align="right"
              placeholder={service.placeholder}
              label={service.label}
              description={service.description}
            />
          ))}
        </ul>
      </Container>
    </section>
  )
}
