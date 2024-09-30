import { projects } from "@/data/projects";
import styles from "./FeaturedProjects.module.scss";
import Container from "@/components/Container";
import SplitHeading from "@/components/SplitHeading";
import ProjectCard from "@/components/ProjectCard";
import Row from "./Row";
import Column from "./Column";
import { RemoteImage } from "./RemoteImage";

const featuredProjects = projects.filter((project) => project.featured).slice(0, 4);

const FeaturedProjects = () => {
  return (
    <section className={styles.section}>
      <Container>
        <h1 className={styles.heading}>
          <SplitHeading>
            Featured <br /> Projects
          </SplitHeading>
        </h1>
        <Row>
          {featuredProjects.map((project, i) => {
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
    </section>
  );
};

export default FeaturedProjects;
