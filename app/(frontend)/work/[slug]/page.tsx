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

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const project = await getProjectBySlug(slug)

  if (!project) return {}

  return {
    title: project.title,
    description: project.longDescription,
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
          <Column md={8} lg={7} xl={8} className="px-(--spacing-xs)">
            <h2>{project.longDescription}</h2>
          </Column>
          <Column md={4} xl={3}>
            <div className="flex flex-col gap-4 leading-tight">
              {projectTags?.map((tag, index) => (
                <div key={index}>
                  <p className="mb-0 font-[450] text-gray-400">{tag[0]}</p>
                  <p className="text-balance">{tag[1]}</p>
                </div>
              ))}
              {project.url && (
                <a
                  className="group inline-flex items-center gap-2"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="font-[450] text-gray-400">View Live</span>
                  <svg
                    className="transition group-hover:translate-x-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M16.15 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.15L13.3 8.15q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L19.3 11.3q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.575 4.575q-.3.3-.712.288t-.713-.313q-.275-.3-.288-.7t.288-.7z"
                    />
                  </svg>
                </a>
              )}
            </div>
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
