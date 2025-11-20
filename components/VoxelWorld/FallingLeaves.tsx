import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 150;
const WORLD_SIZE = 40;

const FallingLeaves: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initial random positions and properties
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
      temp.push({
        x: (Math.random() - 0.5) * WORLD_SIZE,
        y: Math.random() * 25 + 5,
        z: (Math.random() - 0.5) * WORLD_SIZE,
        speed: Math.random() * 0.03 + 0.01, // Slower fall speed
        windFactor: Math.random() * 0.4 + 0.2, // Less susceptible to wind
        rotationAxis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
        rotationSpeed: Math.random() * 0.02 + 0.01, // Slower rotation
        phase: Math.random() * Math.PI * 2,
        swayRate: Math.random() * 1 + 0.5, // Slower sway
      });
    }
    return temp;
  }, []);

  // Set colors once
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const tempColor = new THREE.Color();
    // Vivid Autumn Palette matching Scene.tsx
    const palette = [
      '#FF2200', // Vivid Red
      '#FF6600', // Bright Orange
      '#FFD700', // Bright Gold
      '#FF9900', // Vivid Orange-Yellow
      '#FFFF00', // Pure Yellow
      '#FF4500'  // Orange Red
    ];

    for (let i = 0; i < COUNT; i++) {
      const colorHex = palette[Math.floor(Math.random() * palette.length)];
      tempColor.set(colorHex);
      meshRef.current.setColorAt(i, tempColor);
    }
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Simulating a gentle breeze
    // Base wind flowing towards +X and slightly +Z
    const baseWindX = 0.05;
    const baseWindZ = 0.02;

    // Gusts using sine waves - much gentler
    const gust = Math.sin(t * 0.5) * 0.02 + Math.sin(t * 1.5) * 0.01 + 0.02;

    particles.forEach((particle, i) => {
      // Update position
      particle.y -= particle.speed;

      // Apply Wind + Turbulence
      const turbulence = Math.sin(t * particle.swayRate + particle.phase) * 0.01;
      particle.x += (baseWindX + gust) * particle.windFactor + turbulence;
      particle.z += (baseWindZ + gust * 0.3) * particle.windFactor + turbulence;

      // Rotation based on movement
      dummy.position.set(particle.x, particle.y, particle.z);

      // Spin the leaf
      dummy.rotateOnAxis(particle.rotationAxis, particle.rotationSpeed);

      // Reset if hits ground or flies out of bounds
      // 1. Too low
      // 2. Too far "downwind" (X > limit)
      if (particle.y < -2 || particle.x > WORLD_SIZE / 2 + 10) {
        // Respawn high up
        particle.y = 20 + Math.random() * 10;
        // Respawn "upwind" so they fly across the scene again
        particle.x = -WORLD_SIZE / 2 - 5 - Math.random() * 10;
        particle.z = (Math.random() - 0.5) * WORLD_SIZE;
      }

      dummy.scale.set(0.25, 0.25, 0.25);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <planeGeometry args={[0.6, 0.6]} />
      <meshStandardMaterial
        roughness={1}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
};

export default FallingLeaves;