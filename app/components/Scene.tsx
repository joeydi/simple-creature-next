'use client'

import { PropsWithChildren } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, AccumulativeShadows, RandomizedLight } from '@react-three/drei'
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'

type FullscreenSceneProps = PropsWithChildren<{
  /** Optional: camera position */
  camera?: [number, number, number]
  /** Optional: background color */
  bg?: string
}>

export default function Scene({
  children,
  camera = [0, 1, -3],
  // bg = '#6e16a0',
  bg = '#B944FC',
}: FullscreenSceneProps) {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#6e16a0' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: camera, fov: 50 }}
      >
        {/* Background */}
        <color attach="background" args={[bg]} />

        {/* Lights */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 8, 5]} intensity={4} castShadow />
        {/* <AccumulativeShadows temporal frames={100} alphaTest={0.9} color="#3ead5d" colorBlend={1} opacity={0.8} scale={20}>
          <RandomizedLight radius={10} ambient={0.5} intensity={Math.PI} position={[2.5, 8, -2.5]} bias={0.001} />
        </AccumulativeShadows> */}

        {/* Controls */}
        <OrbitControls makeDefault enableDamping dampingFactor={0.1} />

        {/* Drop anything here – it will be centered on 0,0,0 */}
        {children}

        {/* Nice IBL so models look good out of the box */}
        <Environment preset="studio" backgroundIntensity={.1} environmentIntensity={.1} />

        <EffectComposer>
          {/* <DepthOfField focusDistance={0} focalLength={0.0075} bokehScale={1} height={480} /> */}
          <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.9} height={100} />
          <Noise opacity={0.025} />
          <Vignette eskil={false} offset={0.1} darkness={1} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
