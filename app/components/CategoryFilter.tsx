"use client"

import { useCallback } from "react"
import styles from "./CategoryFilter.module.scss"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
  projectCount: number
}

interface Props {
  categories: Category[]
  activeCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }: Props) {
  const handleClick = useCallback(
    (categoryId: string) => {
      const newValue = activeCategory === categoryId ? null : categoryId
      onCategoryChange(newValue)
    },
    [activeCategory, onCategoryChange],
  )

  return (
    <div className={styles.filterContainer}>
      {categories.map((category) => (
        <button
          key={category.id}
          className={cn(styles.filterItem, activeCategory === category.id && styles.filterItemActive)}
          onClick={() => handleClick(category.id)}
        >
          {category.name}
          {activeCategory === category.id ? (
            <span className={styles.count}>(&times;)</span>
          ) : (
            <span className={styles.count}>({category.projectCount})</span>
          )}
        </button>
      ))}
    </div>
  )
}
