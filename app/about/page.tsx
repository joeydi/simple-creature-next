"use client"

import React, { useRef, useMemo, useEffect } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { RigidBody, Physics, BallCollider, RapierRigidBody, RapierCollider, useSpringJoint } from "@react-three/rapier"

import Scene from "@/components/Scene"
import { Model } from "@/components/Model"
import { SpringGroup } from "@/components/SpringGroup"
import { useSpringGroup } from "@/hooks/useSpringGroup"
import { Stats } from "@react-three/drei"

// Sphere component with random material and animation
interface AnimatedSphereProps {
  id?: string
  position: [number, number, number]
  radius: number
  materialType: "glass" | "glass2" | "neon" | "plasma"
  color: string
  type: "sphere" | "capsule" | "box" | "torus"
}

function AnimatedSphere({ id, position, radius, materialType, color, type }: AnimatedSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const anchorRef = useRef<RapierRigidBody>(null)
  const { mouse, draggedSphereId, setDraggedSphereId } = useSpringGroup()

  const sphereId = useMemo(() => `sphere-${id || Math.random()}`, [id])
  const isDragging = draggedSphereId === sphereId
  const originalPosition = useMemo(() => new THREE.Vector3(...position), [position])
  const previousDragging = useRef(false)

  const mass = 1
  const springRestLength = 0

  // Different spring parameters for dragging vs resting
  const restingStiffness = 4
  const draggingStiffness = 1000 // Very high stiffness for tight following
  const restingDamping = 1.0 * Math.sqrt(restingStiffness * mass)
  const draggingDamping = 200 * Math.sqrt(draggingStiffness * mass) // High damping to prevent oscillation

  const currentStiffness = isDragging ? draggingStiffness : restingStiffness
  const currentDamping = isDragging ? draggingDamping : restingDamping

  if (isDragging) {
    console.log({ currentStiffness, currentDamping })
  }

  // Create spring joint between the sphere and a fixed anchor point
  useSpringJoint(rigidBodyRef, anchorRef, [
    [0, 0, 0], // Attach point on sphere (center)
    [0, 0, 0], // Attach point on anchor (center)
    springRestLength,
    currentStiffness,
    currentDamping,
  ])

  // Handle click detection and dragging
  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    setDraggedSphereId(sphereId)
  }

  const handlePointerUp = () => {
    setDraggedSphereId(null)
  }

  // Add global mouse up event listener to handle mouse release anywhere
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      setDraggedSphereId(null)
    }

    window.addEventListener("pointerup", handleGlobalPointerUp)
    window.addEventListener("mouseup", handleGlobalPointerUp)

    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp)
      window.removeEventListener("mouseup", handleGlobalPointerUp)
    }
  }, [setDraggedSphereId])

  // Track current anchor position for lerping
  const currentAnchorPos = useRef(new THREE.Vector3(...position))

  // Update anchor position when dragging
  useFrame(() => {
    if (!anchorRef.current) return

    if (isDragging) {
      // Update anchor to follow mouse position
      anchorRef.current.setTranslation({ x: mouse.x, y: mouse.y, z: mouse.z }, true)
      currentAnchorPos.current.set(mouse.x, mouse.y, mouse.z)
    } else {
      // Lerp anchor back to original position
      const lerpSpeed = 0.2 // Adjust this for faster/slower return (0.01 = slow, 0.1 = fast)
      currentAnchorPos.current.lerp(originalPosition, lerpSpeed)

      anchorRef.current.setTranslation(
        {
          x: currentAnchorPos.current.x,
          y: currentAnchorPos.current.y,
          z: currentAnchorPos.current.z,
        },
        true
      )
    }

    previousDragging.current = isDragging
  })

  const initialRotation: [number, number, number] = useMemo(() => {
    return [Math.PI * Math.random(), Math.PI * Math.random(), Math.PI * Math.random()]
  }, [])

  const material = useMemo(() => {
    console.log(materialType)

    switch (materialType) {
      case "glass":
        return (
          <meshPhysicalMaterial
            toneMapped={false}
            color={"#fff"}
            transmission={0.9}
            // opacity={0.75}
            // transparent
            ior={1.5}
            roughness={0.1}
            thickness={0.5}
            emissive={new THREE.Color(color).multiplyScalar(0.25)}
            emissiveIntensity={2}
          />
        )
      case "glass2":
        return (
          <meshPhysicalMaterial
            toneMapped={false}
            color={color}
            transmission={0.6}
            // opacity={0.75}
            // transparent
            ior={1.5}
            roughness={0.1}
            thickness={0.5}
            emissive={new THREE.Color(color).multiplyScalar(0.25)}
            emissiveIntensity={2}
          />
        )
      case "neon":
        return (
          <meshPhysicalMaterial
            toneMapped={false}
            color={color}
            ior={1.4}
            // transparent
            // transmission={0.4}
            roughness={0.25}
            thickness={0.75}
            emissive={new THREE.Color(color).multiplyScalar(0.5)}
            emissiveIntensity={0.5}
          />
        )
      case "plasma":
        return (
          <meshPhysicalMaterial
            toneMapped={false}
            color={color}
            ior={1.2}
            // transparent
            // transmission={0.2}
            emissive={new THREE.Color(color).multiplyScalar(0.5)}
            emissiveIntensity={2}
            roughness={1}
          />
        )
      default:
        return <meshStandardMaterial color={color} />
    }
  }, [materialType, color])

  return (
    <>
      {/* Fixed anchor point at the original position */}
      <RigidBody ref={anchorRef} position={position} type="kinematicPosition" canSleep={true}>
        <mesh visible={false}>
          <boxGeometry args={[0.01, 0.01, 0.01]} />
          <meshBasicMaterial />
        </mesh>
      </RigidBody>

      {/* The actual dynamic sphere */}
      <RigidBody
        ref={rigidBodyRef}
        position={position}
        type="dynamic"
        restitution={1}
        friction={1}
        linearDamping={1}
        angularDamping={0.5}
        rotation={initialRotation}
      >
        <mesh ref={meshRef} castShadow receiveShadow onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
          {type === "sphere" && <sphereGeometry args={[radius, 32, 32]} />}
          {type === "capsule" && <capsuleGeometry args={[radius, radius * 1.5, 32, 32]} />}
          {type === "box" && <boxGeometry args={[radius, radius, radius]} />}
          {type === "torus" && <torusGeometry args={[radius, radius / 2, 24, 24]} />}
          {material}
        </mesh>
      </RigidBody>
    </>
  )
}

