import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimalState } from '../../types';

import { getTerrainHeight, isTreeAt } from './utils';

const Animal: React.FC<{ config: AnimalState }> = ({ config }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState(new THREE.Vector3(...config.position));
  const [target, setTarget] = useState(new THREE.Vector3(...config.target));

  const stuckCount = useRef(0);

  // Improved movement logic with Escape Mechanism
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

    // 3. Validation Checks
    const heightDiff = Math.abs(nextHeight - currentHeight);
    const isBlockedByTree = isTreeAt(Math.round(nextX), Math.round(nextZ));
    const isTooSteep = heightDiff > 1;

    if (distance < 0.5 || isBlockedByTree || isTooSteep) {
      // Blocked or Reached Target
      if (isBlockedByTree || isTooSteep) {
        stuckCount.current += 1;
      } else {
        stuckCount.current = 0; // Reset if we reached target successfully
      }

      // ESCAPE MECHANISM
      if (stuckCount.current > 20) {
        // Try to find a valid escape spot within 5 blocks
        let escaped = false;
        for (let i = 0; i < 10; i++) {
          const escapeX = position.x + (Math.random() - 0.5) * 10; // +/- 5 blocks
          const escapeZ = position.z + (Math.random() - 0.5) * 10;

          if (!isTreeAt(Math.round(escapeX), Math.round(escapeZ))) {
            // Found valid spot!
            const escapeHeight = getTerrainHeight(Math.round(escapeX), Math.round(escapeZ));

            // Teleport/Super Jump
            position.x = escapeX;
            position.z = escapeZ;
            position.y = escapeHeight + 1;
            setTarget(new THREE.Vector3(escapeX, position.y, escapeZ)); // Stop moving
            stuckCount.current = 0;
            escaped = true;
            break;
          }
        }
        if (!escaped) {
          // If still can't find spot, just reset stuck count to try normal wander again
          stuckCount.current = 0;
        }
      } else {
        // Normal Wander: Pick new random target
        const range = 10;
        const newTargetX = position.x + (Math.random() - 0.5) * range;
        const newTargetZ = position.z + (Math.random() - 0.5) * range;

        const clampedX = Math.max(-20, Math.min(20, newTargetX));
        const clampedZ = Math.max(-20, Math.min(20, newTargetZ));

        setTarget(new THREE.Vector3(clampedX, position.y, clampedZ));
      }
    } else {
      // Move
      stuckCount.current = 0; // Reset stuck count on successful move
      position.x = nextX;
      position.z = nextZ;

      // Smooth Y transition
      const targetY = Math.max(0, nextHeight + 1);
      position.y += (targetY - position.y) * 0.1;

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
    { id: 1, type: 'fox', position: [5, 1, 5], target: [8, 1, 8], speed: 1.5, color: 'orange' },
    { id: 2, type: 'bear', position: [-8, 1, -5], target: [-4, 1, 0], speed: 0.8, color: 'brown' },
    { id: 3, type: 'fox', position: [6, 2, -6], target: [2, 2, -2], speed: 1.2, color: 'orange' },
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