"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "./Container";
import MaskHeading from "./MaskHeading";
import styles from "./LogoGrid.module.scss";
import { getRandom, getRandomInt } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const randomHexColor = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
};

export const LogoGrid = () => {
  const maskRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const logos = maskRef?.current?.querySelectorAll(".logo");
    const stars = maskRef?.current?.querySelectorAll(".star");

    if (!logos || !stars) {
      return;
    }

    const zValues = Array.from(logos).map(() => {
      return getRandom(-window.innerWidth, 0);
    });

    gsap.set(logos, {
      z: (i) => zValues[i],
    });

    gsap.set(stars, {
      z: () => getRandom(-window.innerWidth * 10, -window.innerWidth),
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: maskRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    timeline.fromTo(
      gridRef.current,
      {
        xPercent: 0,
        yPercent: 0,
      },
      {
        xPercent: -50,
        yPercent: -50,
        duration: 1,
        ease: "none",
      }
    );
  });

  return (
    <section className={styles.section}>
      <Container>
        <h2 className={styles.heading}>
          <MaskHeading reset={true}>Clients We&rsquo;ve Worked With</MaskHeading>
        </h2>
      </Container>
      <div ref={maskRef} className={styles.mask}>
        <div ref={gridRef} className={styles.grid}>
          {Array(40)
            .fill(0)
            .map((_, i) => {
              return (
                <div
                  key={`div-${i}`}
                  className={`${styles.logo} logo`}
                  style={{
                    backgroundColor: randomHexColor(),
                    width: 200,
                    height: 100,
                    left: getRandomInt(0, window.innerWidth * 2),
                    top: getRandomInt(0, window.innerHeight * 1.5),
                  }}></div>
              );
            })}
          {Array(100)
            .fill(0)
            .map((_, i) => {
              const size = getRandomInt(5, 20);
              return (
                <div
                  key={`star-${i}`}
                  className={`${styles.star} star`}
                  style={{
                    position: "absolute",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    width: size,
                    height: size,
                    left: getRandomInt(window.innerWidth * -1, window.innerWidth * 3),
                    top: getRandomInt(window.innerHeight * -1, window.innerHeight * 2.5),
                  }}></div>
              );
            })}
        </div>
      </div>
    </section>
  );
};
