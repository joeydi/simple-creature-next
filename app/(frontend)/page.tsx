import PageHeader from "@/components/PageHeader"
import Hero from "@/components/Hero"
import ScrambleText from "@/components/ScrambleText"
import FeaturedProjects from "@/components/FeaturedProjects"
import ServicesMarquee from "@/components/ServicesMarquee"
import { LogoGrid } from "@/components/LogoGrid"
import Main from "@/components/main"
import HomepageReels from "@/components/HomepageReels"

export default function Home() {
  return (
    <Main>
      <PageHeader>
        <h1 className="text-header">
          <ScrambleText reset={true}>intelligence, not artificial</ScrambleText>
        </h1>
      </PageHeader>
      <Hero />
      <HomepageReels />
      <FeaturedProjects />
      <ServicesMarquee />
      <LogoGrid />
    </Main>
  )
}
