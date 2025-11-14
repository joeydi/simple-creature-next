import PageHeader from "@/components/PageHeader"
import Container from "@/components/Container"
import Row from "@/components/Row"
import Column from "@/components/Column"
import ProjectCard from "@/components/ProjectCard"
import { getProjects } from "@/(admin)/admin/projects/actions"
import ScrambleText from "@/components/ScrambleText"
import Main from "@/components/main"

export default async function Work() {
  const { projects } = await getProjects(1, 20)

  return (
    <Main className="pb-(--spacing-xxl)">
      <PageHeader>
        <h1 className="text-header">
          <ScrambleText duration={0.5}>Design + Technology</ScrambleText>
        </h1>
      </PageHeader>
      <div className="overflow-hidden">
        <Container>
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
    </Main>
  )
}
