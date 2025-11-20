import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimalState } from '../../types';

import { getTerrainHeight, isTreeAt } from './utils';

const Animal: React.FC<{ config: AnimalState }> = ({ config }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState(new THREE.Vector3(...config.position));
  const [target, setTarget] = useState(new THREE.Vector3(...config.target));

  // "Stay on Level" movement logic
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const step = config.speed * delta * 2;
    const distance = position.distanceTo(target);

    // 1. Calculate potential next position
    const direction = new THREE.Vector3(target.x - position.x, 0, target.z - position.z).normalize();
    const nextX = position.x + direction.x * step;
    const nextZ = position.z + direction.z * step;

    // 2. Check terrain at next position
    const nextHeight = getTerrainHeight(Math.round(nextX), Math.round(nextZ));
    const currentHeight = getTerrainHeight(Math.round(position.x), Math.round(position.z));

    // 3. Validation Checks (Strict: Same Height Only)
    const isSameHeight = nextHeight === currentHeight;
    const isBlockedByTree = isTreeAt(Math.round(nextX), Math.round(nextZ));

    if (distance < 0.5 || isBlockedByTree || !isSameHeight) {
      // Reached target OR Blocked (Tree or Height Change) -> Find new valid direction

      let foundPath = false;
      // Try up to 10 random directions to find a valid path on the same level
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const lookDist = 2; // Check a bit ahead
        const testX = position.x + Math.cos(angle) * lookDist;
        const testZ = position.z + Math.sin(angle) * lookDist;

        const testHeight = getTerrainHeight(Math.round(testX), Math.round(testZ));
        const testTree = isTreeAt(Math.round(testX), Math.round(testZ));

        if (testHeight === currentHeight && !testTree) {
          // Found a valid direction! Set a far target in this direction
          const wanderDist = 10;
          const newTargetX = position.x + Math.cos(angle) * wanderDist;
          const newTargetZ = position.z + Math.sin(angle) * wanderDist;

          // Clamp to world bounds
          const clampedX = Math.max(-20, Math.min(20, newTargetX));
          const clampedZ = Math.max(-20, Math.min(20, newTargetZ));

          setTarget(new THREE.Vector3(clampedX, position.y, clampedZ));
          foundPath = true;
          break;
        }
      }

      // If no path found immediately, just wait (do nothing this frame, maybe next frame random seed helps or we just turn in place)

    } else {
      // Move
      position.x = nextX;
      position.z = nextZ;

      // Y should be stable (currentHeight + 1), but we can interpolate just in case of floating point drifts
      position.y += ((currentHeight + 1) - position.y) * 0.1;

      // Look at target
      groupRef.current.lookAt(target.x, position.y, target.z);

      // Hop animation
      const hopHeight = Math.sin(state.clock.elapsedTime * 10) * 0.1;
      groupRef.current.position.set(position.x, position.y + Math.max(0, hopHeight), position.z);
    }
  });

  // Construct voxel body based on type
  const parts = useMemo(() => {
    if (config.type === 'fox') {
      return (
        <>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.4, 0.4, 0.8]} />
            <meshStandardMaterial color="#E36414" />
          </mesh>
          <mesh position={[0, 0.7, 0.3]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#E36414" />
          </mesh>
          <mesh position={[0, 0.5, -0.5]}>
            <boxGeometry args={[0.2, 0.2, 0.4]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </>
      );
    } else if (config.type === 'bear') {
      return (
        <>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.8, 0.7, 1.2]} />
            <meshStandardMaterial color="#4A3728" />
          </mesh>
          <mesh position={[0, 1.1, 0.5]}>
            <boxGeometry args={[0.5, 0.5, 0.4]} />
            <meshStandardMaterial color="#4A3728" />
          </mesh>
        </>
      )
    } else if (config.type === 'fish') {
      return (
        <>
          {/* Body */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.25, 0.25, 0.5]} />
            <meshStandardMaterial color="#FF7F50" /> {/* Coral Orange */}
          </mesh>
          {/* Tail */}
          <mesh position={[0, 0.2, -0.35]}>
            <boxGeometry args={[0.1, 0.2, 0.2]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          {/* Dorsal Fin */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.05, 0.15, 0.2]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          {/* Side Fins */}
          <mesh position={[0.15, 0.15, 0.1]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.1, 0.05, 0.15]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[-0.15, 0.15, 0.1]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.1, 0.05, 0.15]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </>
      );
    }
    return (
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.6]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
    );
  }, [config.type, config.color]);

  return (
    <group ref={groupRef} position={config.position}>
      {parts}
      {/* Shadow */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="black" opacity={0.3} transparent />
      </mesh>
    </group>
  );
};

const Animals: React.FC = () => {
  const animals: AnimalState[] = useMemo(() => [
    { id: 1, type: 'fish', position: [5, 1, 5], target: [8, 1, 8], speed: 1.0, color: 'coral' },
    { id: 2, type: 'bear', position: [-8, 1, -5], target: [-4, 1, 0], speed: 0.8, color: 'brown' },
    { id: 3, type: 'fox', position: [6, 2, -6], target: [2, 2, -2], speed: 1.2, color: 'orange' },
    { id: 4, type: 'fish', position: [2, 4, 5], target: [8, 1, 8], speed: 0.4, color: 'coral' },
  ], []);

  return (
    <group>
      {animals.map(animal => (
        <Animal key={animal.id} config={animal} />
      ))}
    </group>
  );
};

export default Animals;