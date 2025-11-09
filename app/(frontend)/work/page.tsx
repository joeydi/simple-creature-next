import PageHeader from "@/components/PageHeader"
import MaskHeading from "@/components/MaskHeading"
import Container from "@/components/Container"
import Row from "@/components/Row"
import Column from "@/components/Column"
import ProjectCard from "@/components/ProjectCard"
import { getProjects } from "@/(admin)/admin/projects/actions"
import ScrambleText from "@/components/ScrambleText"

export default async function Work() {
  const { projects } = await getProjects(1, 20)

  return (
    <>
      <PageHeader>
        <h1 className="text-h2">
          <ScrambleText duration={0.5}>Design + Technology</ScrambleText>
        </h1>
      </PageHeader>
      <div className="overflow-hidden">
        <Container className="mb-(--spacing-xxl)">
          <Row>
            {projects.map((project, i) => {
              return (
                <Column sm="6" key={project.id}>
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
