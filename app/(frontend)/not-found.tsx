import { Metadata } from "next"
import PageHeader from "@/components/PageHeader"
import ScrambleText from "@/components/ScrambleText"
import Container from "@/components/Container"
import AboutHero from "./about/about-hero"
import Main from "@/components/main"

export const metadata: Metadata = {
  title: "Simple Creature » Interactive Animation Studio",
  description: "Simple Creature is a fun-size digital design and interactive animation studio in Burlington, VT.",
}

export default async function NotFound() {
  return (
    <Main className="pb-(--spacing-sm)">
      <PageHeader crumbs={[]}>
        <h1 className="text-header">
          <ScrambleText reset={true}>page not found</ScrambleText>
        </h1>
      </PageHeader>

      <Container className="mb-(--spacing-xl) relative">
        <AboutHero />
      </Container>
    </Main>
  )
}
