"use client";

import styles from "./Reel.module.scss";
import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getRandom } from "@/utils";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const ReelGrid = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const rectSize = 100;
  const rows = 20;
  const columns = 20;

  const cells = useMemo(() => {
    return Array(rows * columns)
      .fill(0)
      .map((_, i) => {
        const column = i % columns;
        const row = Math.floor(i / rows);

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
        duration: () => getRandom(10, 20),
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 75%",
          end: "bottom bottom",
          scrub: 2,
        },
      });

      gsap.set(svgRef.current, {
        opacity: 1,
      });
    },
    { scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      style={{ opacity: 0 }}
      width={columns * rectSize}
      height={rows * rectSize}
      className={styles.svg}
      viewBox={`0 0 ${columns * rectSize} ${rows * rectSize}`}>
      {cells.map((cell, i) => {
        return <rect key={`rect-${i}`} width={rectSize + 1} height={rectSize + 1} x={cell.x} y={cell.y} />;
      })}
    </svg>
  );
};

export default ReelGrid;
