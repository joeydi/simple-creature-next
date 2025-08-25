'use client'

import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { ThreeElements } from '@react-three/fiber'

type PrimitiveProps = Omit<ThreeElements['primitive'], 'object'>

type ModelProps = PrimitiveProps & {
  src: string
}

/**
 * Loads a GLB and exposes it as a <primitive/> so you can pass scale/rotation/etc.
 * Used inside <Center> so it appears at the origin and is easy to orbit.
 */
export function Model({ src, ...props }: ModelProps) {
  const gltf = useGLTF(src)
  // Optional: turn on shadows if the mesh supports it
  gltf.scene.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      const m = o as THREE.Mesh
      m.castShadow = true
      m.receiveShadow = true
    }
  })
  return <primitive object={gltf.scene} {...props} />
}
