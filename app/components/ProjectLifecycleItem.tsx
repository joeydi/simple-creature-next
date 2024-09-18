import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ProjectLifecycleItem.module.scss";

gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger);

interface Props {
  progress: number;
  trigger: number;
  align?: "left" | "right";
  children: string;
}

export const ProjectLifecycleItem = ({ progress, trigger, align = "left", children }: Props) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  if (!timelineRef.current && boxRef.current && dotRef.current && titleRef.current) {
    timelineRef.current = gsap.timeline({
      paused: true,
    });

    timelineRef.current.fromTo(
      boxRef.current,
      {
        opacity: 0,
        scale: 1.5,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "expo.out",
      },
      0
    );

    timelineRef.current.fromTo(
      dotRef.current,
      {
        scale: 0,
      },
      {
        scale: 1,
        duration: 1,
        ease: "expo.out",
      },
      0.25
    );

    timelineRef.current.fromTo(
      titleRef.current,
      {
        yPercent: 100,
      },
      {
        yPercent: 0,
        duration: 1,
        ease: "expo.out",
      },
      0.25
    );
  }

  useGSAP(
    () => {
      if (progress > trigger) {
        timelineRef.current?.timeScale(1);
        timelineRef.current?.play();
      } else {
        timelineRef.current?.timeScale(3);
        timelineRef.current?.reverse();
      }
    },
    { dependencies: [progress, trigger] }
  );

  return (
    <li className={`${styles.item} ${styles[align]}`}>
      <div ref={boxRef} className={styles.box}>
        <div ref={dotRef} className={styles.dot}></div>
      </div>
      <div className={styles.mask}>
        <div ref={titleRef} className={styles.title}>
          {children}
        </div>
      </div>
    </li>
  );
};
