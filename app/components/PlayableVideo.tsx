"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { usePlayableVideoAudio } from "@/contexts/PlayableVideoContext"
import styles from "./PlayableVideo.module.scss"

type PlayableVideoProps = {
  src: string
  poster?: string
  width?: number
  height?: number
  className?: string
}

const Play = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712"
    />
  </svg>
)

const Pause = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M16 19q-.825 0-1.412-.587T14 17V7q0-.825.588-1.412T16 5t1.413.588T18 7v10q0 .825-.587 1.413T16 19m-8 0q-.825 0-1.412-.587T6 17V7q0-.825.588-1.412T8 5t1.413.588T10 7v10q0 .825-.587 1.413T8 19"
    />
  </svg>
)

const VolumeOn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M19 11.975q0-2.075-1.1-3.787t-2.95-2.563q-.375-.175-.55-.537t-.05-.738q.15-.4.538-.575t.787 0Q18.1 4.85 19.55 7.063T21 11.974t-1.45 4.913t-3.875 3.287q-.4.175-.788 0t-.537-.575q-.125-.375.05-.737t.55-.538q1.85-.85 2.95-2.562t1.1-3.788M7 15H4q-.425 0-.712-.288T3 14v-4q0-.425.288-.712T4 9h3l3.3-3.3q.475-.475 1.088-.213t.612.938v11.15q0 .675-.612.938T10.3 18.3zm9.5-3q0 1.05-.475 1.988t-1.25 1.537q-.25.15-.513.013T14 15.1V8.85q0-.3.263-.437t.512.012q.775.625 1.25 1.575t.475 2"
    />
  </svg>
)

const VolumeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M16.775 19.575q-.275.175-.55.325t-.575.275q-.375.175-.762 0t-.538-.575q-.15-.375.038-.737t.562-.538q.1-.05.188-.1t.187-.1L12 14.8v2.775q0 .675-.612.938T10.3 18.3L7 15H4q-.425 0-.712-.288T3 14v-4q0-.425.288-.712T4 9h2.2L2.1 4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l17 17q.275.275.275.7t-.275.7t-.7.275t-.7-.275zm2.225-7.6q0-2.075-1.1-3.787t-2.95-2.563q-.375-.175-.55-.537t-.05-.738q.15-.4.538-.575t.787 0Q18.1 4.85 19.55 7.05T21 11.975q0 .825-.15 1.638t-.425 1.562q-.2.55-.612.688t-.763.012t-.562-.45t-.013-.75q.275-.65.4-1.312T19 11.975m-4.225-3.55Q15.6 8.95 16.05 10t.45 2v.25q0 .125-.025.25q-.05.325-.35.425t-.55-.15L14.3 11.5q-.15-.15-.225-.337T14 10.775V8.85q0-.3.263-.437t.512.012M9.75 6.95Q9.6 6.8 9.6 6.6t.15-.35l.55-.55q.475-.475 1.087-.213t.613.938V8q0 .35-.3.475t-.55-.125z"
    />
  </svg>
)

const Fullscreen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M5 19h2q.425 0 .713.288T8 20t-.288.713T7 21H4q-.425 0-.712-.288T3 20v-3q0-.425.288-.712T4 16t.713.288T5 17zm14 0v-2q0-.425.288-.712T20 16t.713.288T21 17v3q0 .425-.288.713T20 21h-3q-.425 0-.712-.288T16 20t.288-.712T17 19zM5 5v2q0 .425-.288.713T4 8t-.712-.288T3 7V4q0-.425.288-.712T4 3h3q.425 0 .713.288T8 4t-.288.713T7 5zm14 0h-2q-.425 0-.712-.288T16 4t.288-.712T17 3h3q.425 0 .713.288T21 4v3q0 .425-.288.713T20 8t-.712-.288T19 7z"
    />
  </svg>
)

const FullscreenExit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M6 18H4q-.425 0-.712-.288T3 17t.288-.712T4 16h3q.425 0 .713.288T8 17v3q0 .425-.288.713T7 21t-.712-.288T6 20zm12 0v2q0 .425-.288.713T17 21t-.712-.288T16 20v-3q0-.425.288-.712T17 16h3q.425 0 .713.288T21 17t-.288.713T20 18zM6 6V4q0-.425.288-.712T7 3t.713.288T8 4v3q0 .425-.288.713T7 8H4q-.425 0-.712-.288T3 7t.288-.712T4 6zm12 0h2q.425 0 .713.288T21 7t-.288.713T20 8h-3q-.425 0-.712-.288T16 7V4q0-.425.288-.712T17 3t.713.288T18 4z"
    />
  </svg>
)

