import PageHeader from "@/components/PageHeader";
import Hero from "@/components/Hero";
import ScrambleText from "@/components/ScrambleText";
import Reel from "@/components/Reel";
import FeaturedProjects from "@/components/FeaturedProjects";
import ServicesMarquee from "./components/ServicesMarquee";

export default function Home() {
  return (
    <>
      <PageHeader>
        <h1 className="h2">
          <ScrambleText duration={0.5}>intelligence, not artificial</ScrambleText>
        </h1>
      </PageHeader>
      <Hero />
      <Reel />
      <FeaturedProjects />
      <ServicesMarquee />
    </>
  );
}
