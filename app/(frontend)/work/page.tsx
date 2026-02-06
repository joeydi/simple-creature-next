import PageHeader from "@/components/PageHeader"
import { getProjects } from "@/(admin)/admin/projects/actions"
import ScrambleText from "@/components/ScrambleText"
import Main from "@/components/main"
import WorkPageContent from "./WorkPageContent"
import { getCategoriesWithCounts } from "./actions"

export default async function Work() {
  const [{ projects }, categories] = await Promise.all([getProjects(1, 100), getCategoriesWithCounts()])

  return (
    <Main className="pb-(--spacing-xxl)">
      <PageHeader>
        <h1 className="text-header">
          <ScrambleText duration={0.5}>Design + Technology</ScrambleText>
        </h1>
      </PageHeader>
      <div className="overflow-hidden">
        <WorkPageContent projects={projects} categories={categories} />
      </div>
    </Main>
  )
}
