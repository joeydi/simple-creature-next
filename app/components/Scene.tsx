"use client"

import { PropsWithChildren } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing"

type FullscreenSceneProps = PropsWithChildren<{
  /** Optional: camera position */
  camera?: [number, number, number]
  /** Optional: background color */
  bg?: string
}>

export default function Scene({
  children,
  camera = [0, 1, -5],
  // bg = '#6e16a0',
  bg = "#B944FC",
}: FullscreenSceneProps) {
  return (
    <div className="rounded-(--media-radius) aspect-video w-full overflow-hidden bg-[#6e16a0]">
      <Canvas shadows dpr={[1, 2]} camera={{ position: camera, fov: 50 }}>
        {/* Background */}
        <color attach="background" args={[bg]} />

        {/* Lights */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 8, 5]} intensity={1} castShadow />

        {/* Controls */}
        {/* <OrbitControls makeDefault enableDamping dampingFactor={0.1} /> */}

        {/* Drop anything here – it will be centered on 0,0,0 */}
        {children}

        {/* Nice IBL so models look good out of the box */}
        <Environment preset="studio" backgroundIntensity={0.1} environmentIntensity={0.1} />

        <EffectComposer>
          <Bloom luminanceThreshold={0.5} intensity={1.5} levels={9} mipmapBlur />
          <Noise opacity={0.025} />
          <Vignette eskil={false} offset={0.1} darkness={1} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
