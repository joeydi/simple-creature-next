import PageHeader from "@/components/PageHeader"
import Hero from "@/components/Hero"
import ScrambleText from "@/components/ScrambleText"
import FeaturedProjects from "@/components/FeaturedProjects"
import ServicesMarquee from "@/components/ServicesMarquee"
import { LogoGrid } from "@/components/LogoGrid"
import Main from "@/components/main"
import HomepageReels from "@/components/HomepageReels"

const projects = [
  "ilEgu2ukNZTOkVgibQh0Y", // OLG Level Up
  "QT9t3lA-tWlN8HJRsU72i", // Rowland
  "vBW5WPYvgLVI7u9ojrOon", // Zeiss Neuro
  "1C803Vt_ZyrjBSd9_Ye5b", // Mamava
]

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
      <FeaturedProjects ids={projects} />
      <ServicesMarquee />
      <LogoGrid />
    </Main>
  )
}
