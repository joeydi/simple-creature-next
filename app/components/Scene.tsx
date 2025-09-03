'use client'

import { PropsWithChildren } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'

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
        <directionalLight position={[5, 8, 5]} intensity={1} castShadow />

        {/* Controls */}
        <OrbitControls makeDefault enableDamping dampingFactor={0.1} />

        {/* Drop anything here – it will be centered on 0,0,0 */}
        {children}

        {/* Nice IBL so models look good out of the box */}
        <Environment preset="studio" backgroundIntensity={.1} environmentIntensity={.1} />

        <EffectComposer>
            <Bloom
              intensity={1} // The bloom intensity.
              // blurPass={undefined} // A blur pass.
              // kernelSize={KernelSize.LARGE} // blur kernel size
              luminanceThreshold={0.25} // luminance threshold. Raise this value to mask out darker elements in the scene.
              luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
              mipmapBlur={true} // Enables or disables mipmap blur.
              // resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
              // resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
            />
          <Noise opacity={0.025} />
          <Vignette eskil={false} offset={0.1} darkness={1} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
