"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Reel.module.scss";
import Container from "./Container";
import ReelGrid from "./ReelGrid";
import posterImage from "@/images/aston-martin-tach-ui.jpg";
import playButton from "@/images/play-button.svg";
import pauseButton from "@/images/pause-button.svg";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Reel = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const activityTimeoutRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingSpanRef = useRef<HTMLSpanElement>(null);
  const playButtonWrapperRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

    gsap.set(playButtonWrapperRef.current, {
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
      playButtonWrapperRef.current,
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

  const mouseMoveHandler = (e: React.MouseEvent) => {
    if (!playButtonWrapperRef.current) {
      return;
    }

    const buttonRect = playButtonWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - buttonRect.x - buttonRect.width / 2;
    const y = e.clientY - buttonRect.y - buttonRect.height / 2;

    gsap.to(playButtonRef.current, {
      x: x,
      y: y,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.set(playButtonRef.current, {
      pointerEvents: "none",
    });

    setIsHovered(true);
    setIsActive(true);

    window.clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = window.setTimeout(() => {
      setIsActive(false);
    }, 1000);
  };

  const mouseLeaveHandler = () => {
    gsap.set(playButtonRef.current, {
      pointerEvents: "all",
    });

    gsap.to(playButtonRef.current, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "expo.out",
    });

    setIsHovered(false);
  };

  const clickHandler = () => {
    setIsActive(true);
    setIsPlaying(!isPlaying);

    window.clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = window.setTimeout(() => {
      setIsActive(false);
    }, 1000);
  };

  useEffect(() => {
    if (isPlaying) {
      gsap.to(posterRef.current, {
        opacity: 0,
        duration: 0.25,
      });
      videoRef.current?.play();
    } else {
      gsap.to(posterRef.current, {
        opacity: 1,
        duration: 0.25,
      });
      videoRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isHovered && !isActive) {
      gsap.to(playButtonRef.current, {
        opacity: 0,
        scale: 0.75,
        duration: 0.25,
        ease: "power2.in",
      });
    } else {
      gsap.to(playButtonRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  }, [isHovered, isActive]);

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
              <div ref={playButtonWrapperRef} className={styles.playButtonWrapper}>
                <button ref={playButtonRef} className={styles.playButton} onClick={clickHandler}>
                  <Image src={isPlaying ? pauseButton : playButton} alt={isPlaying ? "Pause Video" : "Play Video"} />
                </button>
              </div>
            </div>
            <div
              ref={wrapperRef}
              className={styles.wrapper}
              onMouseMove={mouseMoveHandler}
              onMouseLeave={mouseLeaveHandler}
              onClick={clickHandler}>
              <div ref={maskRef} className={styles.mask}>
                <video ref={videoRef} className={styles.video} src="https://simplecreature.us/assets/reelEdit_web.mp4" />
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
