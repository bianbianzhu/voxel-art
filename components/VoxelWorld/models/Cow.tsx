import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getWaveHeight, getGrasslandHeight } from '../utils';

export const Cow: React.FC<{ position: [number, number, number], rotation?: [number, number, number] }> = ({ position: initialPosition, rotation: initialRotation = [0, 0, 0] }) => {
    const groupRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);

    // State for behavior
    const state = useRef<'IDLE' | 'MOVING' | 'EATING'>('EATING');
    const pos = useRef(new THREE.Vector3(...initialPosition));
    const targetPos = useRef(new THREE.Vector3(...initialPosition));
    const rot = useRef(new THREE.Euler(...initialRotation));
    const timer = useRef(Math.random() * 3); // Initial random delay

    useFrame(({ clock }, delta) => {
        const time = clock.getElapsedTime();

        // State Machine
        if (state.current === 'IDLE') {
            timer.current -= delta;
            if (timer.current <= 0) {
                // Pick next state
                if (Math.random() < 0.6) {
                    state.current = 'MOVING';
                    // Pick random target within 5 units
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 2 + Math.random() * 3;
                    targetPos.current.set(
                        pos.current.x + Math.cos(angle) * dist,
                        pos.current.y, // Y is ignored for distance check, updated later
                        pos.current.z + Math.sin(angle) * dist
                    );
                } else {
                    state.current = 'EATING';
                    timer.current = 4 + Math.random() * 4; // Eat for 4-8 seconds
                }
            }
        } else if (state.current === 'MOVING') {
            const speed = 6.0 * delta; // Slow movement
            const dir = new THREE.Vector3().subVectors(targetPos.current, pos.current);
            dir.y = 0; // Move only on XZ plane
            const dist = dir.length();

            if (dist < speed) {
                // Reached target
                pos.current.x = targetPos.current.x;
                pos.current.z = targetPos.current.z;
                state.current = 'IDLE';
                timer.current = Math.random();
            } else {
                // Move
                dir.normalize();
                pos.current.add(dir.multiplyScalar(speed));

                // Rotate to face target
                const targetAngle = Math.atan2(dir.x, dir.z);
                // Smooth rotation
                let angleDiff = targetAngle - rot.current.y;
                // Normalize angle to -PI to PI
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

                rot.current.y += angleDiff * delta * 5;
            }
        } else if (state.current === 'EATING') {
            timer.current -= delta;
            if (timer.current <= 0) {
                state.current = 'IDLE';
                timer.current = Math.random();
            }
        }

        // Update Y position based on terrain
        const terrainHeight = getGrasslandHeight(pos.current.x, pos.current.z);
        const waveOffset = getWaveHeight(pos.current.x, pos.current.z, time);

        // Smooth Y transition to avoid snapping too hard
        const targetY = terrainHeight + 0.5 + waveOffset;
        pos.current.y = THREE.MathUtils.lerp(pos.current.y, targetY, delta * 5);

        // Apply to group
        if (groupRef.current) {
            groupRef.current.position.copy(pos.current);
            groupRef.current.rotation.copy(rot.current);
        }

        // Head Animation
        if (headRef.current) {
            if (state.current === 'EATING') {
                // Bob head down to eat
                headRef.current.rotation.x = Math.sin(time * 8) * 0.3 + 0.5;
            } else {
                // Return to normal
                headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, delta * 5);
            }
        }
    });

    return (
        <group ref={groupRef}>
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
