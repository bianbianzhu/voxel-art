import React, { useLayoutEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getWaveHeight } from './utils';

interface FlowersProps {
    positions: { x: number; y: number; z: number }[];
    color?: string | number | THREE.Color;
}

// Helper to manually merge geometries
const mergeGeometries = (geometries: THREE.BufferGeometry[]) => {
    let totalVertices = 0;
    let totalIndices = 0;

    geometries.forEach(geo => {
        totalVertices += geo.attributes.position.count;
        if (geo.index) totalIndices += geo.index.count;
    });

    const positionArray = new Float32Array(totalVertices * 3);
    const normalArray = new Float32Array(totalVertices * 3);
    const uvArray = new Float32Array(totalVertices * 2);
    const colorArray = new Float32Array(totalVertices * 3);
    const indexArray = new Uint16Array(totalIndices);

    let vertexOffset = 0;
    let indexOffset = 0;

    geometries.forEach(geo => {
        const pos = geo.attributes.position;
        const norm = geo.attributes.normal;
        const uv = geo.attributes.uv;
        const col = geo.attributes.color;
        const idx = geo.index;

        if (pos) positionArray.set(pos.array, vertexOffset * 3);
        if (norm) normalArray.set(norm.array, vertexOffset * 3);
        if (uv) uvArray.set(uv.array, vertexOffset * 2);
        if (col) colorArray.set(col.array, vertexOffset * 3);

        if (idx) {
            for (let i = 0; i < idx.count; i++) {
                indexArray[indexOffset + i] = idx.getX(i) + vertexOffset;
            }
            indexOffset += idx.count;
        }

        vertexOffset += pos.count;
    });

    const merged = new THREE.BufferGeometry();
    merged.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    merged.setAttribute('normal', new THREE.BufferAttribute(normalArray, 3));
    merged.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
    merged.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    merged.setIndex(new THREE.BufferAttribute(indexArray, 1));

    return merged;
};

const Flowers: React.FC<FlowersProps> = ({ positions, color = '#FFEB3B' }) => {
    console.log('Flowers component rendering, positions:', positions.length);
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);



    // Build the detailed flower geometry
    const flowerGeometry = useMemo(() => {
        const geometries: THREE.BufferGeometry[] = [];
        const petalColor = new THREE.Color(color);
        const stemColor = new THREE.Color('#4CAF50'); // Green
        const centerColor = new THREE.Color('#fff'); // Dark center

        // Helper to add color attribute
        const addColor = (geo: THREE.BufferGeometry, c: THREE.Color) => {
            const count = geo.attributes.position.count;
            const colors = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;
            }
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        };

        // 1. Stem (Much thinner and shorter)
        // Height 0.4, Width 0.02
        const stem = new THREE.BoxGeometry(0.02, 0.4, 0.02);
        stem.translate(0, 0.2, 0); // Pivot at bottom
        addColor(stem, stemColor);
        geometries.push(stem);

        // 2. Leaves (Smaller)
        const leaf1 = new THREE.BoxGeometry(0.1, 0.01, 0.03);
        leaf1.translate(0.05, 0.15, 0);
        leaf1.rotateY(Math.PI / 4);
        addColor(leaf1, stemColor);
        geometries.push(leaf1);

        const leaf2 = new THREE.BoxGeometry(0.1, 0.01, 0.03);
        leaf2.translate(-0.05, 0.2, 0);
        leaf2.rotateY(-Math.PI / 4);
        addColor(leaf2, stemColor);
        geometries.push(leaf2);

        // 3. Center
        const center = new THREE.BoxGeometry(0.06, 0.06, 0.06);
        center.translate(0, 0.4, 0);
        addColor(center, centerColor);
        geometries.push(center);

        // 4. Petals
        const petalSize = 0.08;
        const petalThickness = 0.02;
        const petalOffset = 0.04;
        const flowerHeight = 0.4;

        // Top
        const p1 = new THREE.BoxGeometry(petalSize, petalSize, petalThickness);
        p1.translate(0, flowerHeight + petalOffset, 0);
        addColor(p1, petalColor);
        geometries.push(p1);

        // Bottom
        const p2 = new THREE.BoxGeometry(petalSize, petalSize, petalThickness);
        p2.translate(0, flowerHeight - petalOffset, 0);
        addColor(p2, petalColor);
        geometries.push(p2);

        // Left
        const p3 = new THREE.BoxGeometry(petalThickness, petalSize, petalSize);
        p3.translate(-petalOffset, flowerHeight, 0);
        addColor(p3, petalColor);
        geometries.push(p3);

        // Right
        const p4 = new THREE.BoxGeometry(petalThickness, petalSize, petalSize);
        p4.translate(petalOffset, flowerHeight, 0);
        addColor(p4, petalColor);
        geometries.push(p4);

        // Merge all
        const merged = mergeGeometries(geometries);
        return merged;
    }, [color]);

    // Memoize random offsets for wind variation
    const windOffsets = useMemo(() => {
        return new Float32Array(positions.length).map(() => Math.random() * 100);
    }, [positions.length]);

    // Memoize random scales
    const randomScales = useMemo(() => {
        return new Float32Array(positions.length).map(() => 0.8 + Math.random() * 0.4);
    }, [positions.length]);

    useLayoutEffect(() => {
        if (!meshRef.current) return;
        const tempObject = new THREE.Object3D();

        positions.forEach((pos, i) => {
            tempObject.position.set(pos.x, pos.y, pos.z);
            tempObject.rotation.y = Math.random() * Math.PI * 2;
            const scale = randomScales[i];
            tempObject.scale.set(scale, scale, scale);
            tempObject.updateMatrix();
            meshRef.current!.setMatrixAt(i, tempObject.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [positions, randomScales]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;

        const time = clock.getElapsedTime();
        const tempObject = new THREE.Object3D();

        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            const offset = windOffsets[i];
            const scale = randomScales[i];

            // Sync with terrain wave
            const terrainYOffset = getWaveHeight(pos.x, pos.z, time);
            tempObject.position.set(pos.x, pos.y + terrainYOffset, pos.z);

            // Wind Sway
            const windNoise = Math.sin(time * 1.0 + pos.x * 0.3 + pos.z * 0.3 + offset);
            const windAngle = windNoise * 0.15;

            // Apply rotation
            // We want to rotate around the base. 
            // Since the geometry is centered, we might need to translate up, rotate, translate down?
            // Actually, if we just rotate, it rotates around the center of the flower.
            // The flower geometry should ideally be built such that y=0 is the bottom.
            // Assuming the geometry is centered, we can just rotate.

            // Re-apply random Y rotation (we need to store it if we want it constant, 
            // but for now let's just use a deterministic random based on index)
            const randomY = (i * 123.45) % (Math.PI * 2);

            tempObject.rotation.set(windAngle, randomY, windAngle * 0.5);

            tempObject.scale.set(scale, scale, scale);
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
            geometry={flowerGeometry}
        >
            <meshStandardMaterial
                ref={materialRef}
                vertexColors
            />
        </instancedMesh>
    );
};

export default Flowers;
