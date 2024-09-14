"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";
import { useEffect, useRef } from "react";

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

interface Props {
  duration?: number;
}

const ScrambleText = ({ duration = 1, children }: React.PropsWithChildren<Props>) => {
  const isScrambled = useRef(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isScrambled.current) {
      return;
    }

    if (!spanRef.current) {
      return;
    }

    const split = new SplitText(spanRef.current, { type: "lines,chars", position: "relative" });

    gsap.set(split.lines, {
      whiteSpace: "nowrap",
    });

    gsap.set(split.chars, {
      opacity: 0,
    });

    spanRef.current.style.opacity = "1";

    split.lines.forEach((line) => {
      const chars = line.querySelectorAll("div");
      gsap.to(chars, {
        opacity: 1,
        scrambleText: {
          text: "{original}",
          chars: "#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~",
          speed: 1,
        },
        duration: duration / 4,
        stagger: duration / chars.length,
        scrollTrigger: {
          trigger: spanRef.current,
        },
      });
    });

    isScrambled.current = true;
  }, [isScrambled, spanRef, duration]);

  return (
    <span ref={spanRef} style={{ opacity: 0 }}>
      {children}
    </span>
  );
};

export default ScrambleText;
