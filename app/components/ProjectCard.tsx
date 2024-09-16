import Image from "next/image";
import styles from "./ProjectCard.module.scss";
import posterImage from "@/images/aston-martin-tach-ui.jpg";
import ScrambleText from "@/components/ScrambleText";

const ProjectCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.mask}>
        <Image className={styles.image} src={posterImage} alt="" />
      </div>
      <div className={styles.content}>
        <h2>Think MD</h2>
        <p>
          <ScrambleText>Mobile App Design</ScrambleText>
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
