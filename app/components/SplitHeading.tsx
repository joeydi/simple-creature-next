import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(SplitText, ScrollTrigger);

const SplitHeading = ({ children }: React.PropsWithChildren) => {
  const isSplit = useRef(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSplit.current) {
      return;
    }

    if (!divRef.current) {
      return;
    }

    const split = new SplitText(divRef.current, { type: "lines,words" });

    gsap.set(split.lines, {
      overflow: "hidden",
      display: "inline-block",
    });

    const divRect = divRef.current.getBoundingClientRect();
    const line1Rect = split.lines[0].getBoundingClientRect();
    const line2Rect = split.lines[1].getBoundingClientRect();

    console.log({
      divRect: divRect.width,
      line1Rect: line1Rect.width,
      line2Rect: line2Rect.width,
    });

    gsap.set(split.lines, {
      display: "block",
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: divRef.current,
      },
    });

    timeline.fromTo(
      split.lines[0].querySelectorAll("div"),
      {
        yPercent: 100,
      },
      {
        yPercent: 0,
        duration: 2,
        ease: "power3.out",
      },
      0
    );

    timeline.fromTo(
      split.lines[0].querySelectorAll("div"),
      {
        x: divRect.width - line1Rect.width,
      },
      {
        x: 0,
        duration: 2,
        ease: "power3.inOut",
      },
      0
    );

    timeline.fromTo(
      split.lines[1].querySelectorAll("div"),
      {
        yPercent: -100,
      },
      {
        yPercent: 0,
        duration: 2,
        ease: "power3.out",
      },
      0
    );

    timeline.fromTo(
      split.lines[1].querySelectorAll("div"),
      {
        x: (divRect.width - line2Rect.width) / 2,
      },
      {
        x: 0,
        duration: 2,
        ease: "power3.inOut",
      },
      0
    );

    divRef.current.style.opacity = "1";

    isSplit.current = true;
  });

  return (
    <div ref={divRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

export default SplitHeading;
