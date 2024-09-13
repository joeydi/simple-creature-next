import Image from "next/image";
import styles from "./Footer.module.scss";
import Container from "./Container";
import Logo from "./Logo";
import footerBg from "../images/footer-bg.jpg";
import Row from "./Row";
import Column from "./Column";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Image className={styles.background} src={footerBg} alt="" />
      <Container className={styles.content}>
        <p className={styles.cta}>
          Have a project in mind? <br />
          <a href="mailto:hello@simplecreature.us">hello@simplecreature.us</a>
        </p>
        <Logo className={styles.logo} />
        <Row className="align-items-end">
          <Column sm="6">
            <p className={styles.address}>
              47 Maple Street, Suite 220
              <br />
              Burlington, Vermont 05401
            </p>
          </Column>
          <Column sm="6">
            <ul className={styles.social}>
              <li>
                <a href="" target="_blank" rel="noopener noreferrer">
                  twitter
                </a>
              </li>
              <li>
                <a href="" target="_blank" rel="noopener noreferrer">
                  instagram
                </a>
              </li>
              <li>
                <a href="" target="_blank" rel="noopener noreferrer">
                  linkedin
                </a>
              </li>
            </ul>
          </Column>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
