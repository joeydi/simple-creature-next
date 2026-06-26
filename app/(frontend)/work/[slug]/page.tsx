import { Metadata } from "next"
import PageHeader from "@/components/PageHeader"
import Container from "@/components/Container"
import { getProjectBySlug, getProjects } from "@/(admin)/admin/projects/actions"
import { ContentWithMedia } from "@/components/content-with-media"
import { FullWidthMedia } from "@/components/full-width-media"
import { FullWidthContent } from "@/components/full-width-content"
import { MediaGrid } from "@/components/media-grid"
import Row from "@/components/Row"
import Column from "@/components/Column"
import { ProjectContent } from "@/lib/schemas/project-content"
import Main from "@/components/main"
import ScrambleText from "@/components/ScrambleText"
import ProjectTags from "@/components/ProjectTags"
import FadeIn from "@/components/FadeIn"

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const project = await getProjectBySlug(slug)

  if (!project) return {}

  return {
    title: project.title,
    description: project.longDescription,
    openGraph: {
      url: `/work/${slug}`,
    },
  }
}

const blockMap = {
  "full-width-media": FullWidthMedia,
  "full-width-content": FullWidthContent,
  "content-with-media": ContentWithMedia,
  "media-grid": MediaGrid,
}

export default async function Project(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params
  const project = await getProjectBySlug(slug)

  if (!project) return null

  const projectContent = project.content as ProjectContent | null
  const projectTags = project.tags as Array<[string, string]> | null

  return (
    <Main className="pb-(--spacing-sm)">
      <PageHeader crumbs={[{ href: "/work", label: "Work" }]}>
        <h1 className="text-header">
          <ScrambleText reset={true}>{project.title}</ScrambleText>
        </h1>
      </PageHeader>
      <Container className="my-(--spacing-xxl)">
        <Row className="justify-between">
          <Column md={8} lg={7} xl={8} className="pl-(--spacing-xxs)">
            <FadeIn delay={0.25}>
              <h2>{project.longDescription}</h2>
            </FadeIn>
          </Column>
          <Column md={4} xl={3} className="pl-(--spacing-xxs) md:pl-0">
            <ProjectTags tags={projectTags ?? []} liveUrl={project.url} />
          </Column>
        </Row>
      </Container>
      {projectContent?.blocks.map((block) => {
        const Component = blockMap[block.type as keyof typeof blockMap]
        return <Component key={block.id} block={block as any} />
      })}
    </Main>
  )
}

export async function generateStaticParams() {
  const { projects } = await getProjects(1, 100)
  return projects.map((project) => ({ slug: project.slug }))
}
