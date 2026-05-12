"use client"

import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./InteractiveServices.module.scss"
import Container from "./Container"
import { useEffect, useRef, useState } from "react"
import { BSpline } from "@/lib/BSpline"
import { ProjectLifecycleItem } from "./ProjectLifecycleItem"

gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger)

const list1 = [
  {
    label: "Monthly Maintenance",
    trigger: 0.1,
  },
  {
    label: "Front End Design",
    trigger: 0.16,
  },
  {
    label: "Interactive Animation",
    trigger: 0.21,
  },
  {
    label: "Content Management",
    trigger: 0.26,
  },
  {
    label: "App Development",
    trigger: 0.31,
  },
  {
    label: "Integrations",
    trigger: 0.37,
  },
]

const list2 = [
  {
    label: "Website Migrations",
    trigger: 0.58,
  },
  {
    label: "Front End Design",
    trigger: 0.62,
  },
  {
    label: "Creative Coding",
    trigger: 0.69,
  },
  {
    label: "Back End Integrations",
    trigger: 0.76,
  },
  {
    label: "Performance Analysis",
    trigger: 0.82,
  },
]

export const InteractiveServices = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const polylineRef = useRef<SVGPolylineElement>(null)
  const list1Ref = useRef<HTMLUListElement>(null)
  const list2Ref = useRef<HTMLUListElement>(null)

  const [referencePoints, setReferencePoints] = useState<number[][]>()
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
      const list1Rect = list1Ref.current.getBoundingClientRect()
      const list2Rect = list2Ref.current.getBoundingClientRect()

      const points: number[][] = []

      list1Items?.forEach((item) => {
        const itemRect = item.getBoundingClientRect()
        points.push([itemRect.x - sectionRect.x, itemRect.y - sectionRect.y])
      })

      // Insert one point at the start to the top left of the first item
      points.unshift([-window.innerWidth / 4, points[0][1] - list1Rect.height / 4])

      // Insert one point after the first list to the right
      points.push([window.innerWidth * 1.25, sectionRect.height / 2])

      list2Items?.forEach((item) => {
        const itemRect = item.getBoundingClientRect()
        points.push([itemRect.x + itemRect.width - sectionRect.x, itemRect.y - sectionRect.y])
      })

      // Insert one point at the end to the bottom left of the last item
      points.push([-window.innerWidth / 4, sectionRect.height])

      const spline = new BSpline(points, 3, false)

      const tempPoints = []
      for (let t = 0; t <= 1; t += 0.001) {
        tempPoints.push(spline.calcAt(t))
      }

      setReferencePoints(points)
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

  useGSAP(() => {
    if (!splinePoints || !polylineRef.current) {
      return
    }

    gsap.set(polylineRef.current, {
      drawSVG: "0% 0%",
    })

    gsap.to(polylineRef.current, {
      drawSVG: "0 100% live",
      stroke: "#e5307c",
      ease: "none",
      scrollTrigger: {
        // markers: true,
        trigger: sectionRef.current,
        start: "top 75%",
        end: "bottom bottom",
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
      className="pb-(--spacing-xl) relative bg-black text-white"
      onClick={() => {
        setReset(reset + 1)
      }}
    >
      <svg ref={svgRef} className={styles.svg} width="1000" height="1000" viewBox="0 0 1000 1000">
        {/* {referencePoints?.map((point, i) => {
          return <circle key={`circle-${i}`} r={8} cx={point[0]} cy={point[1]} fill="red" />
        })} */}
        <polyline
          ref={polylineRef}
          points={splinePoints
            ?.map(([x, y]) => {
              return `${x},${y}`
            })
            .join(" ")}
          stroke="#0f6cc6"
          strokeWidth={40}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <Container>
        <ul ref={list1Ref} className={styles.list1}>
          {list1.map((service) => (
            <ProjectLifecycleItem
              key={service.label}
              progress={timelineProgress}
              trigger={service.trigger}
              align="left"
            >
              {service.label}
            </ProjectLifecycleItem>
          ))}
        </ul>
        <ul ref={list2Ref} className={styles.list2}>
          {list2.map((service) => (
            <ProjectLifecycleItem
              key={service.label}
              progress={timelineProgress}
              trigger={service.trigger}
              align="right"
            >
              {service.label}
            </ProjectLifecycleItem>
          ))}
        </ul>
      </Container>
    </section>
  )
}
