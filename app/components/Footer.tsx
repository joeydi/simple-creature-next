"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import styles from "@/components/Footer.module.scss";
import Container from "@/components/Container";
import Logo from "@/components/Logo";
import footerBg from "@/images/footer-bg.jpg";
import Row from "@/components/Row";
import Column from "@/components/Column";

const Footer = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  const loadHandler = () => {
    gsap.to(imageRef.current, {
      opacity: 1,
      duration: 1,
    });
  };
  return (
    <footer className={styles.footer}>
      <Image ref={imageRef} className={styles.background} src={footerBg} alt="" onLoad={loadHandler} />
      <Container className={styles.content}>
        <p className={styles.cta} data-lag="0.2">
          Have a project in mind? <br />
          <a href="mailto:hello@simplecreature.us">hello@simplecreature.us</a>
        </p>
        <div data-lag="0.4">
          <Logo className={styles.logo} />
        </div>
        <Row className="align-items-end">
          <Column sm="6">
            <p className={styles.address} data-lag="0.2">
              47 Maple Street, Suite 220
              <br />
              Burlington, Vermont 05401
            </p>
          </Column>
          <Column sm="6">
            <ul className={styles.social} data-lag="0.2">
              <li>
                <a href="https://x.com/_simplecreature" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/simple.creature/" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/simplecreature/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
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