// Invisible mouse collider
function MouseCollider() {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const colliderRef = useRef<RapierCollider>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse, draggedSphereId } = useSpringGroup()
  const previousMouse = useRef(new THREE.Vector3())
  const currentScale = useRef(0.25)

  useFrame(() => {
    if (!rigidBodyRef.current || !colliderRef.current || !meshRef.current) return

    // Disable MouseCollider when a sphere is being dragged
    if (draggedSphereId) {
      // Disable the collider by setting its radius to 0
      colliderRef.current.setRadius(0)
      return
    }

    // Calculate mouse velocity
    const currentMouse = mouse.clone()
    const velocity = currentMouse.distanceTo(previousMouse.current)
    previousMouse.current.copy(currentMouse)

    // Calculate target scale based on velocity
    const baseSize = 0
    const velocityMultiplier = Math.min(velocity * 8, 2)
    const targetScale = baseSize + velocityMultiplier

    // Lerp current scale towards target (smooth transition)
    const lerpSpeed = 0.1
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, lerpSpeed)

    // Update collider size with lerped value
    colliderRef.current.setRadius(currentScale.current)

    // Move the collider to follow mouse position
    rigidBodyRef.current.setTranslation({ x: mouse.x, y: mouse.y, z: mouse.z }, true)
  })

  return (
    <RigidBody ref={rigidBodyRef} position={[0, 0, 0]} type="kinematicPosition" restitution={0}>
      <BallCollider ref={colliderRef} args={[1]} />
      <mesh ref={meshRef} visible={true}>
        <sphereGeometry args={[0, 16, 16]} />
        <meshBasicMaterial transparent opacity={1} color={"#ff0000"} />
      </mesh>
    </RigidBody>
  )
}

