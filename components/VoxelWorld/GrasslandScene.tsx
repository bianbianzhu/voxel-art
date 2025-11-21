import React, { useMemo } from 'react';
import { OrbitControls, Environment, Cloud, Sky } from '@react-three/drei';
import AnimatedTerrain from './AnimatedTerrain';
import Grass from './Grass';
import Flowers from './Flowers';
import { Cow } from './models/Cow';
import { VoxelData } from '../../types';
import * as THREE from 'three';

const GrasslandScene: React.FC<{ isRotating: boolean }> = ({ isRotating }) => {
    const { terrainVoxels, grassPositions, flowerPositions, cowPositions } = useMemo(() => {
        const tVoxels: VoxelData[] = [];
        const gPositions: { x: number; y: number; z: number }[] = [];
        const fPositions: { x: number; y: number; z: number }[] = [];
        const cPositions: { position: [number, number, number], rotation: [number, number, number] }[] = [];

        const size = 20;

        for (let x = -size; x <= size; x++) {
            for (let z = -size; z <= size; z++) {
                // Rolling hills using sine waves
                const height = Math.floor(Math.sin(x * 0.1) * 2 + Math.cos(z * 0.1) * 2);

                // Fill ground
                for (let y = -3; y <= height; y++) {
                    let color = '#558B2F'; // Deep green
                    let type: VoxelData['type'] = 'ground';

                    if (y === height) {
                        color = '#7CB342'; // Lighter green top

                        // Add grass blades on top
                        // High density grass
                        if (Math.random() > 0.0) { // Always generate
                            // Add 80-100 blades per block
                            const count = Math.floor(Math.random() * 20) + 80;
                            for (let i = 0; i < count; i++) {
                                gPositions.push({
                                    x: x + (Math.random() - 0.5) * 0.95, // Spread out fully
                                    y: y + 0.5, // On top of the block
                                    z: z + (Math.random() - 0.5) * 0.95
                                });
                            }
                        }

                        // Add flowers (random chance)
                        if (Math.random() < 0.15) { // 15% chance per block
                            const count = Math.floor(Math.random() * 2) + 1;
                            for (let i = 0; i < count; i++) {
                                fPositions.push({
                                    x: x + (Math.random() - 0.5) * 0.8,
                                    y: y + 0.5, // On top of the block
                                    z: z + (Math.random() - 0.5) * 0.8
                                });
                            }
                        }

                        // Chance for a Cow
                        if (Math.random() < 0.005) {
                            cPositions.push({
                                position: [x, y + 0.5, z],
                                rotation: [0, Math.random() * Math.PI * 2, 0]
                            });
                        }

                    } else if (y < height - 2) {
                        color = '#3E2723'; // Dirt
                    }

                    tVoxels.push({ x, y, z, color, type });
                }
            }
        }

        // Ensure at least 10 cows
        while (cPositions.length < 10) {
            const x = Math.floor(Math.random() * (size * 2 + 1)) - size;
            const z = Math.floor(Math.random() * (size * 2 + 1)) - size;
            const height = Math.floor(Math.sin(x * 0.1) * 2 + Math.cos(z * 0.1) * 2);
            cPositions.push({
                position: [x, height + 0.5, z],
                rotation: [0, Math.random() * Math.PI * 2, 0]
            });
        }

        return { terrainVoxels: tVoxels, grassPositions: gPositions, flowerPositions: fPositions, cowPositions: cPositions };
    }, []);

    return (
        <>
            {/* Bright Day Lighting */}
            <ambientLight intensity={0.8} color="#E0F7FA" />
            <directionalLight
                position={[50, 100, 50]}
                intensity={1.5}
                color="#FFFDE7"
                castShadow
                shadow-mapSize={[2048, 2048]}
            />

            {/* Sky & Clouds */}
            <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} />
            <Cloud position={[-10, 15, -10]} opacity={1} speed={0.2} bounds={[10, 2, 10]} segments={20} color={[255, 255, 255]} />
            <Cloud position={[10, 12, 10]} opacity={1} speed={0.2} bounds={[10, 2, 10]} segments={20} color={[255, 255, 255]} />
            <Cloud position={[0, 18, -5]} opacity={1} speed={0.1} bounds={[15, 2, 15]} segments={20} color={[255, 255, 255]} />

            {/* World Objects */}
            <AnimatedTerrain voxels={terrainVoxels} />
            <Grass positions={grassPositions} />
            <Flowers positions={flowerPositions} color="#FFEB3B" />

            {/* Cows */}
            {cowPositions.map((cow, index) => (
                <Cow key={index} position={cow.position} rotation={cow.rotation} />
            ))}

            {/* Controls */}
            <OrbitControls
                makeDefault
                autoRotate={isRotating}
                autoRotateSpeed={0.5}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.2}
                maxDistance={60}
            />
        </>
    );
};

export default GrasslandScene;
