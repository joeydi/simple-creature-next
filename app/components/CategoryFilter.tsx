"use client"

import { useCallback, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./CategoryFilter.module.scss"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface Category {
  id: string
  name: string
  slug: string
  projectCount: number
}

type Props = {
  categories: Category[]
} & (
  | {
      linkTo: string
      activeCategory?: never
      onCategoryChange?: never
    }
  | {
      linkTo?: undefined
      activeCategory: string | null
      onCategoryChange: (categoryId: string | null) => void
    }
)

export default function CategoryFilter({ categories, activeCategory, onCategoryChange, linkTo }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return
      const items = containerRef.current.querySelectorAll(`.${styles.filterItem}`)
      gsap.fromTo(
        items,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          delay: 0.25,
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
    { scope: containerRef, dependencies: [categories] },
  )

  const handleClick = useCallback(
    (categoryId: string) => {
      if (!onCategoryChange) return
      const newValue = activeCategory === categoryId ? null : categoryId
      onCategoryChange(newValue)
    },
    [activeCategory, onCategoryChange],
  )

  const renderCount = (isActive: boolean, count: number) => (
    <span className={styles.count}>
      <span>(</span>
      <span
        className={cn("scale-160 duration-250 font-light transition-all", isActive ? "" : "scale-80 opacity-0 blur-sm")}
      >
        &times;
      </span>
      <span className={cn("duration-250 transition-all", isActive ? "scale-50 opacity-0 blur-sm" : "")}>{count}</span>
      <span>)</span>
    </span>
  )

  return (
    <div ref={containerRef} className={styles.filterContainer}>
      {categories.map((category) => {
        const isActive = !linkTo && activeCategory === category.id
        if (linkTo) {
          return (
            <Link
              key={category.id}
              href={`${linkTo}?category=${category.slug}`}
              className={cn(styles.filterItem, isActive && styles.filterItemActive)}
            >
              {category.name}
              {renderCount(isActive, category.projectCount)}
            </Link>
          )
        }
        return (
          <button
            key={category.id}
            className={cn(styles.filterItem, isActive && styles.filterItemActive)}
            onClick={() => handleClick(category.id)}
          >
            {category.name}
            {renderCount(isActive, category.projectCount)}
          </button>
        )
      })}
    </div>
  )
}
