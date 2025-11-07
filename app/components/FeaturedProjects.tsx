import styles from "./FeaturedProjects.module.scss"
import Container from "@/components/Container"
import SplitHeading from "@/components/SplitHeading"
import ProjectCard from "@/components/ProjectCard"
import Row from "./Row"
import Column from "./Column"
import { getProjects } from "@/(admin)/admin/projects/actions"
import Image from "next/image"

const FeaturedProjects = async () => {
  const { projects } = await getProjects(1, 4)

  return (
    <section className={styles.section}>
      <Container>
        <h1 className={styles.heading}>
          <SplitHeading>
            Featured <br /> Projects
          </SplitHeading>
        </h1>
        <Row>
          {projects.map((project, i) => {
            const image = <Image fill src={project.thumbnailUrl || ""} alt={project.thumbnailAlt || ""} />

            return (
              <Column sm="6" key={`column-${i}`}>
                <ProjectCard
                  align={i % 2 ? "right" : "left"}
                  slug={project.slug}
                  image={image}
                  title={project.title}
                  description={project.shortDescription}
                />
              </Column>
            )
          })}
        </Row>
      </Container>
    </section>
  )
}

export default FeaturedProjects
