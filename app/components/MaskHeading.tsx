"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const MaskHeading = ({ children }: React.PropsWithChildren) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parentRef.current) {
      return;
    }

    const split = new SplitText(childRef.current, { type: "words" });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.current,
      },
    });

    timeline.fromTo(
      split.words,
      {
        yPercent: 100,
      },
      {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
      },
      0
    );

    timeline.fromTo(
      split.words,
      {
        x: 100,
      },
      {
        x: 0,
        duration: 1,
        ease: "power3.inOut",
        stagger: 0.1,
      },
      0
    );

    gsap.set(parentRef.current, {
      opacity: 1,
    });
  });

  return (
    <div ref={parentRef} style={{ opacity: 0, overflow: "hidden" }}>
      <div ref={childRef}>{children}</div>
    </div>
  );
};

export default MaskHeading;
