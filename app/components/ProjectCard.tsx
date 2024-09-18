import Image, { StaticImageData } from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ProjectCard.module.scss";
import ScrambleText from "@/components/ScrambleText";
import MaskHeading from "@/components/MaskHeading";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
  className?: string;
  image: StaticImageData;
  title: string;
  description: string;
}

const ProjectCard = ({ className = "", image, title, description }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    gsap.set(maskRef.current, {
      yPercent: 100,
      rotateX: 45,
    });

    gsap.set(imageRef.current, {
      scale: 1.5,
      filter: "blur(20px)",
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        toggleActions: "play resume resume reset",
        start: "top bottom",
      },
    });

    timeline.to(
      maskRef.current,
      {
        yPercent: 0,
        rotateX: 0,
        duration: 1.5,
        ease: "expo.out",
      },
      0
    );

    timeline.to(
      imageRef.current,
      {
        scale: 1,
        filter: "blur(0px)",
        ease: "expo.out",
        duration: 1.5,
      },
      0
    );
  });

  return (
    <div ref={cardRef} className={`${styles.card} ${className}`}>
      <div ref={maskRef} className={styles.mask}>
        <Image ref={imageRef} className={styles.image} src={image} alt="" />
      </div>
      <div className={styles.content}>
        <h2>
          <MaskHeading delay={0.375} reset={true}>
            {title}
          </MaskHeading>
        </h2>
        <p>
          <ScrambleText delay={1} reset={true}>
            {description}
          </ScrambleText>
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