interface SphereCollectionProps {
  distanceFromCenter: number
  minRadius: number
  maxRadius: number
  numMeshes: number
  type: AnimatedSphereProps["type"]
}
function SphereCollection({
  distanceFromCenter = 3,
  minRadius = 0.25,
  maxRadius = 1,
  numMeshes = 5,
  type = "sphere",
}: SphereCollectionProps) {
  const spheres = useMemo(() => {
    // const materials: AnimatedSphereProps['materialType'][] = ['metallic', 'glass', 'neon', 'holographic', 'plasma'];
    const materials: AnimatedSphereProps["materialType"][] = ["glass", "glass2", "neon", "plasma"]
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd"]
    const positions: THREE.Vector3[] = []

    const generateValidPosition = (attempts = 0): THREE.Vector3 => {
      if (attempts > 100) {
        // Fallback to avoid infinite loop
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const distance = distanceFromCenter + Math.random() * distanceFromCenter * 0.25
        return new THREE.Vector3(
          distance * Math.sin(phi) * Math.cos(theta),
          distance * Math.sin(phi) * Math.sin(theta),
          distance * Math.cos(phi)
        )
      }

      // Generate random position on sphere surface at specified distance
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const distance = distanceFromCenter + Math.random() * distanceFromCenter * 0.25

      const newPos = new THREE.Vector3(
        distance * Math.sin(phi) * Math.cos(theta),
        distance * Math.sin(phi) * Math.sin(theta),
        distance * Math.cos(phi)
      )

      // Check if position is at least 1 unit away from existing positions
      const tooClose = positions.some((pos) => pos.distanceTo(newPos) < 1.0)

      if (tooClose) {
        return generateValidPosition(attempts + 1)
      }

      return newPos
    }

    return Array.from({ length: numMeshes }, (_, i): AnimatedSphereProps => {
      const position = generateValidPosition()
      positions.push(position)

      const radius = minRadius + Math.random() * (maxRadius - minRadius)

      return {
        id: `${type}-${i}`,
        position: [position.x, position.y, position.z],
        radius: Math.max(0.1, radius),
        materialType: materials[i % materials.length],
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
      }
    })
  }, [distanceFromCenter, minRadius, maxRadius, numMeshes, type])

  return (
    <>
      {spheres.map((sphere) => (
        <AnimatedSphere
          key={sphere.id}
          id={sphere.id}
          position={sphere.position}
          radius={sphere.radius}
          materialType={sphere.materialType}
          color={sphere.color}
          type={type}
        />
      ))}
    </>
  )
}

function AnimatedModel({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const modelRef = useRef<THREE.Group>(null)
  const originalPosition = useMemo(() => new THREE.Vector3(...position), [position])
  const currentPosition = useMemo(() => new THREE.Vector3(...position), [position])

  useFrame((state) => {
    if (!modelRef.current) return

    // Apply position to mesh
    modelRef.current.position.copy(currentPosition)

    // Add rotation animation
    modelRef.current.rotation.x += Math.sin(state.clock.elapsedTime) * 0.001
    modelRef.current.rotation.y += Math.cos(state.clock.elapsedTime) * 0.005

    // Add subtle floating animation on top of physics
    const floatOffset = Math.sin(state.clock.elapsedTime + originalPosition.y) * 0.05
    modelRef.current.position.y += floatOffset
  })

  return (
    <group ref={modelRef}>
      <Model src="/models/jd_native_c4d.gltf" position={[0, -0.5, 0]} />
    </group>
  )
}

export default function About() {
  const sphereProps = {
    distanceFromCenter: 1.5,
    minRadius: 0.2,
    maxRadius: 0.25,
    numMeshes: 8,
  }

  return (
    <Scene>
      <SpringGroup>
        <Physics
          gravity={[0, 0, 0]}
          // debug={true}
        >
          <MouseCollider />
          <RigidBody type="kinematicPosition">
            <AnimatedModel />
          </RigidBody>
          <SphereCollection
            key={`sphere-${sphereProps.distanceFromCenter}-${sphereProps.minRadius}-${sphereProps.maxRadius}-${sphereProps.numMeshes}`}
            distanceFromCenter={sphereProps.distanceFromCenter}
            minRadius={sphereProps.minRadius}
            maxRadius={sphereProps.maxRadius}
            numMeshes={sphereProps.numMeshes}
            type="sphere"
          />
          <SphereCollection
            key={`capsule-${sphereProps.distanceFromCenter}-${sphereProps.minRadius}-${sphereProps.maxRadius}-${sphereProps.numMeshes}`}
            distanceFromCenter={sphereProps.distanceFromCenter}
            minRadius={sphereProps.minRadius}
            maxRadius={sphereProps.maxRadius}
            numMeshes={sphereProps.numMeshes}
            type="capsule"
          />
          <SphereCollection
            key={`torus-${sphereProps.distanceFromCenter}-${sphereProps.minRadius}-${sphereProps.maxRadius}-${sphereProps.numMeshes}`}
            distanceFromCenter={sphereProps.distanceFromCenter}
            minRadius={sphereProps.minRadius}
            maxRadius={sphereProps.maxRadius}
            numMeshes={sphereProps.numMeshes}
            type="torus"
          />
        </Physics>
      </SpringGroup>
      <Stats />
    </Scene>
  )
}
