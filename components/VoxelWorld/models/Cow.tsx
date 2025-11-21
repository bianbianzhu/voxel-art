import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getWaveHeight } from '../utils';

export const Cow: React.FC<{ position: [number, number, number], rotation?: [number, number, number] }> = ({ position, rotation = [0, 0, 0] }) => {
    const headRef = useRef<THREE.Group>(null);
    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();

        if (headRef.current) {
            // Eating animation: Head goes down and up
            headRef.current.rotation.x = Math.max(0, Math.sin(time * 3) * 0.6);
        }

        if (groupRef.current) {
            // Sync with terrain wave
            const yOffset = getWaveHeight(position[0], position[2], time);
            groupRef.current.position.y = position[1] + yOffset;
        }
    });

    return (
        <group ref={groupRef} position={position} rotation={rotation}>
            {/* Body */}
            <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[0.6, 0.5, 0.9]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Spots (Simple black boxes slightly protruding) */}
            <mesh position={[0.2, 0.6, 0.1]}>
                <boxGeometry args={[0.21, 0.3, 0.3]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[-0.2, 0.7, -0.2]}>
                <boxGeometry args={[0.21, 0.2, 0.2]} />
                <meshStandardMaterial color="#000000" />
            </mesh>

            {/* Head Group for Animation */}
            <group ref={headRef} position={[0, 0.8, 0.55]}>
                {/* Head Main */}
                <mesh position={[0, 0, 0.15]}>
                    <boxGeometry args={[0.35, 0.35, 0.3]} />
                    <meshStandardMaterial color="#FFFFFF" />
                </mesh>
                {/* Nose */}
                <mesh position={[0, -0.1, 0.31]}>
                    <boxGeometry args={[0.36, 0.15, 0.05]} />
                    <meshStandardMaterial color="#FFC0CB" /> {/* Pink nose */}
                </mesh>
                {/* Eyes */}
                <mesh position={[0.12, 0.05, 0.31]}>
                    <boxGeometry args={[0.05, 0.05, 0.02]} />
                    <meshStandardMaterial color="#000000" />
                </mesh>
                <mesh position={[-0.12, 0.05, 0.31]}>
                    <boxGeometry args={[0.05, 0.05, 0.02]} />
                    <meshStandardMaterial color="#000000" />
                </mesh>
                {/* Horns */}
                <mesh position={[0.12, 0.2, 0.1]}>
                    <boxGeometry args={[0.05, 0.15, 0.05]} />
                    <meshStandardMaterial color="#D3D3D3" />
                </mesh>
                <mesh position={[-0.12, 0.2, 0.1]}>
                    <boxGeometry args={[0.05, 0.15, 0.05]} />
                    <meshStandardMaterial color="#D3D3D3" />
                </mesh>
                {/* Ears */}
                <mesh position={[0.22, 0.05, 0.1]}>
                    <boxGeometry args={[0.1, 0.05, 0.05]} />
                    <meshStandardMaterial color="#FFFFFF" />
                </mesh>
                <mesh position={[-0.22, 0.05, 0.1]}>
                    <boxGeometry args={[0.1, 0.05, 0.05]} />
                    <meshStandardMaterial color="#FFFFFF" />
                </mesh>
            </group>

            {/* Legs */}
            <mesh position={[0.2, 0.25, 0.3]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[-0.2, 0.25, 0.3]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[0.2, 0.25, -0.3]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[-0.2, 0.25, -0.3]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Hooves */}
            <mesh position={[0.2, 0.02, 0.3]}>
                <boxGeometry args={[0.16, 0.05, 0.16]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[-0.2, 0.02, 0.3]}>
                <boxGeometry args={[0.16, 0.05, 0.16]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0.2, 0.02, -0.3]}>
                <boxGeometry args={[0.16, 0.05, 0.16]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[-0.2, 0.02, -0.3]}>
                <boxGeometry args={[0.16, 0.05, 0.16]} />
                <meshStandardMaterial color="#000000" />
            </mesh>

            {/* Udder */}
            <mesh position={[0, 0.3, -0.1]}>
                <boxGeometry args={[0.3, 0.1, 0.3]} />
                <meshStandardMaterial color="#FFC0CB" />
            </mesh>
        </group>
    );
};
