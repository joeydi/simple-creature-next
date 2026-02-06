"use client"

import { useState, useMemo, useCallback, useRef, useEffect, useLayoutEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Container from "@/components/Container"
import Row from "@/components/Row"
import Column from "@/components/Column"
import ProjectCard from "@/components/ProjectCard"
import CategoryFilter from "@/components/CategoryFilter"
import { Project } from "@/(admin)/admin/projects/types"
import { CategoryWithCount } from "./actions"

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.addEventListener("refresh", () => {
  console.log("refresh")
})

interface Props {
  projects: Project[]
  categories: CategoryWithCount[]
}

export default function WorkPageContent({ projects, categories }: Props) {
  const projectsRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

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
        duration: 0.25,
      })
      .add(() => setActiveCategory(categoryId))
  }, [])

  return (
    <Container>
      <Row className="mb-(--spacing-lg)">
        <Column sm="6">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Column>
        <Column sm="6">
          <p className="max-w-2xl text-balance">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus
            vel facilisis.
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
