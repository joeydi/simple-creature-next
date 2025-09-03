'use client'

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";
import { RigidBody, Physics, BallCollider, RapierRigidBody, RapierCollider } from "@react-three/rapier";

import Scene from "@/components/Scene";
import { Model } from "@/components/Model";
import { SpringGroup } from '@/components/SpringGroup';
import { useSpringGroup } from '@/hooks/useSpringGroup';
import { Stats } from '@react-three/drei';

// Sphere component with random material and animation
interface AnimatedSphereProps {
  id?: number;
  position: [number, number, number];
  radius: number;
  materialType: 'metallic' | 'glass' | 'neon' | 'holographic' | 'plasma';
  color: string;
  type: 'sphere' | 'capsule' | 'box' | 'torus'
}

function AnimatedSphere({ position, radius, materialType, color, type }: AnimatedSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const originalPosition = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    if (!rigidBodyRef.current || !meshRef.current) return;

    // Gentle rotation every frame
    // meshRef.current.rotation.x += 0.003;
    // meshRef.current.rotation.y += 0.002;

    // Apply spring force only every few frames to prevent recursion
    const frameCount = Math.floor(state.clock.elapsedTime * 60);
    if (frameCount % 4 !== 0) return;

    // Get current position
    const currentPos = rigidBodyRef.current.translation();
    const current = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);

    // Spring force back to original position
    const distanceToOrigin = current.distanceTo(originalPosition);
    if (distanceToOrigin > 0.1) {
      const springForce = originalPosition.clone().sub(current).normalize().multiplyScalar(0.025);
      rigidBodyRef.current.applyImpulse({ x: springForce.x, y: springForce.y, z: springForce.z }, true);
    }
  });

  const material = useMemo(() => {
    switch (materialType) {
      case 'metallic':
        return (
          <meshStandardMaterial
            toneMapped={false}
            color={color}
            metalness={0.9}
            roughness={0.1}
          />
        );
      case 'glass':
        return (
          <meshPhysicalMaterial
            toneMapped={false}
            color={color}
            transmission={0.8}
            opacity={0.3}
            transparent
            roughness={0.1}
            thickness={0.5}
          />
        );
      case 'neon':
        return (
          <meshStandardMaterial
            toneMapped={false}
            color={color}
            emissive={color}
            emissiveIntensity={0.75}
          />
        );
      case 'holographic':
        return (
          <meshStandardMaterial
            toneMapped={false}
            color={color}
            metalness={0.7}
            roughness={0.3}
            envMapIntensity={2}
          />
        );
      case 'plasma':
        return (
          <meshStandardMaterial
            toneMapped={false}
            color={color}
            emissive={new THREE.Color(color).multiplyScalar(0.5)}
            emissiveIntensity={2}
            roughness={0.8}
          />
        );
      default:
        return <meshStandardMaterial color={color} />;
    }
  }, [materialType, color]);

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      type="dynamic"
      restitution={1}
      friction={1}
      linearDamping={1}
      angularDamping={0.5}
    >
      <mesh ref={meshRef} castShadow receiveShadow>
        {type === 'sphere' && <sphereGeometry args={[radius, 32, 32]} />}
        {type === 'capsule' && <capsuleGeometry args={[radius, radius*1.5, 32, 32]} />}
        {type === 'box' && <boxGeometry args={[radius, radius, radius]} />}
        {type === 'torus' && <torusGeometry args={[radius, radius/2]} />}
        {material}
      </mesh>
    </RigidBody>
  );
}

