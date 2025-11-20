import React, { useMemo } from 'react';
import { OrbitControls, Environment, Stars, Sparkles } from '@react-three/drei';
import InstancedVoxels from './InstancedVoxels';
import Water from './Water';
import FallingLeaves from './FallingLeaves';
import Animals from './Animals';
import { VoxelData } from '../../types';
import * as THREE from 'three';

// Simple Pseudo-random noise function for consistent terrain generation
const noise = (x: number, z: number) => {
  return Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2 + Math.sin(x * 0.3 + z * 0.2);
};

const Scene: React.FC = () => {
  const { terrainVoxels, waterVoxels, treeVoxels } = useMemo(() => {
    const tVoxels: VoxelData[] = [];
    const wVoxels: VoxelData[] = [];
    const treeV: VoxelData[] = [];
    
    const size = 26; // Slightly larger world radius

    for (let x = -size; x <= size; x++) {
      for (let z = -size; z <= size; z++) {
        // 1. Base Terrain Height Calculation
        // Mountain shape: higher in center, lower at edges, but carve a river
        const distance = Math.sqrt(x * x + z * z);
        let height = Math.max(0, 12 - distance * 0.6); 
        height += noise(x, z);

        // 2. River Carving
        // River flows roughly along X=0 with some winding
        const riverPath = Math.sin(z * 0.2) * 3;
        const distToRiver = Math.abs(x - riverPath);
        
        if (distToRiver < 2.5) {
          height = -1; // River bed
        } else if (distToRiver < 4) {
           height *= 0.5; // Banks
        }

        // Round to integer for voxel snap
        height = Math.floor(height);

        // 3. Generate Terrain Columns
        if (height < 0) {
          // Water
          wVoxels.push({ x, y: 0, z, color: '#4CC9F0', type: 'water' });
          // Sand/Mud under water
          tVoxels.push({ x, y: -1, z, color: '#8D7B68', type: 'ground' });
        } else {
          // Ground
          for (let y = -2; y <= height; y++) {
            let color = '#606c38'; // Dark green base
            let type: VoxelData['type'] = 'ground';

            if (y === height) {
               // Top layer logic
               if (y > 9) {
                 color = '#F1FAEE'; // Snow cap
                 type = 'snow';
               } else if (y > 6) {
                 color = '#6F5E53'; // High altitude rock
                 type = 'stone';
               } else {
                 // Autumn Grass variation (Warm colors)
                 const rand = Math.random();
                 if (rand > 0.7) color = '#D4A373'; // Dry beige grass
                 else if (rand > 0.4) color = '#588157'; // Muted green
                 else color = '#A3B18A'; // Pale green
               }
            } else if (y < height - 2) {
              color = '#4A4036'; // Dirt/Stone deep down
              type = 'stone';
            }
            
            tVoxels.push({ x, y, z, color, type });
          }

          // 4. Trees
          // Increased density slightly, colorful palette
          if (height >= 0 && height < 8 && Math.random() > 0.90 && distToRiver > 3) {
            // Tree Trunk
            treeV.push({ x, y: height + 1, z, color: '#5D4037', type: 'wood' }); // Darker wood
            treeV.push({ x, y: height + 2, z, color: '#5D4037', type: 'wood' });
            
            // Leaves (Crown) - Vibrant Autumn Palette (Orange, Red, Yellow)
            const treePalette = [
              '#FF2200', // Vivid Red
              '#FF6600', // Bright Orange
              '#FFD700', // Bright Gold
              '#FF9900', // Vivid Orange-Yellow
              '#FFFF00', // Pure Yellow
              '#FF4500'  // Orange Red
            ];
            const baseColor = treePalette[Math.floor(Math.random() * treePalette.length)];
            
            // Simple 3x3x2 crown
            for(let lx = -1; lx <= 1; lx++) {
              for(let lz = -1; lz <= 1; lz++) {
                 for(let ly = 0; ly <= 1; ly++) {
                    if (Math.abs(lx) + Math.abs(lz) + ly < 3) { // Simple shape trimming
                       treeV.push({ x: x + lx, y: height + 3 + ly, z: z + lz, color: baseColor, type: 'leaf' });
                    }
                 }
              }
            }
          }
        }
      }
    }

    return { terrainVoxels: [...tVoxels, ...treeV], waterVoxels: wVoxels, treeVoxels: treeV };
  }, []);

  return (
    <>
      {/* Lighting: Enhanced for Brightness */}
      <ambientLight intensity={0.9} color="#fff5e6" />
      <directionalLight 
        position={[50, 40, 20]} 
        intensity={2.0} 
        color="#FFD700" 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <hemisphereLight color="#FFD700" groundColor="#b98b73" intensity={0.6} />

      {/* Environment */}
      <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
      <Environment preset="sunset" blur={0.5} background={false} />
      <Sparkles count={150} scale={35} size={6} speed={0.4} opacity={0.5} color="#FFD700" />

      {/* World Objects */}
      <InstancedVoxels voxels={terrainVoxels} />
      <Water voxels={waterVoxels} />
      <FallingLeaves />
      <Animals />

      {/* Controls */}
      <OrbitControls 
        makeDefault 
        autoRotate 
        autoRotateSpeed={0.8} 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2.2} 
        maxDistance={60}
      />
    </>
  );
};

export default Scene;