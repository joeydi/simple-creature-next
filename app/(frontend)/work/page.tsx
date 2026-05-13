import { Suspense } from "react"
import PageHeader from "@/components/PageHeader"
import { getProjects } from "@/(admin)/admin/projects/actions"
import ScrambleText from "@/components/ScrambleText"
import Main from "@/components/main"
import WorkPageContent from "./WorkPageContent"
import { getCategoriesWithCounts } from "./actions"

export default async function Work() {
  const [{ projects }, categories] = await Promise.all([getProjects(1, 100), getCategoriesWithCounts()])

  return (
    <Main className="pb-(--spacing-sm)">
      <PageHeader crumbs={[]}>
        <h1 className="text-header">
          <ScrambleText reset={true}>Design + Technology</ScrambleText>
        </h1>
      </PageHeader>
      <div className="overflow-hidden">
        <Suspense fallback={null}>
          <WorkPageContent projects={projects} categories={categories} />
        </Suspense>
      </div>
    </Main>
  )
}
