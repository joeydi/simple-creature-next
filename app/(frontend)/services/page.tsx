import { Metadata } from "next"
import Column from "@/components/Column"
import Container from "@/components/Container"
import FeaturedProjects from "@/components/FeaturedProjects"
import Main from "@/components/main"
import MaskHeading from "@/components/MaskHeading"
import PageHeader from "@/components/PageHeader"
import Row from "@/components/Row"
import ScrambleText from "@/components/ScrambleText"
import SplitHeading from "@/components/SplitHeading"
import InteractiveServices from "./InteractiveServices"
import MotionServices from "./MotionServices"

export const metadata: Metadata = {
  title: "Services",
  description: "Simple Creature is a fun-size digital design and interactive animation studio in Burlington, VT.",
}

const interactiveProjects = [
  "151Jwyic0i7-A3EIfWpI9", // FLW Members
  "KdG-W6MYDdcoc26Mon67v", // Progress Meter
  "QT9t3lA-tWlN8HJRsU72i", // Rowland
  "rVtdVYq7KJgIKCtEyjmTw", // 1% For the Planet
]

const motionProjects = [
  "151Jwyic0i7-A3EIfWpI9", // FLW Members
  "KdG-W6MYDdcoc26Mon67v", // Progress Meter
  "QT9t3lA-tWlN8HJRsU72i", // Rowland
  "rVtdVYq7KJgIKCtEyjmTw", // 1% For the Planet
]

export default function Services() {
  return (
    <Main>
      <PageHeader crumbs={[]}>
        <h1 className="text-header">
          <ScrambleText reset={true}>Creative, Elegant, and Responsive</ScrambleText>
        </h1>
      </PageHeader>

      <Container>
        <Row className="justify-between">
          <Column lg="6">
            <h1 className="ml-(--spacing-xs)">
              <MaskHeading>Interactive</MaskHeading>
            </h1>
          </Column>
          <Column lg="4" className="lg:mt-4">
            <p data-lag="0.05">
              <ScrambleText>
                Interactive work sparked our journey and still sits at the core of what we do. It continues to shape how
                we think, create, and collaborate—bringing clients thoughtful, evolving solutions grounded in
                experience.
              </ScrambleText>
            </p>
          </Column>
          <Column lg="2"></Column>
        </Row>
      </Container>

      <FeaturedProjects ids={interactiveProjects} />

      <div className="my-(--spacing-xl) relative bg-black pb-1 text-white">
        <div
          className="absolute inset-0 w-full opacity-10 mix-blend-lighten"
          style={{ backgroundImage: "url(/noise.gif)" }}
        ></div>

        <Container className="py-(--spacing-xl)">
          <Row>
            <Column lg="6">
              <h1 className="ml-(--spacing-xs)">
                <SplitHeading>Interactive Services</SplitHeading>
              </h1>
            </Column>
            <Column lg="4" className="text-balance lg:mt-4">
              <p data-lag="0.05" className="ml-(--spacing-xs) lg:ml-0">
                <ScrambleText>
                  We offer a diverse range of interactive services to support your online projects at every stage.
                  Whether you’re looking for a comprehensive solution or targeted expertise, we can seamlessly align
                  with your needs.
                </ScrambleText>
              </p>
            </Column>
            <Column lg="2"></Column>
          </Row>
        </Container>

        <InteractiveServices />
      </div>

      <div id="motion"></div>

      <Container>
        <Row className="justify-between">
          <Column lg="6">
            <h1 className="ml-(--spacing-xs)">
              <MaskHeading>Motion Design</MaskHeading>
            </h1>
          </Column>
          <Column lg="4" className="lg:mt-4">
            <p data-lag="0.05">
              <ScrambleText>
                Animation plays a key role in both our interactive and standalone projects, helping us convey complex
                ideas and tone with clarity—requiring little effort from the viewer.
              </ScrambleText>
            </p>
          </Column>
          <Column lg="2"></Column>
        </Row>
      </Container>

      <FeaturedProjects ids={motionProjects} />

      <div className="my-(--spacing-xl) relative bg-black pb-[20vw] text-white">
        <div
          className="absolute inset-0 w-full opacity-10 mix-blend-lighten"
          style={{ backgroundImage: "url(/noise.gif)" }}
        ></div>

        <Container className="py-(--spacing-xl)">
          <Row>
            <Column lg="6">
              <h1 className="ml-(--spacing-xs)">
                <SplitHeading>Animation Services</SplitHeading>
              </h1>
            </Column>
            <Column lg="4" className="text-balance lg:mt-4">
              <p data-lag="0.05" className="ml-(--spacing-xs) lg:ml-0">
                <ScrambleText>
                  Our animation work scales to fit the project—ranging from focused contributions within large
                  initiatives to end-to-end solutions tailored to any scope or scale.
                </ScrambleText>
              </p>
            </Column>
            <Column lg="2"></Column>
          </Row>
        </Container>

        <MotionServices />
      </div>
    </Main>
  )
}
