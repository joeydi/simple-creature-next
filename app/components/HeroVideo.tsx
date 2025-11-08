import { useEffect, useRef } from "react"
import { setupGLContext, drawVideo } from "stacked-alpha-video/gl-helpers"

export const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) {
      return
    }

    const ctx = setupGLContext(canvasRef.current)
    let animationFrameId: number

    const update = () => {
      animationFrameId = requestAnimationFrame(update)
      if (videoRef.current) {
        drawVideo(ctx, videoRef.current)
      }
    }

    animationFrameId = requestAnimationFrame(update)

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      <video
        ref={videoRef}
        className="z-100 pointer-events-none absolute left-0 top-0 aspect-video w-full opacity-0"
        autoPlay
        playsInline
        muted
        loop
        src="/clothRock2_alpha.mp4"
      ></video>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute bottom-0 left-0 aspect-video w-full"
        width="1920"
        height="1080"
      />
    </>
  )
}
