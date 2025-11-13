import PageHeader from "@/components/PageHeader"
import MaskHeading from "@/components/MaskHeading"

export default function News() {
  return (
    <main className="pb-(--spacing-xxl)">
      <PageHeader>
        <h1>
          <MaskHeading>Latest Updates</MaskHeading>
        </h1>
      </PageHeader>
    </main>
  )
}
