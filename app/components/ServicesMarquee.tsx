"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ServicesMarquee.module.scss";
import Container from "@/components/Container";
import MaskHeading from "@/components/MaskHeading";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ServicesMarquee = () => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        invalidateOnRefresh: true,
        trigger: spacerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    const oddChildren = marqueeRef.current?.querySelectorAll("span:nth-child(odd)");
    if (oddChildren) {
      timeline.to(
        oddChildren,
        {
          x: (_, el) => {
            const width = el.getBoundingClientRect().width;
            return window.innerWidth - width;
          },
          ease: "power1.inOut",
        },
        0
      );
    }

    const evenChildren = marqueeRef.current?.querySelectorAll("span:nth-child(even)");
    if (evenChildren) {
      timeline.to(
        evenChildren,
        {
          x: (_, el) => {
            const width = el.getBoundingClientRect().width;
            return width - window.innerWidth;
          },
          ease: "power1.inOut",
        },
        0
      );
    }
  });

  return (
    <section>
      <div ref={spacerRef} className={styles.spacer}>
        <div ref={contentRef}>
          <Container>
            <h2 className={styles.heading}>
              <MaskHeading>Our Services</MaskHeading>
            </h2>
          </Container>
          <div ref={marqueeRef} className={`h1 ${styles.marquee}`} data-speed="0.5">
            <span className={styles.span}>
              Strategy &bull; Design &bull; Motion &bull; Consulting &bull; Interactive &bull; Production
            </span>
            <span className={styles.span}>Direction &bull; User Experience &bull; Branding &bull; Installations</span>
            <span className={styles.span}>
              3D Modeling &bull; Creative Direction &bull; Interface Design &bull; Creative Development
            </span>
            <span className={styles.span}>
              Strategy &bull; Design &bull; Motion &bull; Consulting &bull; Interactive &bull; Production
            </span>
            <span className={styles.span}>Direction &bull; User Experience &bull; Branding &bull; Installations</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesMarquee;
