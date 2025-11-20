import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VoxelData } from '../../types';

interface WaterProps {
  voxels: VoxelData[];
}

const Water: React.FC<WaterProps> = ({ voxels }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    voxels.forEach((voxel, i) => {
      // Simple wave effect: bob up and down slightly based on Z position and time
      const yOffset = Math.sin(time * 2 + voxel.z * 0.5 + voxel.x * 0.5) * 0.1;
      
      dummy.position.set(voxel.x, voxel.y + yOffset - 0.2, voxel.z);
      dummy.scale.set(1, 0.8, 1); // Slightly flatter
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, voxels.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#4CC9F0" 
        opacity={0.8} 
        transparent 
        roughness={0.1} 
        metalness={0.1} 
      />
    </instancedMesh>
  );
};

export default Water;