import Container from "@/components/Container"
import SplitHeading from "@/components/SplitHeading"
import ProjectCard from "@/components/ProjectCard"
import Row from "./Row"
import Column from "./Column"
import { getProjects } from "@/(admin)/admin/projects/actions"

const FeaturedProjects = async () => {
  const { projects } = await getProjects(1, 4)

  return (
    <section className="my-(--spacing-xl) perspective-[100vw] overflow-hidden">
      <Container>
        <h1 className="my-(--spacing-lg) w-[60%] min-w-fit">
          <SplitHeading>
            Featured <br /> Projects
          </SplitHeading>
        </h1>
        <Row>
          {projects.map((project, i) => {
            return (
              <Column sm="6" key={`column-${i}`}>
                <ProjectCard project={project} align={i % 2 ? "right" : "left"} />
              </Column>
            )
          })}
        </Row>
      </Container>
    </section>
  )
}

export default FeaturedProjects
