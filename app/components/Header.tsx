import styles from "./Header.module.scss";
import Container from "./Container";

const Header = () => {
  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <button>Menu</button>
      </Container>
    </header>
  );
};

export default Header;