export function PlayableVideo({ src, poster, width, height, className }: PlayableVideoProps) {
  const id = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [hasBeenNear, setHasBeenNear] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const { ownerId, claim, release } = usePlayableVideoAudio()
  const audioEnabled = ownerId === id

  useEffect(() => {
    if (hasBeenNear) return
    const el = videoRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasBeenNear(true)
          io.disconnect()
        }
      },
      { rootMargin: "200px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasBeenNear])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => setIsVisible(entries[0]?.isIntersecting ?? false), {
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el || !hasBeenNear) return
    if (isVisible) {
      el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [hasBeenNear, isVisible])

  useEffect(() => {
    if (!isVisible) {
      if (audioEnabled) release(id)
      setIsActive(false)
      setControlsVisible(false)
    }
  }, [isVisible, audioEnabled, release, id])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.muted = !audioEnabled
  }, [audioEnabled])

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === containerRef.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const onTimeUpdate = () => setCurrentTime(el.currentTime)
    const onLoadedMetadata = () => setDuration(el.duration)
    const onPlay = () => setIsPaused(false)
    const onPause = () => setIsPaused(true)
    el.addEventListener("timeupdate", onTimeUpdate)
    el.addEventListener("loadedmetadata", onLoadedMetadata)
    el.addEventListener("play", onPlay)
    el.addEventListener("pause", onPause)
    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate)
      el.removeEventListener("loadedmetadata", onLoadedMetadata)
      el.removeEventListener("play", onPlay)
      el.removeEventListener("pause", onPause)
    }
  }, [])

  const hideTimer = useRef<number | null>(null)
  const showControlsTemporarily = useCallback(() => {
    if (!isActive) return
    setControlsVisible(true)
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    if (!isPaused) {
      hideTimer.current = window.setTimeout(() => setControlsVisible(false), 3000)
    }
  }, [isActive, isPaused])

  useEffect(() => {
    if (isActive) showControlsTemporarily()
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [isActive, showControlsTemporarily])

  const activate = () => {
    setIsActive(true)
    claim(id)
    setControlsVisible(true)
  }

  const togglePlay = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      el.play().catch(() => {})
    } else {
      el.pause()
    }
  }

  const toggleAudio = () => {
    if (audioEnabled) {
      release(id)
    } else {
      claim(id)
    }
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = videoRef.current
    if (!el) return
    el.currentTime = Number(e.target.value)
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    } else {
      containerRef.current?.requestFullscreen?.()
    }
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className ?? ""}`}
      onMouseMove={showControlsTemporarily}
      onClick={showControlsTemporarily}
    >
      <video
        ref={videoRef}
        src={hasBeenNear ? src : undefined}
        poster={poster}
        width={width}
        height={height}
        preload="none"
        loop
        muted
        playsInline
        className={styles.video}
      />

      {!isActive && (
        <button type="button" className={styles.bigPlay} onClick={activate} aria-label="Play with sound">
          <Play />
        </button>
      )}

      {isActive && (
        <div className={`${styles.controls} ${controlsVisible ? styles.visible : ""}`}>
          <button type="button" className={styles.button} onClick={togglePlay} aria-label={isPaused ? "Play" : "Pause"}>
            {isPaused ? <Play /> : <Pause />}
          </button>
          <input
            type="range"
            className={styles.scrubber}
            style={{ "--progress": `${duration ? (currentTime / duration) * 100 : 0}%` } as React.CSSProperties}
            min={0}
            max={duration || 0}
            step={0.01}
            value={currentTime}
            onChange={seek}
            aria-label="Seek"
          />
          <button
            type="button"
            className={styles.button}
            onClick={toggleAudio}
            aria-label={audioEnabled ? "Mute" : "Unmute"}
          >
            {audioEnabled ? <VolumeOff /> : <VolumeOn />}
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </button>
        </div>
      )}
    </div>
  )
}
