import * as THREE from 'three';
import { createContext, useContext } from "react";

interface SpringGroupContextType {
  mouse: THREE.Vector3;
  draggedSphereId: string | null;
  setDraggedSphereId: (id: string | null) => void;
}

export const SpringGroupContext = createContext<SpringGroupContextType | null>(null);

export const useSpringGroup = (): SpringGroupContextType => {
  const context = useContext(SpringGroupContext);
  if (!context) {
    throw new Error('useSpringGroup must be used within a SpringGroup');
  }
  return context;
};
