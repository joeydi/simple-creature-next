"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { AnimatedGradient as AnimatedGradientShader } from "@/lib/animated-gradient-shader/animated-gradient-shader"

interface AnimatedGradientProps {
  colors?: string[]
  speed?: number
  amount?: number
  frequencyX?: number
  frequencyY?: number
  isAnimating?: boolean
}

export default function AnimatedGradient({
  colors,
  speed = 0.02,
  amount = 0.2,
  frequencyX = 3,
  frequencyY = 6,
  isAnimating = true,
}: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const gradientRef = useRef<AnimatedGradientShader | null>(null)
  const clockRef = useRef<THREE.Clock>(new THREE.Clock())
  const animationFrameIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 1
    cameraRef.current = camera

    // Calculate plane size to fill viewport
    const distance = camera.position.z
    const vFov = (camera.fov * Math.PI) / 180
    const planeHeightAtDistance = 2 * Math.tan(vFov / 2) * distance
    const planeWidthAtDistance = planeHeightAtDistance * camera.aspect
    const scaleFactor = 1.2

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    // Create animated gradient
    const gradient = new AnimatedGradientShader(scene, {
      colors,
      speed,
      amount,
      frequencyX,
      frequencyY,
      width: planeWidthAtDistance,
      height: planeHeightAtDistance,
      widthSegments: 200,
      heightSegments: 200,
    })
    if (gradient.mesh) {
      gradient.mesh.rotation.x = 0 // Face the camera
    }
    gradientRef.current = gradient

    // Update gradient mesh scale
    if (gradientRef.current.mesh) {
      gradientRef.current.mesh.scale.set(
        (planeWidthAtDistance / gradientRef.current.params.width) * scaleFactor,
        (planeHeightAtDistance / gradientRef.current.params.height) * scaleFactor,
        1,
      )
    }

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !gradientRef.current) return

      // Update camera
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()

      // Update renderer
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      // Recalculate plane size to fill new viewport
      const distance = cameraRef.current.position.z
      const vFov = (cameraRef.current.fov * Math.PI) / 180
      const planeHeightAtDistance = 2 * Math.tan(vFov / 2) * distance
      const planeWidthAtDistance = planeHeightAtDistance * cameraRef.current.aspect
      const scaleFactor = 1.2

      // Update gradient mesh scale
      if (gradientRef.current.mesh) {
        gradientRef.current.mesh.scale.set(
          (planeWidthAtDistance / gradientRef.current.params.width) * scaleFactor,
          (planeHeightAtDistance / gradientRef.current.params.height) * scaleFactor,
          1,
        )
      }
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }

      if (gradientRef.current) {
        gradientRef.current.dispose()
      }

      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [colors, speed, amount, frequencyX, frequencyY])

  // Control animation based on isAnimating state
  useEffect(() => {
    if (!rendererRef.current || !gradientRef.current || !clockRef.current || !cameraRef.current) return

    const animate = () => {
      if (isAnimating && rendererRef.current && gradientRef.current && clockRef.current && cameraRef.current) {
        const elapsedTime = clockRef.current.getElapsedTime()
        gradientRef.current.update(elapsedTime)
        rendererRef.current.render(sceneRef.current!, cameraRef.current)
        animationFrameIdRef.current = requestAnimationFrame(animate)
      }
    }

    if (isAnimating) {
      animate()
    } else {
      // Cancel animation
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
    }
  }, [isAnimating])

  return <canvas ref={canvasRef} className="absolute h-full w-full" />
}
