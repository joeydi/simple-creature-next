import PageHeader from "@/components/PageHeader"
import MaskHeading from "@/components/MaskHeading"
import Main from "@/components/main"

export default function Contact() {
  return (
    <Main className="pb-(--spacing-sm)">
      <PageHeader crumbs={[]}>
        <h1>
          <MaskHeading>Contact Us</MaskHeading>
        </h1>
      </PageHeader>
    </Main>
  )
}
