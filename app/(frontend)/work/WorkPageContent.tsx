"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Container from "@/components/Container"
import Row from "@/components/Row"
import Column from "@/components/Column"
import ProjectCard from "@/components/ProjectCard"
import CategoryFilter from "@/components/CategoryFilter"
import { Project } from "@/(admin)/admin/projects/types"
import { CategoryWithCount } from "./actions"
import ScrambleText from "@/components/ScrambleText"

gsap.registerPlugin(ScrollTrigger)

interface Props {
  projects: Project[]
  categories: CategoryWithCount[]
}

export default function WorkPageContent({ projects, categories }: Props) {
  const projectsRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const initialCategorySlug = searchParams.get("category")
  const initialCategoryId = useMemo(
    () => categories.find((c) => c.slug === initialCategorySlug)?.id ?? null,
    [categories, initialCategorySlug],
  )
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategoryId)

  const filteredProjects = useMemo(() => {
    if (activeCategory === null) {
      return projects
    }
    return projects.filter((project) => project.categories?.some((cat) => cat.id === activeCategory))
  }, [projects, activeCategory])

  useEffect(() => {
    gsap.to(projectsRef.current, {
      opacity: 1,
      duration: 0.25,
    })
  }, [filteredProjects])

  const handleCategoryChange = useCallback((categoryId: string | null) => {
    gsap
      .timeline()
      .to(projectsRef.current, {
        opacity: 0,
        duration: 0.125,
      })
      .add(() => setActiveCategory(categoryId))
  }, [])

  return (
    <Container>
      <Row className="mb-(--spacing-lg)">
        <Column sm="6" className="pl-(--spacing-xxs)">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Column>
        <Column sm="6" className="pl-(--spacing-xxs) sm:pl-0">
          <p className="max-w-2xl text-balance">
            <ScrambleText delay={0.5}>
              We create immersive digital experiences where design, motion, and technology work together as one system.
            </ScrambleText>
          </p>
          <p className="max-w-2xl text-balance">
            <ScrambleText delay={0.5}>
              From interactive websites and branded experiences to visual effects, UI design, and animation, we focus on
              crafting work that feels polished, responsive, and full of personality.
            </ScrambleText>
          </p>
        </Column>
      </Row>
      <Row ref={projectsRef} key={activeCategory ?? "all"} style={{ opacity: 0 }}>
        {filteredProjects.map((project, i) => (
          <Column sm="6" key={`${project.id}`}>
            <ProjectCard align={i % 2 ? "right" : "left"} project={project} />
          </Column>
        ))}
      </Row>
    </Container>
  )
}
