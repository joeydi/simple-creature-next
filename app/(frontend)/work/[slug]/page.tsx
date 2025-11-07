import PageHeader from "@/components/PageHeader"
import MaskHeading from "@/components/MaskHeading"
import Container from "@/components/Container"
import { getProjectBySlug, getProjects } from "@/(admin)/admin/projects/actions"
import { ContentWithMedia } from "@/components/content-with-media"
import { FullWidthMedia } from "@/components/full-width-media"
import { FullWidthContent } from "@/components/full-width-content"
import Row from "@/components/Row"
import Column from "@/components/Column"
import { ProjectContent } from "@/lib/schemas/project-content"

const blockMap = {
  "full-width-media": FullWidthMedia,
  "full-width-content": FullWidthContent,
  "content-with-media": ContentWithMedia,
}

export default async function Project(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params
  const project = await getProjectBySlug(slug)

  if (!project) return null

  const projectContent = project.content as ProjectContent | null
  const projectTags = project.tags as Array<[string, string]> | null

  return (
    <>
      <PageHeader>
        <h1 className="text-h2">
          <MaskHeading>{project.title}</MaskHeading>
        </h1>
      </PageHeader>
      <Container className="my-(--spacing-xxl)">
        <Row className="justify-between">
          <Column lg={7} className="px-4">
            <h2>{project.longDescription}</h2>
          </Column>
          <Column lg={4}>
            <div className="flex flex-col gap-4 leading-tight">
              {projectTags?.map((tag, index) => (
                <div key={index}>
                  <p className="text-gray-400">{tag[0]}</p>
                  <p>{tag[1]}</p>
                </div>
              ))}
            </div>
          </Column>
        </Row>
      </Container>
      {projectContent?.blocks.map((block) => {
        const Component = blockMap[block.type as keyof typeof blockMap]
        return <Component key={block.id} block={block as any} />
      })}
      {/* <Container className="my-(--spacing-xxl) gap-(--spacing-lg) flex flex-col">
      </Container> */}
    </>
  )
}

// This stays the same
export async function generateStaticParams() {
  const { projects } = await getProjects(1, 100)
  return projects.map((project) => ({ slug: project.slug }))
}
