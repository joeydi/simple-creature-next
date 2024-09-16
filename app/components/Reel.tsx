"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Reel.module.scss";
import Container from "./Container";
import ReelGrid from "./ReelGrid";
import posterImage from "@/images/aston-martin-tach-ui.jpg";
import playButton from "@/images/play-button.svg";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Reel = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingSpanRef = useRef<HTMLSpanElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const headingTimeline = gsap.timeline({
      scrollTrigger: {
        // markers: true,
        trigger: contentRef.current,
        start: "top 60%",
        end: "bottom top",
        toggleActions: "play pause resume reverse",
      },
    });

    gsap.set(headingSpanRef.current, {
      display: "inline-block",
      yPercent: 100,
    });

    gsap.set(playButtonRef.current, {
      xPercent: 75,
      opacity: 0,
    });

    headingTimeline.to(
      headingSpanRef.current,
      {
        yPercent: 0,
        ease: "power2.out",
        duration: 0.5,
      },
      0
    );

    headingTimeline.to(
      playButtonRef.current,
      {
        xPercent: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 0.5,
      },
      0.25
    );

    const videoTimeline = gsap.timeline({
      scrollTrigger: {
        // markers: true,
        trigger: contentRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.set(maskRef.current, {
      yPercent: 100,
      rotateX: 45,
    });

    gsap.set(posterRef.current, {
      scale: 1.5,
      filter: "blur(40px)",
    });

    videoTimeline.to(
      maskRef.current,
      {
        yPercent: 0,
        rotateX: 0,
        ease: "power2.out",
        duration: 0.48,
      },
      0
    );

    videoTimeline.to(
      maskRef.current,
      {
        rotateX: -45,
        ease: "power2.in",
        duration: 0.48,
      },
      0.52
    );

    videoTimeline.to(
      posterRef.current,
      {
        scale: 1,
        filter: "blur(0px)",
        ease: "power2.out",
        duration: 0.48,
      },
      0
    );

    videoTimeline.to(
      posterRef.current,
      {
        scale: 1.5,
        filter: "blur(40px)",
        ease: "power2.in",
        duration: 0.48,
      },
      0.52
    );
  });

  return (
    <section ref={sectionRef} className={styles.section}>
      <ReelGrid />
      <Container>
        <div data-speed="0.75">
          <div ref={contentRef} className={styles.content}>
            <div className={styles.heading}>
              <h2>
                <span ref={headingSpanRef}>UI Motion Design Reel</span>
              </h2>
              <button ref={playButtonRef} className={styles.playButton}>
                <Image src={playButton} alt="" />
              </button>
            </div>
            <div ref={wrapperRef} className={styles.wrapper}>
              <div ref={maskRef} className={styles.mask}>
                <Image
                  ref={posterRef}
                  className={styles.poster}
                  src={posterImage}
                  alt="A futuristic digital car dashboard showing the speed at 68 MPH, music playing ('Teardrop' by Massive Attack), fuel and temperature gauges, and menu options like Navigation and Media."
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Reel;
