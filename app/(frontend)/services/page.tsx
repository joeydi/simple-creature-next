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
  description:
    "Simple Creature blends web design, animation, and development to create thoughtful websites, apps, motion graphics, and digital experiences.",
  openGraph: {
    type: "website",
    url: "/services",
  },
}

const interactiveProjects = [
  "151Jwyic0i7-A3EIfWpI9", // FLW Members
  "KdG-W6MYDdcoc26Mon67v", // Progress Meter
  "QT9t3lA-tWlN8HJRsU72i", // Rowland
  "rVtdVYq7KJgIKCtEyjmTw", // 1% For the Planet
]

const motionProjects = [
  "4GvYLW61eCBKj3L26GKsr", // Mummy Dogs
  "BOC_AlqByuER-o9a2h1G2", // Chefs on the Line
  "bTaK8Xgv-QTCiooYsUNTX", // Meta Reels
  "8ItVI4se_TR8Qt-nJnQ4R", // What is 0x
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
        <Row>
          <Column md="6" className="pl-(--spacing-xxs)">
            <h1>
              <MaskHeading>Interactive</MaskHeading>
            </h1>
          </Column>
          <Column md="6" lg="5" xl="4" className="pl-(--spacing-xxs) md:mt-(--spacing-xxs) md:pl-0">
            <p>
              <ScrambleText>
                Interactive work sparked our journey and still sits at the core of what we do. It continues to shape how
                we think, create, and collaborate—bringing clients thoughtful, evolving solutions grounded in
                experience.
              </ScrambleText>
            </p>
          </Column>
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
            <Column md="6" className="pl-(--spacing-xxs)">
              <h1>
                <SplitHeading>Interactive Services</SplitHeading>
              </h1>
            </Column>
            <Column md="6" lg="5" xl="4" className="pl-(--spacing-xxs) md:mt-(--spacing-xxs) text-balance md:pl-0">
              <p>
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

      <Container id="motion">
        <Row>
          <Column md="6" className="pl-(--spacing-xxs)">
            <h1>
              <MaskHeading>Motion Design</MaskHeading>
            </h1>
          </Column>
          <Column md="6" lg="5" xl="4" className="pl-(--spacing-xxs) md:mt-(--spacing-xxs) text-balance md:pl-0">
            <p>
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
            <Column md="6" className="pl-(--spacing-xxs)">
              <h1>
                <SplitHeading>Animation Services</SplitHeading>
              </h1>
            </Column>
            <Column md="6" lg="5" xl="4" className="pl-(--spacing-xxs) md:mt-(--spacing-xxs) text-balance md:pl-0">
              <p>
                <ScrambleText>
                  Our animation work scales to fit the project—ranging from focused contributions within large
                  initiatives to end-to-end solutions tailored to any scope or scale.
                </ScrambleText>
              </p>
            </Column>
          </Row>
        </Container>

        <MotionServices />
      </div>
    </Main>
  )
}
