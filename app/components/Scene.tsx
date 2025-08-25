'use client'

import { PropsWithChildren } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

type FullscreenSceneProps = PropsWithChildren<{
  /** Optional: camera position */
  camera?: [number, number, number]
  /** Optional: background color */
  bg?: string
}>

export default function Scene({
  children,
  camera = [2, 1.5, -2],
  bg = '#0b0f14',
}: FullscreenSceneProps) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: camera, fov: 50 }}
      >
        {/* Background */}
        <color attach="background" args={[bg]} />

        {/* Lights */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} castShadow />

        {/* Controls */}
        <OrbitControls makeDefault enableDamping dampingFactor={0.1} />

        {/* Drop anything here – it will be centered on 0,0,0 */}
        {children}

        {/* Nice IBL so models look good out of the box */}
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
