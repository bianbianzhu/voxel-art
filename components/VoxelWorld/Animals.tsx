import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimalState } from '../../types';

import { getTerrainHeight } from './utils';

const Animal: React.FC<{ config: AnimalState }> = ({ config }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState(new THREE.Vector3(...config.position));
  const [target, setTarget] = useState(new THREE.Vector3(...config.target));

  // Simple wander logic
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const step = config.speed * delta * 2;
    const distance = position.distanceTo(target);

    // Calculate terrain height at current position
    const terrainHeight = getTerrainHeight(Math.round(position.x), Math.round(position.z));
    // Target Y should be on top of the block (height + 1 for standing on top)
    const targetY = Math.max(0, terrainHeight + 1);

    // Smoothly interpolate Y to avoid snapping
    position.y += (targetY - position.y) * 0.1;

    if (distance < 0.5) {
      // Pick new random target within bounds
      const newTargetX = (Math.random() - 0.5) * 20;
      const newTargetZ = (Math.random() - 0.5) * 20;
      // Keep away from water (approximate)
      if (Math.abs(newTargetX) > 3) {
        // We don't know the height at the target yet, but we'll find out when we get there
        // For now, keep target Y same as current or approximate
        setTarget(new THREE.Vector3(newTargetX, position.y, newTargetZ));
      }
    } else {
      // Move towards target (ignoring Y for direction to keep speed consistent on XZ plane)
      const direction = new THREE.Vector3(target.x - position.x, 0, target.z - position.z).normalize();
      position.x += direction.x * step;
      position.z += direction.z * step;

      // Look at target
      groupRef.current.lookAt(target.x, position.y, target.z);

      // Simple hop animation
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