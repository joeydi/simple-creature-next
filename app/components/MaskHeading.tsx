"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

interface Props {
  delay?: number;
  reset?: boolean;
}

const MaskHeading = ({ delay = 0, reset = false, children }: React.PropsWithChildren<Props>) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const split = new SplitText(childRef.current, { type: "words" });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.current,
        toggleActions: `play resume resume ${reset ? "reset" : "resume"}`,
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
      0 + delay
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
      0 + delay
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