// Invisible mouse collider
function MouseCollider() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const colliderRef = useRef<RapierCollider>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useSpringGroup();
  const previousMouse = useRef(new THREE.Vector3());
  const currentScale = useRef(0.25);

  useFrame(() => {
    if (!rigidBodyRef.current || !colliderRef.current || !meshRef.current) return;

    // Calculate mouse velocity
    const currentMouse = mouse.clone();
    const velocity = currentMouse.distanceTo(previousMouse.current);
    previousMouse.current.copy(currentMouse);

    // Calculate target scale based on velocity
    const baseSize = 0.5
    const velocityMultiplier = Math.min(velocity * 8, 2);
    const targetScale = baseSize + velocityMultiplier;

    // Lerp current scale towards target (smooth transition)
    const lerpSpeed = 0.1;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, lerpSpeed);

    // Update collider size with lerped value
    colliderRef.current.setRadius(currentScale.current);

    // Move the collider to follow mouse position
    rigidBodyRef.current.setTranslation({ x: mouse.x, y: mouse.y, z: mouse.z }, true);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, 0, 0]}
      type="kinematicPosition"
      restitution={0}
    >
      <BallCollider ref={colliderRef} args={[1]} />
      <mesh ref={meshRef} visible={true}>
        <sphereGeometry args={[0, 16, 16]} />
        <meshBasicMaterial transparent opacity={1} color={'#ff0000'} />
      </mesh>
    </RigidBody>
  );
}

interface SphereCollectionProps {
  distanceFromCenter: number
  minRadius: number
  maxRadius: number
  numMeshes: number
  type: AnimatedSphereProps['type']
}
function SphereCollection({ distanceFromCenter = 3, minRadius = 0.25, maxRadius = 1, numMeshes = 5, type = 'sphere' }: SphereCollectionProps) {
  const spheres = useMemo(() => {
    // const materials: AnimatedSphereProps['materialType'][] = ['metallic', 'glass', 'neon', 'holographic', 'plasma'];
    const materials: AnimatedSphereProps['materialType'][] = ['glass', 'neon', 'plasma'];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    const positions: THREE.Vector3[] = [];

    const generateValidPosition = (attempts = 0): THREE.Vector3 => {
      if (attempts > 100) {
        // Fallback to avoid infinite loop
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const distance = distanceFromCenter + Math.random() * distanceFromCenter * 0.25;
        return new THREE.Vector3(
          distance * Math.sin(phi) * Math.cos(theta),
          distance * Math.sin(phi) * Math.sin(theta),
          distance * Math.cos(phi)
        );
      }

      // Generate random position on sphere surface at specified distance
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const distance = distanceFromCenter + Math.random() * distanceFromCenter * 0.25;

      const newPos = new THREE.Vector3(
        distance * Math.sin(phi) * Math.cos(theta),
        distance * Math.sin(phi) * Math.sin(theta),
        distance * Math.cos(phi)
      );

      // Check if position is at least 1 unit away from existing positions
      const tooClose = positions.some(pos => pos.distanceTo(newPos) < 1.0);

      if (tooClose) {
        return generateValidPosition(attempts + 1);
      }

      return newPos;
    };

    return Array.from({ length: numMeshes }, (_, i): AnimatedSphereProps => {
      const position = generateValidPosition();
      positions.push(position);

      const radius = minRadius + Math.random() * (maxRadius - minRadius);

      return {
        id: i,
        position: [position.x, position.y, position.z],
        radius: Math.max(0.1, radius),
        materialType: materials[i % materials.length],
        color: colors[Math.floor(Math.random() * colors.length)],
        type
      };
    });
  }, [distanceFromCenter, minRadius, maxRadius, numMeshes, type]);

  return (
    <>
      {spheres.map(sphere => (
        <AnimatedSphere
          key={sphere.id}
          position={sphere.position}
          radius={sphere.radius}
          materialType={sphere.materialType}
          color={sphere.color}
          type={type}
        />
      ))}
    </>
  );
}

function AnimatedModel({position = [0, 0, 0]}: {position?: [number, number, number]}) {
  const modelRef = useRef<THREE.Group>(null);
  const originalPosition = useMemo(() => new THREE.Vector3(...position), [position]);
  const currentPosition = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    if (!modelRef.current) return;

    // Apply position to mesh
    modelRef.current.position.copy(currentPosition);

    // Add rotation animation
    modelRef.current.rotation.x += Math.sin(state.clock.elapsedTime) * 0.001;
    modelRef.current.rotation.y += Math.cos(state.clock.elapsedTime) * 0.005;

    // Add subtle floating animation on top of physics
    const floatOffset = Math.sin(state.clock.elapsedTime + originalPosition.y) * 0.05;
    modelRef.current.position.y += floatOffset;
  });

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
    numMeshes: 24,
  };

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
  );
}
