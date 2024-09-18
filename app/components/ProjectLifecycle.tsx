"use client";

import styles from "./ProjectLifecycle.module.scss";
import Container from "./Container";
import Row from "./Row";
import Column from "./Column";
import ScrambleText from "./ScrambleText";
import SplitHeading from "./SplitHeading";
import MaskHeading from "./MaskHeading";
import { useEffect, useRef, useState } from "react";
import { BSpline } from "@/lib/BSpline";

export const ProjectLifecycle = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const list1Ref = useRef<HTMLUListElement>(null);
  const list2Ref = useRef<HTMLUListElement>(null);

  const [referencePoints, setReferencePoints] = useState<number[][]>();
  const [splinePoints, setSplinePoints] = useState<number[][]>();

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
      points.unshift([-100, 0]);

      // Insert one point after the first list to the right
      points.push([sectionRect.width + 400, points[points.length - 1][1] + 100]);

      list2Items?.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        points.push([itemRect.x + itemRect.width - sectionRect.x, itemRect.y - sectionRect.y]);
      });

      // Insert one point at the end to the bottom left of the last item
      points.push([-100, sectionRect.height]);

      var spline = new BSpline(points, 2, false);

      const tempPoints = [];
      for (var t = 0; t <= 1; t += 0.001) {
        tempPoints.push(spline.calcAt(t));
      }

      setReferencePoints(points);
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
  return (
    <section ref={sectionRef} className={styles.section}>
      <svg ref={svgRef} className={styles.svg} width="1000" height="1000" viewBox="0 0 1000 1000">
        {referencePoints?.map((point, i) => {
          return <circle key={`circle-${i}`} r={10} cx={point[0]} cy={point[1]} fill="red" />;
        })}
        {/* {splinePoints?.map((point, i) => {
          return <circle key={`spline-${i}`} r={5} cx={point[0]} cy={point[1]} fill="purple" />;
        })} */}

        <polyline
          points={splinePoints
            ?.map(([x, y]) => {
              return `${x},${y}`;
            })
            .join(" ")}
          stroke="#e5307c"
          strokeWidth={40}
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
                the spark of an idea throughout an asset's digital existence.
              </ScrambleText>
            </p>
          </Column>
        </Row>
        <div className={styles.section}>
          <h2>
            <MaskHeading reset={true}>Strategy & Collaboration</MaskHeading>
          </h2>
          <p>
            <ScrambleText reset={true}>Nice little summary statement</ScrambleText>
          </p>
          <ul ref={list1Ref} className={styles.list1}>
            <li>Research & Positioning</li>
            <li>Goals Outline</li>
            <li>Define Technical Approach</li>
            <li>Project Management</li>
          </ul>
        </div>
        <div className={styles.section}>
          <h2>
            <MaskHeading reset={true}>Planning & Design</MaskHeading>
          </h2>
          <p>
            <ScrambleText reset={true}>Nice little summary statement</ScrambleText>
          </p>
          <ul ref={list2Ref} className={styles.list2}>
            <li>Identify & Perception</li>
            <li>User Research / UX</li>
            <li>UI Design</li>
            <li>Art Direction</li>
            <li>Web / Motion Design</li>
          </ul>
        </div>
      </Container>
    </section>
  );
};
