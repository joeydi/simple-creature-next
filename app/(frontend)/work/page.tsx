import PageHeader from "@/components/PageHeader"
import MaskHeading from "@/components/MaskHeading"
import Container from "@/components/Container"
import Row from "@/components/Row"
import Column from "@/components/Column"
import ProjectCard from "@/components/ProjectCard"
import { getProjects } from "@/(admin)/admin/projects/actions"

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
        <Container className="mb-(--spacing-xxl)">
          <Row>
            {projects.map((project, i) => {
              return (
                <Column sm="6" key={`column-${i}`}>
                  <ProjectCard align={i % 2 ? "right" : "left"} project={project} />
                </Column>
              )
            })}
          </Row>
        </Container>
      </div>
    </>
  )
}
