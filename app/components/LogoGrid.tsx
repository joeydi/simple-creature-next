"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "./Container";
import MaskHeading from "./MaskHeading";
import styles from "./LogoGrid.module.scss";
import { getRandom, getRandomInt } from "@/lib/utils";

import astonMartin from "@/images/logos/aston-martin.svg";
import arizonaStateUninversity from "@/images/logos/arizona-state-uninversity.svg";
import capitalOne from "@/images/logos/capital-one.svg";
import dell from "@/images/logos/dell.svg";
import fantasy from "@/images/logos/fantasy.svg";
import ford from "@/images/logos/ford.svg";
import generalMills from "@/images/logos/general-mills.svg";
import keurig from "@/images/logos/keurig.svg";
import lincoln from "@/images/logos/lincoln.svg";
import mamava from "@/images/logos/mamava.svg";
import meta from "@/images/logos/meta.svg";
import nickelodeon from "@/images/logos/nickelodeon.svg";
import nissan from "@/images/logos/nissan.svg";
import nokianTyres from "@/images/logos/nokian-tyres.svg";
import onePercent from "@/images/logos/one-percent.svg";
import popularScience from "@/images/logos/popular-science.svg";
import principal from "@/images/logos/principal.svg";
import ramble from "@/images/logos/ramble.svg";
import sandwich from "@/images/logos/sandwich.svg";
import zeiss from "@/images/logos/zeiss.svg";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const logos = [
  astonMartin,
  arizonaStateUninversity,
  capitalOne,
  dell,
  fantasy,
  ford,
  generalMills,
  keurig,
  lincoln,
  mamava,
  meta,
  nickelodeon,
  nissan,
  nokianTyres,
  onePercent,
  popularScience,
  principal,
  ramble,
  sandwich,
  zeiss,
];

export const LogoGrid = () => {
  const randomLogos = logos.sort(() => 0.5 - Math.random());

  const columns = 6;
  const rows = 12;

  const maskRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const grid = gridRef.current;
    const logos = maskRef?.current?.querySelectorAll(".logo");
    const stars = maskRef?.current?.querySelectorAll(".star");

    if (!grid || !logos || !stars) {
      return;
    }

    const gridWidth = grid?.clientWidth;
    const gridHeight = grid?.clientWidth;

    logos.forEach((logo, i) => {
      const column = i % columns;
      const row = Math.floor(i / columns);

      const x = column * (gridWidth / columns) + (row % 2) * (gridWidth / columns / 2);
      const y = row * (gridHeight / rows);
      const z = getRandom(-window.innerWidth / 2, window.innerWidth / 4);

      gsap.set(logo, {
        x,
        y,
        z,
      });
    });

    const sizeValues = Array.from(stars).map(() => {
      return getRandomInt(5, 20);
    });

    gsap.set(stars, {
      x: () => getRandomInt(window.innerWidth * -1, window.innerWidth * 3),
      y: () => getRandomInt(window.innerHeight * -1, window.innerHeight * 2.5),
      z: () => getRandom(-window.innerWidth * 10, -window.innerWidth),
      width: (i) => sizeValues[i],
      height: (i) => sizeValues[i],
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
          {Array(columns * rows)
            .fill(0)
            .map((_, i) => {
              const logo = randomLogos[i % randomLogos.length];

              return (
                <div key={`div-${i}`} className={`${styles.logo} logo`}>
                  <Image src={logo} alt="" />
                </div>
              );
            })}
          {Array(100)
            .fill(0)
            .map((_, i) => {
              return <div key={`star-${i}`} className={`${styles.star} star`}></div>;
            })}
        </div>
      </div>
    </section>
  );
};
