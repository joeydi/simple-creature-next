"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface Props {
  tags: Array<[string, string]>
  liveUrl?: string | null
}

export default function ProjectTags({ tags, liveUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return
      const items = containerRef.current.querySelectorAll("[data-tag], [data-live]")
      gsap.fromTo(
        items,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          delay: 0.5,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            toggleActions: "play resume resume reset",
          },
        },
      )
    },
    { scope: containerRef, dependencies: [tags] },
  )

  return (
    <div ref={containerRef} className="flex flex-col gap-4 leading-tight">
      {tags.map((tag, index) => (
        <div key={index} data-tag className="opacity-0">
          <p className="mb-0 font-[450] text-gray-400">{tag[0]}</p>
          <p className="text-balance">{tag[1]}</p>
        </div>
      ))}
      {liveUrl && (
        <a
          data-live
          className="group inline-flex items-center gap-2 opacity-0"
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="font-[450] text-gray-400">View Live</span>
          <svg
            className="transition group-hover:translate-x-2"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M16.15 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.15L13.3 8.15q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L19.3 11.3q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.575 4.575q-.3.3-.712.288t-.713-.313q-.275-.3-.288-.7t.288-.7z"
            />
          </svg>
        </a>
      )}
    </div>
  )
}
