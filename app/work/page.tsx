import { projects } from "@/data/projects";
import PageHeader from "@/components/PageHeader";
import MaskHeading from "@/components/MaskHeading";
import Container from "@/components/Container";
import Row from "@/components/Row";
import Column from "@/components/Column";
import ProjectCard from "@/components/ProjectCard";
import { RemoteImage } from "@/components/RemoteImage";

export default function Work() {
  return (
    <>
      <PageHeader>
        <h1>
          <MaskHeading>Our Work</MaskHeading>
        </h1>
      </PageHeader>
      <Container className="section-margin-bottom">
        <Row>
          {projects.map((project, i) => {
            const image = <RemoteImage src={project.featuredImage.src} alt={project.featuredImage.alt} />;

            return (
              <Column sm="6" key={`column-${i}`}>
                <ProjectCard
                  align={i % 2 ? "right" : "left"}
                  slug={project.slug}
                  image={image}
                  title={project.title}
                  description={project.shortDescription}
                />
              </Column>
            );
          })}
        </Row>
      </Container>
    </>
  );
}
