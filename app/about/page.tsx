'use client'

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";

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
  // Spring physics configuration
  const SPRING_CONFIG = {
    tension: 1000,
    friction: 50,
    mass: 1
  };

  const CURSOR_FORCE_RADIUS = 2;
  const CURSOR_FORCE_STRENGTH = 1.5;

  const meshRef = useRef<THREE.Mesh>(null);
  const originalPosition = useMemo(() => new THREE.Vector3(...position), [position]);
  const currentPosition = useMemo(() => new THREE.Vector3(...position), [position]);
  const velocity = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const { mouse } = useSpringGroup();

  useFrame((state) => {
    if (!meshRef.current) return;

    // Calculate distance from mouse to sphere
    const mouseDistance = currentPosition.distanceTo(mouse);

    // Apply cursor force (repulsion)
    const force = new THREE.Vector3();
    if (mouseDistance < CURSOR_FORCE_RADIUS && mouseDistance > 0) {
      const forceDirection = currentPosition.clone().sub(mouse).normalize();
      const forceStrength = (1 - mouseDistance / CURSOR_FORCE_RADIUS) * CURSOR_FORCE_STRENGTH;
      force.copy(forceDirection.multiplyScalar(forceStrength));
    }

    // Spring force back to original position
    const springForce = originalPosition.clone()
      .sub(currentPosition)
      .multiplyScalar(SPRING_CONFIG.tension / 1000);

    // Damping force
    const dampingForce = velocity.clone().multiplyScalar(-SPRING_CONFIG.friction / 1000);

    // Apply all forces
    const totalForce = force.add(springForce).add(dampingForce);

    // Update velocity and position using simple physics integration
    velocity.add(totalForce.multiplyScalar(1 / SPRING_CONFIG.mass));
    currentPosition.add(velocity.clone().multiplyScalar(0.016)); // 60fps assumption

    // Apply position to mesh
    meshRef.current.position.copy(currentPosition);

    // Add rotation animation
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.005;

    // Add subtle floating animation on top of physics
    const floatOffset = Math.sin(state.clock.elapsedTime + originalPosition.x) * 0.05;
    meshRef.current.position.y += floatOffset;
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
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      {material}
    </mesh>
  );
}

// Main sphere collection component
function SphereCollection({ distanceFromCenter = 3, baseRadius = 0.5, radiusRandomization = 0.3, numMeshes = 5 }) {
  const spheres = useMemo(() => {
    const materials: AnimatedSphereProps['materialType'][] = ['metallic', 'glass', 'neon', 'holographic', 'plasma'];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];

    return Array.from({ length: numMeshes }, (_, i): AnimatedSphereProps => {
      // Generate random position on sphere surface at specified distance
      const theta = Math.random() * Math.PI * 2; // azimuthal angle
      const phi = Math.acos(2 * Math.random() - 1); // polar angle (uniform distribution)

      const distance = distanceFromCenter + Math.random() * distanceFromCenter * 0.25; // Add some distance variation

      const x = distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta);
      const z = distance * Math.cos(phi);

      const radius = baseRadius + (Math.random() - 0.5) * radiusRandomization * 2;

      return {
        id: i,
        position: [x, y, z],
        radius: Math.max(0.1, radius),
        materialType: materials[i % materials.length],
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });
  }, [distanceFromCenter, baseRadius, radiusRandomization, numMeshes]);

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

function AnimateModel({position = [0, 0, 0]}: {position?: [number, number, number]}) {
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
    baseRadius: 0.25,
    radiusRandomization: 0.25,
    numMeshes: 8,
  };

  return (
    <Scene>
      {/* <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshPhysicalMaterial color={'#ff0000'} />
      </mesh> */}
      <SpringGroup>
        <AnimateModel />
        <SphereCollection
          key={`${sphereProps.distanceFromCenter}-${sphereProps.baseRadius}-${sphereProps.radiusRandomization}-${sphereProps.numMeshes}`}
          distanceFromCenter={sphereProps.distanceFromCenter}
          baseRadius={sphereProps.baseRadius}
          radiusRandomization={sphereProps.radiusRandomization}
          numMeshes={sphereProps.numMeshes}
        />
      </SpringGroup>
    </Scene>
  );
}
