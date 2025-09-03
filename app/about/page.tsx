'use client'

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";
import { RigidBody, Physics } from "@react-three/rapier";

import Scene from "@/components/Scene";
import { Model } from "@/components/Model";
import { SpringGroup } from '@/components/SpringGroup';
import { useSpringGroup } from '@/hooks/useSpringGroup';

// Sphere component with random material and animation
interface AnimatedSphereProps {
  id?: number;
  position: [number, number, number];
  radius: number;
  materialType: 'metallic' | 'glass' | 'neon' | 'holographic' | 'plasma';
  color: string;
}

function AnimatedSphere({ position, radius, materialType, color }: AnimatedSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const rigidBodyRef = useRef<any>(null);
  const originalPosition = useMemo(() => new THREE.Vector3(...position), [position]);
  const { mouse } = useSpringGroup();

  useFrame((state) => {
    if (!rigidBodyRef.current || !meshRef.current) return;

    // Gentle rotation every frame
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.002;

    // Apply forces only every few frames to prevent recursion
    const frameCount = Math.floor(state.clock.elapsedTime * 60);
    if (frameCount % 4 !== 0) return;

    // Get current position
    const currentPos = rigidBodyRef.current.translation();
    const current = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);

    // Spring force back to original position (use impulse instead of force)
    const distanceToOrigin = current.distanceTo(originalPosition);
    if (distanceToOrigin > 0.1) {
      const springForce = originalPosition.clone().sub(current).normalize().multiplyScalar(0.02);
      rigidBodyRef.current.applyImpulse({ x: springForce.x, y: springForce.y, z: springForce.z }, true);
    }

    // Mouse repulsion force
    const mouseDistance = current.distanceTo(mouse);
    if (mouseDistance < 2 && mouseDistance > 0.1) {
      const repelDirection = current.clone().sub(mouse).normalize();
      const repelStrength = (2 - mouseDistance) * 0.05;
      const repelForce = repelDirection.multiplyScalar(repelStrength);
      rigidBodyRef.current.applyImpulse({ x: repelForce.x, y: repelForce.y, z: repelForce.z }, true);
    }
  });

  const material = useMemo(() => {
    switch (materialType) {
      case 'metallic':
        return (
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
          />
        );
      case 'glass':
        return (
          <meshPhysicalMaterial
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
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
          />
        );
      case 'holographic':
        return (
          <meshStandardMaterial
            color={color}
            metalness={0.7}
            roughness={0.3}
            envMapIntensity={2}
          />
        );
      case 'plasma':
        return (
          <meshStandardMaterial
            color={color}
            emissive={new THREE.Color(color).multiplyScalar(0.2)}
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
      restitution={0.6}
      friction={0.3}
      linearDamping={2}
      angularDamping={1.5}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        {material}
      </mesh>
    </RigidBody>
  );
}

// Main sphere collection component
function SphereCollection({ distanceFromCenter = 3, minRadius = 0.25, maxRadius = 1, numMeshes = 5 }) {
  const spheres = useMemo(() => {
    const materials: AnimatedSphereProps['materialType'][] = ['metallic', 'glass', 'neon', 'holographic', 'plasma'];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];

    return Array.from({ length: numMeshes }, (_, i): AnimatedSphereProps => {
      // Generate random position on sphere surface at specified distance
      const theta = Math.random() * Math.PI * 2; // azimuthal angle
      const phi = Math.acos(2 * Math.random() - 1); // polar angle (uniform distribution)

      const distance = distanceFromCenter + Math.random() * distanceFromCenter * 0.00025; // Add some distance variation

      const x = distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta);
      const z = distance * Math.cos(phi);

      const radius = minRadius + Math.random() * (maxRadius - minRadius);

      return {
        id: i,
        position: [x, y, z],
        radius: Math.max(0.1, radius),
        materialType: materials[i % materials.length],
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });
  }, [distanceFromCenter, minRadius, maxRadius, numMeshes]);

  return (
    <>
      {spheres.map(sphere => (
        <AnimatedSphere
          key={sphere.id}
          position={sphere.position}
          radius={sphere.radius}
          materialType={sphere.materialType}
          color={sphere.color}
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
    distanceFromCenter: 1,
    minRadius: 0.25,
    maxRadius: 0.25,
    numMeshes: 48,
  };

  return (
    <Scene>
      <SpringGroup>
        <Physics
          gravity={[0, 0, 0]}
          debug={false}
        >
          <AnimatedModel />
          <SphereCollection
            key={`${sphereProps.distanceFromCenter}-${sphereProps.minRadius}-${sphereProps.maxRadius}-${sphereProps.numMeshes}`}
            distanceFromCenter={sphereProps.distanceFromCenter}
            minRadius={sphereProps.minRadius}
            maxRadius={sphereProps.maxRadius}
            numMeshes={sphereProps.numMeshes}
          />
        </Physics>
      </SpringGroup>
    </Scene>
  );
}
