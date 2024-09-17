"use client";

import styles from "./FeaturedProjects.module.scss";
import Container from "@/components/Container";
import SplitHeading from "@/components/SplitHeading";
import ProjectCard from "@/components/ProjectCard";
import Row from "./Row";
import Column from "./Column";

import image1 from "@/images/project-thumbnail-olg.jpg";
import image2 from "@/images/project-thumbnail-think-md.jpg";
import image3 from "@/images/project-thumbnail-zeiss.jpg";
import image4 from "@/images/project-thumbnail-aston-martin.jpg";

const projects = [
  {
    image: image1,
    title: "OLG Level Up",
    description: "TV Commercial",
  },
  {
    image: image2,
    title: "Think MD",
    description: "Mobile App Design",
  },
  {
    image: image3,
    title: "Zeiss Neurology",
    description: "Explainer Video",
  },
  {
    image: image4,
    title: "Aston Martin",
    description: "In-Vehicle UI and Motion Graphics",
  },
];

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
          {projects.map((project, i) => {
            return (
              <Column sm="6" key={`column-${i}`}>
                <ProjectCard className={i % 2 ? styles.odd : styles.even} {...project} />
              </Column>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedProjects;
