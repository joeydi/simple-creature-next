"use client"

import { useRef, useState, useEffect } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Container from "./Container"
import MaskHeading from "./MaskHeading"
import { getRandom, getRandomInt } from "@/lib/utils"

import astonMartin from "@/images/logos/aston-martin.svg"
import arizonaStateUninversity from "@/images/logos/arizona-state-uninversity.svg"
import capitalOne from "@/images/logos/capital-one.svg"
import dell from "@/images/logos/dell.svg"
import fantasy from "@/images/logos/fantasy.svg"
import ford from "@/images/logos/ford.svg"
import generalMills from "@/images/logos/general-mills.svg"
import huge from "@/images/logos/huge.svg"
import keurig from "@/images/logos/keurig.svg"
import lincoln from "@/images/logos/lincoln.svg"
import mamava from "@/images/logos/mamava.svg"
import meta from "@/images/logos/meta.svg"
import nickelodeon from "@/images/logos/nickelodeon.svg"
import nissan from "@/images/logos/nissan.svg"
import nokianTyres from "@/images/logos/nokian-tyres.svg"
import olg from "@/images/logos/olg.svg"
import onePercent from "@/images/logos/one-percent.svg"
import popularScience from "@/images/logos/popular-science.svg"
import principal from "@/images/logos/principal.svg"
import ramble from "@/images/logos/ramble.svg"
import razorfish from "@/images/logos/razorfish.svg"
import sandwich from "@/images/logos/sandwich.svg"
import zeiss from "@/images/logos/zeiss.svg"
import Image from "next/image"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const logos = [
  astonMartin,
  arizonaStateUninversity,
  capitalOne,
  dell,
  fantasy,
  ford,
  generalMills,
  huge,
  keurig,
  lincoln,
  mamava,
  meta,
  nickelodeon,
  nissan,
  nokianTyres,
  olg,
  onePercent,
  popularScience,
  principal,
  ramble,
  razorfish,
  sandwich,
  zeiss,
]

export const LogoGrid = () => {
  const [randomLogos, setRandomLogos] = useState(logos)

  const columns = 6
  const rows = 12

  const maskRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Shuffle logos only on the client to avoid hydration mismatch
  useEffect(() => {
    setRandomLogos([...logos].sort(() => 0.5 - Math.random()))
  }, [])

  useGSAP(() => {
    const grid = gridRef.current
    const logos = maskRef?.current?.querySelectorAll(".logo")
    const stars = maskRef?.current?.querySelectorAll(".star")

    if (!grid || !logos || !stars) {
      return
    }

    // Batch all reads first to avoid forced reflows
    const gridWidth = grid.clientWidth
    const gridHeight = grid.clientWidth
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Pre-calculate all logo positions
    const logoPositions = Array.from(logos).map((logo, i) => {
      const column = i % columns
      const row = Math.floor(i / columns)

      return {
        x: column * (gridWidth / columns) + (row % 2) * (gridWidth / columns / 2),
        y: row * (gridHeight / rows),
        z: getRandom(-viewportWidth / 2, viewportWidth / 4),
      }
    })

    const sizeValues = Array.from(stars).map(() => {
      return getRandomInt(5, 20)
    })

    // Then batch all writes
    logos.forEach((logo, i) => {
      gsap.set(logo, logoPositions[i])
    })

    gsap.set(stars, {
      x: () => getRandomInt(viewportWidth * -1, viewportWidth * 3),
      y: () => getRandomInt(viewportHeight * -1, viewportHeight * 2.5),
      z: () => getRandom(-viewportWidth * 10, -viewportWidth),
      width: (i) => sizeValues[i],
      height: (i) => sizeValues[i],
    })

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: maskRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })

    timeline.fromTo(
      gridRef.current,
      {
        xPercent: 0,
        yPercent: 0,
      },
      {
        xPercent: -50,
        yPercent: -50,
        duration: 1,
        ease: "none",
      },
    )
  })

  return (
    <section className="relative">
      <div ref={maskRef} className="perspective-[100vw] relative aspect-video w-full overflow-hidden bg-black">
        <div className="bg-linear-[to_bottom,rgba(0,0,0,1),transparent_300px,transparent_calc(100%-100px),rgba(0,0,0,0.5)] z-1 absolute inset-0"></div>
        <div ref={gridRef} className="transform-3d relative size-[200%]">
          {Array(columns * rows)
            .fill(0)
            .map((_, i) => {
              const logo = randomLogos[i % randomLogos.length]

              return (
                <div
                  key={`div-${i}`}
                  className="logo translate-[-50%,-50%] before:filter-[blur(20px)] absolute rounded-xl p-4 before:absolute before:inset-0 before:bg-black"
                >
                  <Image className="aspect-2 relative w-[10vw]" src={logo} alt="" />
                </div>
              )
            })}
          {Array(100)
            .fill(0)
            .map((_, i) => {
              return <div key={`star-${i}`} className="star absolute left-0 top-0 rounded-full bg-white"></div>
            })}
        </div>
      </div>
    </section>
  )
}
