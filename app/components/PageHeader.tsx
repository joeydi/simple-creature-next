import styles from "./PageHeader.module.scss";
import Container from "./Container";

const PageHeader = ({ children }: React.PropsWithChildren) => {
  return (
    <div className={styles.pageHeader} data-lag="0.25">
      <Container>
        <hgroup className={styles.hgroup}>{children}</hgroup>
      </Container>
    </div>
  );
};

export default PageHeader;
