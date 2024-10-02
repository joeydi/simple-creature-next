import { useEffect, useRef } from "react";
// import gsap from "gsap";
import { setupGLContext, drawVideo } from "stacked-alpha-video/gl-helpers";
import styles from "./HeroVideo.module.scss";

export const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const ctx = setupGLContext(canvasRef.current);

    const update = () => {
      requestAnimationFrame(update);
      if (videoRef.current) {
        drawVideo(ctx, videoRef.current);
      }
    };

    requestAnimationFrame(update);
  }, []);

  return (
    <>
      <video ref={videoRef} className={styles.video} autoPlay playsInline muted loop src="/clothRock2_alpha.mp4"></video>
      <canvas ref={canvasRef} className={styles.canvas} width="1920" height="1080" />
    </>
  );
};
