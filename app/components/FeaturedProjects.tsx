"use client";

import styles from "./FeaturedProjects.module.scss";
import Container from "@/components/Container";
import SplitHeading from "@/components/SplitHeading";
import ProjectCard from "@/components/ProjectCard";
import Row from "./Row";
import Column from "./Column";

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
          {Array(4)
            .fill(0)
            .map((_, i) => {
              return (
                <Column sm="6">
                  <ProjectCard />
                </Column>
              );
            })}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedProjects;
