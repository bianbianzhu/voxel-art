import React, { useLayoutEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getWaveHeight } from './utils';

interface GrassProps {
    positions: { x: number; y: number; z: number }[];
}

const Grass: React.FC<GrassProps> = ({ positions }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    // Memoize random offsets for wind variation so they don't change on re-render
    const windOffsets = useMemo(() => {
        return new Float32Array(positions.length).map(() => Math.random() * 100);
    }, [positions.length]);

    useLayoutEffect(() => {
        if (!meshRef.current) return;
        const tempObject = new THREE.Object3D();

        positions.forEach((pos, i) => {
            tempObject.position.set(pos.x, pos.y, pos.z);
            // Random initial rotation
            tempObject.rotation.y = Math.random() * Math.PI;
            tempObject.updateMatrix();
            meshRef.current!.setMatrixAt(i, tempObject.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [positions]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;

        const time = clock.getElapsedTime();
        const tempObject = new THREE.Object3D();

        // We need to reconstruct the matrix for each instance to animate rotation
        // This is the heavy part. If we have too many instances, this will lag.
        // Optimization: Only update rotation.z (sway) based on noise.

        // To avoid reconstructing everything, we can just read the position from the current matrix?
        // No, reading back is slow. We have the positions prop.

        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            const offset = windOffsets[i];

            // Sync with terrain wave
            const terrainYOffset = getWaveHeight(pos.x, pos.z, time);
            tempObject.position.set(pos.x, pos.y + terrainYOffset, pos.z);

            // Base rotation (y) + Wind sway (x or z)
            // We can just rotate around X or Z to simulate bending
            const windAngle = Math.sin(time * 1.0 + pos.x * 0.5 + pos.z * 0.5 + offset) * 0.2;

            // We want the grass to bend with the wind.
            // Let's say wind blows along X axis. We rotate around Z.
            tempObject.rotation.set(windAngle, 0, windAngle * 0.5);

            // Apply random Y rotation we set initially? 
            // If we reset rotation here, we lose the initial random Y.
            // Let's add the random Y back.
            // We can store initial Y rotation in windOffsets or another array if we want it persistent.
            // For now, let's just say they all face mostly the same way or re-calculate random based on index?
            // Re-calculating random based on index is deterministic.
            const randomY = (i % 100) / 100 * Math.PI;
            tempObject.rotation.y = randomY;
            tempObject.rotation.z += windAngle; // Bend

            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, positions.length]}
            castShadow
            receiveShadow
        >
            {/* Simple blade shape */}
            <boxGeometry args={[0.05, 0.8, 0.05]} />
            <meshStandardMaterial color="#8BC34A" />
        </instancedMesh>
    );
};

export default Grass;
