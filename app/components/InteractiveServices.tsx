"use client"

import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./InteractiveServices.module.scss"
import Container from "./Container"
import { useEffect, useMemo, useRef, useState } from "react"
import { BSpline } from "@/lib/BSpline"
import { ServiceItem } from "./ServiceItem"

gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger)

const NUM_SEGMENTS = 12
const STROKE_WIDTH = 48
const GRADIENT_COLORS = ["#000000", "#1A3EBF", "#B6FD6E", "#FFFFFF", "#1A3EBF", "#F43791", "#000000"]
const TEXT_COLORS = ["#FFFFFF", "#1A3EBF", "#B6FD6E", "#FFFFFF", "#1A3EBF", "#F43791", "#FFFFFF"]

const list1 = [
  {
    label: "Monthly Maintenance",
    description:
      "Website maintenance focused on security, performance, updates, backups, and ongoing support to keep your site stable, fast, and running smoothly.",
    trigger: 0.1,
  },
  {
    label: "Front End Design",
    description:
      "Thoughtfully designed, responsive interfaces that balance visual clarity, usability, and performance across every screen size.",
    trigger: 0.16,
  },
  {
    label: "Interactive Animation",
    description:
      "Custom motion and interactive experiences that bring digital products to life through purposeful, engaging animation.",
    trigger: 0.21,
  },
  {
    label: "Content Management",
    description:
      "Flexible content management systems that make it easy for teams to update, organize, and scale website content.",
    trigger: 0.26,
  },
  {
    label: "App Development",
    description:
      "Custom web applications built for speed, reliability, and seamless user experiences across modern devices and platforms.",
    trigger: 0.31,
  },
  {
    label: "Back End Integrations",
    description:
      "Reliable integrations connecting websites and applications with third-party platforms, APIs, databases, and business systems.",
    trigger: 0.37,
  },
]

const list2 = [
  {
    label: "Website Migrations",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
    trigger: 0.58,
  },
  {
    label: "Front End Design",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
    trigger: 0.62,
  },
  {
    label: "Creative Coding",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
    trigger: 0.69,
  },
  {
    label: "Back End Integrations",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
    trigger: 0.76,
  },
  {
    label: "Performance Analysis",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
    trigger: 0.82,
  },
]

export const InteractiveServices = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const polylineRef = useRef<SVGPolylineElement>(null)
  const list1Ref = useRef<HTMLUListElement>(null)
  const list2Ref = useRef<HTMLUListElement>(null)

  // const [referencePoints, setReferencePoints] = useState<number[][]>()
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
      points.unshift([-window.innerWidth / 4, (points[0][1] - list1Rect.height / 4) * scaleFactor])

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

      // setReferencePoints(points)
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
        color0: gsap.utils.interpolate(GRADIENT_COLORS, i / NUM_SEGMENTS - STROKE_WIDTH / 2 / totalLength),
        color1: gsap.utils.interpolate(GRADIENT_COLORS, (i + 1) / NUM_SEGMENTS),
      }
    })
  }, [splinePoints])

  useGSAP(() => {
    if (!splinePoints || !splinePoints.length || !polylineRef.current) {
      return
    }

    gsap.set(polylineRef.current, { drawSVG: "0% 0%" })

    gsap.to(polylineRef.current, {
      drawSVG: "0 100% live",
      ease: "none",
      scrollTrigger: {
        // markers: true,
        trigger: sectionRef.current,
        start: "top 90%",
        end: "bottom 75%",
        scrub: 1,
        onUpdate: (self) => {
          setTimelineProgress(self.progress)
        },
      },
    })
  }, [splinePoints])

  return (
    <section
      ref={sectionRef}
      className="relative mb-[25vw] bg-black text-white"
      onClick={() => {
        setReset(reset + 1)
      }}
    >
      <svg ref={svgRef} className={styles.svg} width="1000" height="1000" viewBox="0 0 1000 1000">
        <defs>
          {segments.map((s, i) => (
            <linearGradient
              key={`grad-${i}`}
              id={`grad-${i}`}
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
          <mask id="line-mask" maskUnits="userSpaceOnUse">
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
        <g mask="url(#line-mask)">
          {segments.map((s, i) => (
            <polyline
              key={`seg-${i}`}
              points={s.pointsAttr}
              stroke={`url(#grad-${i})`}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>
      </svg>
      <Container>
        <ul ref={list1Ref} className={styles.list1}>
          {list1.map((service) => (
            <ServiceItem
              key={service.label}
              style={{
                "--color": gsap.utils.interpolate(TEXT_COLORS, service.trigger),
                "--colorStart": gsap.utils.interpolate(TEXT_COLORS, service.trigger - 0.05),
                "--colorEnd": gsap.utils.interpolate(TEXT_COLORS, service.trigger + 0.05),
              }}
              progress={timelineProgress}
              trigger={service.trigger}
              align="left"
              label={service.label}
              description={service.description}
            />
          ))}
        </ul>
        <ul ref={list2Ref} className={styles.list2}>
          {list2.map((service) => (
            <ServiceItem
              key={service.label}
              style={{
                "--color": gsap.utils.interpolate(TEXT_COLORS, service.trigger),
                "--colorStart": gsap.utils.interpolate(TEXT_COLORS, service.trigger - 0.05),
                "--colorEnd": gsap.utils.interpolate(TEXT_COLORS, service.trigger + 0.05),
              }}
              progress={timelineProgress}
              trigger={service.trigger}
              align="right"
              label={service.label}
              description={service?.description}
            />
          ))}
        </ul>
      </Container>
    </section>
  )
}
