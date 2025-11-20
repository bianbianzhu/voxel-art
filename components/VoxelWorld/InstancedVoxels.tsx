import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { VoxelData } from '../../types';

interface InstancedVoxelsProps {
  voxels: VoxelData[];
}

const InstancedVoxels: React.FC<InstancedVoxelsProps> = ({ voxels }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    const tempObject = new THREE.Object3D();
    const tempColor = new THREE.Color();

    // Update instance matrices and colors
    voxels.forEach((voxel, i) => {
      tempObject.position.set(voxel.x, voxel.y, voxel.z);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);

      tempColor.set(voxel.color);
      // Add a slight random variation to color for texture
      const variation = (Math.random() - 0.5) * 0.05;
      tempColor.r += variation;
      tempColor.g += variation;
      tempColor.b += variation;

      meshRef.current!.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [voxels]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, voxels.length]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        roughness={0.8}
        metalness={0.1}
      />
    </instancedMesh>
  );
};

export default InstancedVoxels;