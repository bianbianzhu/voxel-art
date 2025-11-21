import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VoxelData } from '../../types';
import { getWaveHeight } from './utils';

interface AnimatedTerrainProps {
    voxels: VoxelData[];
}

const AnimatedTerrain: React.FC<AnimatedTerrainProps> = ({ voxels }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const color = useMemo(() => new THREE.Color(), []);

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        voxels.forEach((voxel, i) => {
            color.set(voxel.color);
            // Add a slight random variation to color for texture
            const variation = (Math.random() - 0.5) * 0.05;
            color.r += variation;
            color.g += variation;
            color.b += variation;
            meshRef.current!.setColorAt(i, color);
        });
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, [voxels]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.elapsedTime;

        voxels.forEach((voxel, i) => {
            const yOffset = getWaveHeight(voxel.x, voxel.z, time);
            dummy.position.set(voxel.x, voxel.y + yOffset, voxel.z);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, voxels.length]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial roughness={0.8} metalness={0.1} />
        </instancedMesh>
    );
};

export default AnimatedTerrain;
