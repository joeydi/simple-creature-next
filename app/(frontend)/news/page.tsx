import PageHeader from "@/components/PageHeader"
import MaskHeading from "@/components/MaskHeading"
import Main from "@/components/main"

export default function News() {
  return (
    <Main className="pb-(--spacing-xxl)">
      <PageHeader>
        <h1>
          <MaskHeading>Latest Updates</MaskHeading>
        </h1>
      </PageHeader>
    </Main>
  )
}
