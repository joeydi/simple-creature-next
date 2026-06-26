import { Metadata } from "next"
import PageHeader from "@/components/PageHeader"
import MaskHeading from "@/components/MaskHeading"
import ScrambleText from "@/components/ScrambleText"
import Container from "@/components/Container"
import Column from "@/components/Column"
import Row from "@/components/Row"
import AboutLegos from "./about-legos"
import AboutHero from "./about-hero"
import Main from "@/components/main"
import SplitHeading from "@/components/SplitHeading"
import CategoryFilter from "@/components/CategoryFilter"
import { getCategoriesWithCounts } from "@/(frontend)/work/actions"

export const metadata: Metadata = {
  title: "Simple Creature » Interactive Animation Studio",
  description: "Simple Creature is a fun-size digital design and interactive animation studio in Burlington, VT.",
  openGraph: {
    url: "/about",
  },
}

export default async function About() {
  const categories = await getCategoriesWithCounts()

  return (
    <Main className="pb-(--spacing-xl)">
      <PageHeader crumbs={[]}>
        <h1 className="text-header">
          <ScrambleText reset={true}>a veritable force</ScrambleText>
        </h1>
      </PageHeader>

      <Container className="mb-(--spacing-xl) relative">
        <AboutHero />
      </Container>

      <div className="my-(--spacing-xxl)">
        <Container>
          <Row>
            <Column md="6" className="pl-(--spacing-xxs)">
              <h1>
                <MaskHeading>Who is we?</MaskHeading>
              </h1>
            </Column>
            <Column md="6" lg="5" className="pl-(--spacing-xxs) md:mt-(--spacing-xxs) md:pl-0">
              <p className="text-balance">
                <ScrambleText>
                  We&rsquo;re James Kowalski and Joe di Stefano — long-time friends and a design-development duo
                  crafting bold digital experiences.
                </ScrambleText>
              </p>
              <p className="text-balance">
                <ScrambleText>
                  From CMS websites and mobile apps to motion graphics, explainer videos, visual effects, and UI/UX
                  design, we combine creative design with reliable code to build thoughtful, engaging digital work.
                </ScrambleText>
              </p>
            </Column>
          </Row>
        </Container>
      </div>

      <AboutLegos />

      <div className="my-(--spacing-xxl)">
        <Container>
          <Row>
            <Column md="6" className="pl-(--spacing-xxs)">
              <h1>
                <SplitHeading>
                  Prowess &amp;
                  <br /> Partnership
                </SplitHeading>
              </h1>
            </Column>
            <Column md="6" lg="5" className="pl-(--spacing-xxs) md:mt-(--spacing-xxs) md:pl-0">
              <p className="text-balance">
                <ScrambleText>
                  We collaborate closely with our clients to design and develop digital solutions that are visually
                  compelling and strategically effective. Through a thoughtful, intentional process, we create
                  experiences that are impactful, memorable, and built to thrive in a competitive digital landscape.
                </ScrambleText>
              </p>
            </Column>
          </Row>
        </Container>
      </div>

      <div className="my-(--spacing-xxl)">
        <Container>
          <Row>
            <Column md="4" className="pl-(--spacing-xxs)">
              <CategoryFilter categories={categories} linkTo="/work" />
            </Column>
            <Column md="4" className="pl-(--spacing-xxs) xl:pr-(--spacing-lg) md:pl-0">
              <p className="text-balance">
                Though our team is small, our expertise runs deep—enabling us to deliver a wide range of digital
                products. We proudly serve clients from local startups to global brands, and we approach every project,
                big or small, with the same level of commitment and creativity.
              </p>
            </Column>
            <Column md="4" className="pl-(--spacing-xxs) xl:pr-(--spacing-lg) md:pl-0">
              <p className="text-balance">
                We&rsquo;re a full-service creative studio for strategic design and execution and a fast, flexible
                production partner when larger agencies need extra support without the overhead.
              </p>
            </Column>
          </Row>
        </Container>
      </div>

      <div>
        <Container>
          <div className="mb-(--spacing-xs) pl-(--spacing-xxs)">
            <ScrambleText>
              <h2>Frequently Asked Questions</h2>
            </ScrambleText>
          </div>
          <Row>
            <Column md="6" lg="5" xl="4" className="pl-(--spacing-xxs)">
              <div className="gap-(--spacing-xs) flex flex-col">
                <div>
                  <h3 className="mb-2 text-gray-400">What type of projects do you work on?</h3>
                  <p>
                    CMS Websites, Microsites, Mobile Applications, Explainer Videos, Visual Effects, 3D Design and
                    Animations, Branding, Installations
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-gray-400">What is the cost of a typical website project?</h3>
                  <p>
                    Although the cost for a full website can rage broadly depending on the project&rsquo;s purpose,
                    timeline, and creative lift, here are a few baseline numbers to give you an idea: Our studio minimum
                    for design and development of a website is $15k. Most projects fall within the range of $20k-$40k
                    and take 10 weeks from our initial conversation to launch.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-gray-400">What is the cost of a typical motion graphics project?</h3>
                  <p>
                    Animated work can vary widely in cost depending on the complexity and level of execution. At the
                    simpler end of the spectrum, such as kinetic typography paired with voiceover&mdash;a 90 second
                    video typically ranges from $5k-$13k.
                  </p>
                  <p>
                    For more intricate productions, including 3D modeling, art-directed simulations, or detailed product
                    tours, budgets for a 90 second piece generally fall between $30k and $50k. These ranges reflect the
                    creative and technical demands required to fully realize each project&rsquo;s vision.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-gray-400">Who will I speak to when I contact Simple Creature?</h3>
                  <p>Your email will be read and responded to by either James Kowalski or Joe di Stefano.</p>
                </div>
              </div>
            </Column>
            <Column md="6" lg="5" xl="4" className="pl-(--spacing-xxs) ml-auto md:pl-0">
              <div className="gap-(--spacing-xs) flex flex-col">
                <div>
                  <h3 className="mb-2 text-gray-400">What industries do you specialize in?</h3>
                  <p>
                    We don&rsquo;t limit ourselves to any one industry. Instead, we take pride in our ability to adapt
                    our creative approach to align with any brand or sector. What excites us most are projects that
                    invite fresh ideas, push creative possibilities, and allow us to showcase our expertise in
                    leveraging emerging technologies.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-gray-400">Is my project too small?</h3>
                  <p>
                    While we have minimum budget requirements for new projects, we&rsquo;re always open to a
                    conversation. Creative freedom can be just as meaningful as compensation.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-gray-400">What does your process look like?</h3>
                  <p>Our process is as dynamic and diverse as the clients we serve.</p>
                  <p>
                    When we're contracted for pure production, speed and efficiency take the lead. We kick things off
                    with a quick discovery call to get aligned, and often begin producing assets that same day.
                  </p>
                  <p>
                    For full websites, videos, or larger builds, we take a phased approach. It starts with understanding
                    your goals and researching the landscape. From there, we dive into discovery, shaping ideas,
                    crafting visuals, and setting a clear path forward.
                  </p>
                  <p>
                    Design and development follow a focused timeline, with regular check-ins to keep everything on track
                    and aligned with your vision and ours.
                  </p>
                </div>
              </div>
            </Column>
            <Column lg="1" xl="3"></Column>
          </Row>
        </Container>
      </div>
    </Main>
  )
}
