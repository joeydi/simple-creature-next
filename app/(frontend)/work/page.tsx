import PageHeader from "@/components/PageHeader"
import MaskHeading from "@/components/MaskHeading"
import Container from "@/components/Container"
import Row from "@/components/Row"
import Column from "@/components/Column"
import ProjectCard from "@/components/ProjectCard"
import { getProjects } from "@/(admin)/admin/projects/actions"
import Image from "next/image"

export default async function Work() {
  const { projects } = await getProjects(1, 20)

  return (
    <>
      <PageHeader>
        <h1>
          <MaskHeading>Our Work</MaskHeading>
        </h1>
      </PageHeader>
      <div className="overflow-hidden">
        <Container className="section-margin-bottom">
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
      </div>
    </>
  )
}
