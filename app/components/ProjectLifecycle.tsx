"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ProjectLifecycle.module.scss";
import Container from "./Container";
import Row from "./Row";
import Column from "./Column";
import ScrambleText from "./ScrambleText";
import SplitHeading from "./SplitHeading";
import MaskHeading from "./MaskHeading";
import { useEffect, useRef, useState } from "react";
import { BSpline } from "@/lib/BSpline";
import { ProjectLifecycleItem } from "./ProjectLifecycleItem";

gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger);

export const ProjectLifecycle = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const polylineRef = useRef<SVGPolylineElement>(null);
  const list1Ref = useRef<HTMLUListElement>(null);
  const list2Ref = useRef<HTMLUListElement>(null);

  //   const [referencePoints, setReferencePoints] = useState<number[][]>();
  const [splinePoints, setSplinePoints] = useState<number[][]>();
  const [timelineProgress, setTimelineProgress] = useState(0);

  useEffect(() => {
    const list1Items = list1Ref.current?.querySelectorAll("li");
    const list2Items = list2Ref.current?.querySelectorAll("li");

    const calculatePoints = () => {
      if (!sectionRef.current) {
        return;
      }

      const sectionRect = sectionRef.current.getBoundingClientRect();

      const points: number[][] = [];

      list1Items?.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        points.push([itemRect.x - sectionRect.x, itemRect.y - sectionRect.y]);
      });

      // Insert one point at the start to the top left of the first item
      points.unshift([-sectionRect.width / 4, points[0][1] + 200]);

      // Insert two points after the first list to the right
      points.push([sectionRect.width * 1.25, points[points.length - 1][1] - 100]);
      points.push([sectionRect.width * 1.25, points[points.length - 1][1] + window.innerHeight / 2]);

      list2Items?.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        points.push([itemRect.x + itemRect.width - sectionRect.x, itemRect.y - sectionRect.y]);
      });

      // Insert one point at the end to the bottom left of the last item
      points.push([-100, sectionRect.height]);

      const spline = new BSpline(points, 3, false);

      const tempPoints = [];
      for (let t = 0; t <= 1; t += 0.001) {
        tempPoints.push(spline.calcAt(t));
      }

      //   setReferencePoints(points);
      setSplinePoints(tempPoints);
    };

    const resizeSVG = () => {
      if (sectionRef.current && svgRef.current) {
        const width = sectionRef.current.clientWidth;
        const height = sectionRef.current.clientHeight;

        svgRef.current.setAttribute("width", width + "");
        svgRef.current.setAttribute("height", height + "");
        svgRef.current.setAttribute("viewBox", `0 0 ${width} ${height}`);
      }
    };

    calculatePoints();
    resizeSVG();

    window.addEventListener("resize", calculatePoints, { passive: true });
    window.addEventListener("resize", resizeSVG, { passive: true });

    return () => {
      window.removeEventListener("resize", calculatePoints);
      window.removeEventListener("resize", resizeSVG);
    };
  }, []);

  useGSAP(() => {
    if (!splinePoints || !polylineRef.current) {
      return;
    }

    gsap.set(polylineRef.current, {
      drawSVG: "0% 0%",
    });

    gsap.to(polylineRef.current, {
      drawSVG: "0 100% live",
      stroke: "#e5307c",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          setTimelineProgress(self.progress);
        },
      },
    });
  }, [splinePoints]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <svg ref={svgRef} className={styles.svg} width="1000" height="1000" viewBox="0 0 1000 1000">
        {/* {referencePoints?.map((point, i) => {
          return <circle key={`circle-${i}`} r={8} cx={point[0]} cy={point[1]} fill="red" />;
        })} */}
        <polyline
          ref={polylineRef}
          points={splinePoints
            ?.map(([x, y]) => {
              return `${x},${y}`;
            })
            .join(" ")}
          stroke="#0f6cc6"
          strokeWidth={40}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <Container>
        <Row className="align-items-end">
          <Column lg="7">
            <h1 data-lag="0.05">
              <SplitHeading reset={true}>
                Project <br /> Lifecycle
              </SplitHeading>
            </h1>
          </Column>
          <Column lg="5">
            <p>
              <ScrambleText reset={true}>
                Each project is unique and requires different considerations. In each case we offer support and collaboration from
                the spark of an idea throughout an asset&rsquo;s digital existence.
              </ScrambleText>
            </p>
          </Column>
        </Row>
        <div className={styles.section}>
          <h2>
            <MaskHeading reset={true}>Strategy & Collaboration</MaskHeading>
          </h2>
          <p style={{ color: "#e5307c" }}>
            <ScrambleText reset={true}>Nice little summary statement</ScrambleText>
          </p>
          <ul ref={list1Ref} className={styles.list1}>
            <ProjectLifecycleItem progress={timelineProgress} trigger={0.2}>
              Research & Positioning
            </ProjectLifecycleItem>
            <ProjectLifecycleItem progress={timelineProgress} trigger={0.28}>
              Goals Outline
            </ProjectLifecycleItem>
            <ProjectLifecycleItem progress={timelineProgress} trigger={0.34}>
              Define Technical Approach
            </ProjectLifecycleItem>
            <ProjectLifecycleItem progress={timelineProgress} trigger={0.39}>
              Project Management
            </ProjectLifecycleItem>
          </ul>
        </div>
        <div className={styles.section}>
          <h2>
            <MaskHeading reset={true}>Planning & Design</MaskHeading>
          </h2>
          <p style={{ color: "#0f6cc6" }}>
            <ScrambleText reset={true}>Nice little summary statement</ScrambleText>
          </p>
          <ul ref={list2Ref} className={styles.list2}>
            <ProjectLifecycleItem progress={timelineProgress} trigger={0.58} align="right">
              Identify & Perception
            </ProjectLifecycleItem>
            <ProjectLifecycleItem progress={timelineProgress} trigger={0.61} align="right">
              User Research / UX
            </ProjectLifecycleItem>
            <ProjectLifecycleItem progress={timelineProgress} trigger={0.65} align="right">
              UI Design
            </ProjectLifecycleItem>
            <ProjectLifecycleItem progress={timelineProgress} trigger={0.7} align="right">
              Art Direction
            </ProjectLifecycleItem>
            <ProjectLifecycleItem progress={timelineProgress} trigger={0.75} align="right">
              Web / Motion Design
            </ProjectLifecycleItem>
          </ul>
        </div>
      </Container>
    </section>
  );
};
