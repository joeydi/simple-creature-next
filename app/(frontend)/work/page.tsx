import { Metadata } from "next"
import PageHeader from "@/components/PageHeader"
import { getProjects } from "@/(admin)/admin/projects/actions"
import ScrambleText from "@/components/ScrambleText"
import Main from "@/components/main"
import WorkPageContent from "./WorkPageContent"
import { getCategoriesWithCounts } from "./actions"

export const metadata: Metadata = {
  title: "Work",
  description:
    "From interactive websites and branded experiences to visual effects, UI design, and animation, we focus on crafting work that feels polished, responsive, and full of personality.",
  openGraph: {
    url: "/work",
  },
}

export default async function Work({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>
}) {
  const [{ projects }, categories] = await Promise.all([getProjects(1, 100), getCategoriesWithCounts()])

  const { category } = await searchParams
  const categorySlug = Array.isArray(category) ? category[0] : category
  const initialCategoryId = categories.find((c) => c.slug === categorySlug)?.id ?? null

  return (
    <Main className="pb-(--spacing-xl)">
      <PageHeader crumbs={[]}>
        <h1 className="text-header">
          <ScrambleText reset={true}>Design + Technology</ScrambleText>
        </h1>
      </PageHeader>
      <div className="overflow-hidden">
        <WorkPageContent projects={projects} categories={categories} initialCategoryId={initialCategoryId} />
      </div>
    </Main>
  )
}
