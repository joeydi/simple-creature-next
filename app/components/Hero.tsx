'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Hero.module.scss'
// import hero from "@/images/hero.png";
import Container from '@/components/Container'
import Row from '@/components/Row'
import Column from '@/components/Column'
// import Image from "next/image";
import LogoDistortion from './LogoDistortion'
import ScrambleText from '@/components/ScrambleText'
import SplitHeading from './SplitHeading'
import { HeroVideo } from './HeroVideo'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  //   const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    gsap.to(logoRef.current, {
      yPercent: 80,
      ease: 'none',
      scrollTrigger: {
        trigger: 'main',
        start: 'top top',
        endTrigger: heroRef.current,
        end: 'bottom top',
        scrub: true,
      },
    })

    // gsap.to(imageRef.current, {
    //   yPercent: 40,
    //   ease: "none",
    //   scrollTrigger: {
    //     trigger: "main",
    //     start: "top top",
    //     endTrigger: heroRef.current,
    //     end: "bottom top",
    //     scrub: true,
    //   },
    // });
  })

  //   const loadHandler = () => {
  //     gsap.to(imageRef.current, {
  //       opacity: 1,
  //       duration: 1,
  //     });
  //   };

  return (
    <div className={styles.hero} ref={heroRef}>
      <Container>
        <div className={styles.heroGraphic}>
          <div ref={logoRef} className={styles.heroLogo}>
            <LogoDistortion />
          </div>
          {/* <Image ref={imageRef} className={styles.heroImage} src={hero} alt="" priority={true} onLoad={loadHandler} /> */}
          <HeroVideo />
        </div>
        <Row className="align-items-end">
          <Column lg="7">
            <h1>
              <SplitHeading>
                Technically <br />
                Creative
              </SplitHeading>
            </h1>
          </Column>
          <Column lg="5">
            <p data-lag="0.05">
              <ScrambleText>
                Since 2014, we&rsquo;ve been quietly threading technical craft into the fabric of our work—never loud, always present, and always in service of
                the story at the center.
              </ScrambleText>
            </p>
          </Column>
        </Row>
      </Container>
    </div>
  )
}
export default Hero
