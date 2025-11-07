"use client"

import { ReactNode, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ScrambleText from "@/components/ScrambleText"
import MaskHeading from "@/components/MaskHeading"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ProjectWithThumbnail } from "@/(admin)/admin/projects/types"
import Image from "next/image"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface Props {
  project: ProjectWithThumbnail
  align?: "left" | "right"
  className?: string
}

const ProjectCard = ({ project, className = "", align = "left" }: Props) => {
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
    <Link
      ref={cardRef}
      href={`/work/${project.slug}`}
      className={cn(
        "perspective-[100vw] text-decoration-none block text-inherit",
        align === "left" ? "md:perspective-origin-right" : "md:perspective-origin-left",
        className,
      )}
    >
      <div ref={layerRef} className="layer">
        <div className="z-1 rounded-(--media-radius) relative overflow-hidden">
          <div ref={imageRef} className="aspect-video">
            <Image fill src={project.thumbnailUrl || ""} alt={project.thumbnailAlt || ""} />
          </div>
        </div>
        <div className="m-4">
          <h2>
            <MaskHeading delay={0.125} reset={true}>
              {project.title}
            </MaskHeading>
          </h2>
          <p>
            <ScrambleText duration={0.5} delay={0.5} reset={true}>
              {project.shortDescription}
            </ScrambleText>
          </p>
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard
