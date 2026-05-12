import Column from "@/components/Column"
import Container from "@/components/Container"
import FeaturedProjects from "@/components/FeaturedProjects"
import { InteractiveServices } from "@/components/InteractiveServices"
import Main from "@/components/main"
import MaskHeading from "@/components/MaskHeading"
import PageHeader from "@/components/PageHeader"
import Row from "@/components/Row"
import ScrambleText from "@/components/ScrambleText"
import SplitHeading from "@/components/SplitHeading"

const projects = [
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
          <ScrambleText duration={0.5}>Creative, Elegant, and Responsive</ScrambleText>
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
      <FeaturedProjects ids={projects} />

      <div className="bg-black pb-1 text-white">
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
                  Interactive work sparked our journey and still sits at the core of what we do. It continues to shape
                  how we think, create, and collaborate—bringing clients thoughtful, evolving solutions grounded in
                  experience.
                </ScrambleText>
              </p>
            </Column>
            <Column lg="2"></Column>
          </Row>
        </Container>

        <InteractiveServices />
      </div>
    </Main>
  )
}
