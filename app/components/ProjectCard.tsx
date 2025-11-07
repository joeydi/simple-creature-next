"use client"

import { ReactNode, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./ProjectCard.module.scss"
import ScrambleText from "@/components/ScrambleText"
import MaskHeading from "@/components/MaskHeading"
import Link from "next/link"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface Props {
  className?: string
  align?: string
  slug: string
  image: ReactNode
  title: string
  description: string
}

const ProjectCard = ({ className = "", align = "left", slug, image, title, description }: Props) => {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useGSAP(() => {
    gsap.set(layerRef.current, {
      opacity: 1,
      z: "15vw",
      rotationX: 36,
    })

    gsap.set(imageRef.current, {
      scale: 1.5,
      filter: "blur(8px)",
    })

    const timeline = gsap.timeline({
      scrollTrigger: {
        scrub: true,
        trigger: cardRef.current,
        // toggleActions: "play resume resume reset",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          gsap.to(imageRef.current, {
            scale: 1,
            filter: "blur(0px)",
            ease: "expo.out",
            duration: 1.5,
          })
        },
        onEnterBack: () => {
          gsap.to(imageRef.current, {
            scale: 1,
            filter: "blur(0px)",
            ease: "expo.out",
            duration: 1.5,
          })
        },
        onLeave: () => {
          gsap.to(imageRef.current, {
            scale: 1.5,
            filter: "blur(8px)",
            ease: "expo.out",
            duration: 1.5,
          })
        },
        onLeaveBack: () => {
          gsap.to(imageRef.current, {
            scale: 1.5,
            filter: "blur(8px)",
            ease: "expo.out",
            duration: 1.5,
          })
        },
      },
    })

    timeline.to(
      layerRef.current,
      {
        z: "0vw",
        rotationX: 0,
        duration: 1,
        ease: "circ.out",
      },
      0,
    )

    timeline.to(
      layerRef.current,
      {
        z: "15vw",
        rotationX: -36,
        duration: 1,
        ease: "circ.in",
      },
      1,
    )
  })

  return (
    <Link ref={cardRef} href={`/work/${slug}`} className={`${styles.card} ${styles[align]} ${className}`}>
      <div ref={layerRef} className="layer">
        <div className={styles.mask}>
          <div ref={imageRef} className={styles.image}>
            {image}
          </div>
        </div>
        <div className={styles.content}>
          <h2>
            <MaskHeading delay={0.125} reset={true}>
              {title}
            </MaskHeading>
          </h2>
          <p>
            <ScrambleText duration={0.5} delay={0.5} reset={true}>
              {description}
            </ScrambleText>
          </p>
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard
