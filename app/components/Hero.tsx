"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.scss";
import hero from "@/images/hero.png";
import Container from "@/components/Container";
import Row from "@/components/Row";
import Column from "@/components/Column";
import Image from "next/image";
import LogoDistortion from "./LogoDistortion";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    gsap.to(logoRef.current, {
      yPercent: 80,
      ease: "none",
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        endTrigger: heroRef.current,
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(imageRef.current, {
      yPercent: 40,
      ease: "none",
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        endTrigger: heroRef.current,
        end: "bottom top",
        scrub: true,
      },
    });
  });

  return (
    <div className={styles.hero} ref={heroRef}>
      <Container>
        <div className={styles.heroGraphic}>
          <div ref={logoRef} className={styles.heroLogo}>
            <LogoDistortion />
          </div>
          <Image ref={imageRef} className={styles.heroImage} src={hero} alt="" priority={true} />
        </div>
        <Row className="align-items-end">
          <Column lg="7">
            <h1>
              General
              <br /> Statement
            </h1>
          </Column>
          <Column lg="5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
            </p>
          </Column>
        </Row>
      </Container>
    </div>
  );
};
export default Hero;
