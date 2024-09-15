"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef } from "react";
import styles from "./Reel.module.scss";
import Container from "./Container";
import { getRandom } from "@/utils";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const Reel = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const rectSize = 100;
  const rows = 20;
  const columns = 20;

  const cells = useMemo(() => {
    return Array(400)
      .fill(0)
      .map((_, i) => {
        const column = i % 20;
        const row = Math.floor(i / 20);

        const x = column * rectSize;
        const y = row * rectSize;

        const xDistance = x - (rows / 2) * rectSize;
        const yDistance = y - 0;
        const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance * 1.5);

        return { i, x, y, distance };
      })
      .sort((a, b) => {
        return Math.sign(a.distance - b.distance);
      });
  }, []);

  useGSAP(
    () => {
      gsap.set("rect", {
        scale: 0,
        transformOrigin: "50% 50%",
      });

      gsap.to("rect", {
        scale: 1,
        duration: () => getRandom(1, 5),
        ease: "expo.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 90%",
          end: "bottom bottom",
          scrub: 2,
        },
      });
    },
    { scope: svgRef }
  );

  return (
    <section className={styles.section}>
      <svg
        ref={svgRef}
        width={columns * rectSize}
        height={rows * rectSize}
        className={styles.svg}
        viewBox={`0 0 ${columns * rectSize} ${rows * rectSize}`}>
        {cells.map((cell, i) => {
          return <rect key={`rect-${i}`} width={rectSize + 1} height={rectSize + 1} x={cell.x} y={cell.y} />;
        })}
      </svg>
      <Container>
        <h2>UI Motion Design Reel</h2>
      </Container>
    </section>
  );
};

export default Reel;
