import styles from "./Hero.module.scss";
import hero from "@/images/hero.png";
import Container from "@/components/Container";
import Row from "@/components/Row";
import Column from "@/components/Column";
import Image from "next/image";
import LogoDistortion from "./LogoDistortion";

const Hero = () => {
  return (
    <div className={styles.hero}>
      <Container>
        <div className={styles.heroGraphic}>
          <LogoDistortion />
          <Image className={styles.heroImage} src={hero} alt="" priority={true} />
        </div>
        <Row className="align-items-end">
          <Column lg="7">
            <h1>
              General
              <br /> Statement
            </h1>
          </Column>
          <Column lg="5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
            </p>
          </Column>
        </Row>
      </Container>
    </div>
  );
};
export default Hero;
