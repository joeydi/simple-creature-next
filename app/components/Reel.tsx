import styles from "./Reel.module.scss";
import Container from "./Container";
import ReelGrid from "./ReelGrid";

const Reel = () => {
  return (
    <section className={styles.section}>
      <ReelGrid />
      <Container className={styles.content}>
        <h2>UI Motion Design Reel</h2>
      </Container>
    </section>
  );
};

export default Reel;
