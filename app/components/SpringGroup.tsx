import { useMemo, useState } from "react";
import * as THREE from 'three';
import { useFrame, useThree } from "@react-three/fiber";
import { SpringGroupContext } from "@/hooks/useSpringGroup";

export function SpringGroup({ children }: { children: React.ReactNode }) {
  const [mouse, setMouse] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const [draggedSphereId, setDraggedSphereId] = useState<string | null>(null);
  const { camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  // Track mouse position in 3D space
  useFrame((state) => {
    const mouse2D = state.pointer;

    // Convert mouse position to 3D world coordinates
    raycaster.setFromCamera(mouse2D, camera);
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectionPoint);

    if (intersectionPoint) {
      // Only update if the mouse has moved significantly to prevent constant re-renders
      setMouse(prevMouse => {
        const distance = prevMouse.distanceTo(intersectionPoint);
        if (distance > 0.01) { // Only update if moved more than 1cm
          return intersectionPoint;
        }
        return prevMouse;
      });
    }
  });

  const contextValue = useMemo(() => ({
    mouse,
    draggedSphereId,
    setDraggedSphereId
  }), [mouse, draggedSphereId]);

  return (
    <SpringGroupContext.Provider value={contextValue}>
      <group>
        {children}
      </group>
    </SpringGroupContext.Provider>
  );
}
