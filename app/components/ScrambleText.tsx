"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(SplitText, ScrambleTextPlugin, ScrollTrigger);

interface Props {
  duration?: number;
  delay?: number;
  reset?: boolean;
}

const ScrambleText = ({ duration = 1, delay = 0, reset = false, children }: React.PropsWithChildren<Props>) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const split = new SplitText(spanRef.current, { type: "lines,chars" });

    gsap.set(split.lines, {
      whiteSpace: "nowrap",
    });

    gsap.set(split.chars, {
      opacity: 0,
    });

    gsap.set(spanRef.current, {
      opacity: 1,
    });

    split.lines.forEach((line) => {
      const chars = line.querySelectorAll("div");
      gsap.to(chars, {
        opacity: 1,
        scrambleText: {
          text: "{original}",
          chars: "#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~",
          speed: 1,
        },
        delay: delay,
        duration: duration / 2,
        stagger: duration / chars.length,
        scrollTrigger: {
          trigger: spanRef.current,
          toggleActions: `play resume resume ${reset ? "reset" : "resume"}`,
        },
      });
    });
  }, []);

  return (
    <span ref={spanRef} style={{ opacity: 0 }}>
      {children}
    </span>
  );
};

export default ScrambleText;
