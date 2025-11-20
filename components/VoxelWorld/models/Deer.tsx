import React from 'react';

export const Deer: React.FC<{ color: string }> = ({ color }) => {
    return (
        <>
            {/* Body */}
            <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.9]} />
                <meshStandardMaterial color="#8B5A2B" /> {/* SaddleBrown */}
            </mesh>

            {/* Neck */}
            <mesh position={[0, 0.9, 0.35]}>
                <boxGeometry args={[0.25, 0.4, 0.25]} />
                <meshStandardMaterial color="#8B5A2B" />
            </mesh>

            {/* Head */}
            <mesh position={[0, 1.2, 0.5]}>
                <boxGeometry args={[0.3, 0.3, 0.4]} />
                <meshStandardMaterial color="#8B5A2B" />
            </mesh>

            {/* Nose */}
            <mesh position={[0, 1.15, 0.75]}>
                <boxGeometry args={[0.15, 0.15, 0.15]} />
                <meshStandardMaterial color="#3E2723" /> {/* Dark Brown */}
            </mesh>

            {/* Antlers */}
            <mesh position={[0.2, 1.45, 0.4]}>
                <boxGeometry args={[0.05, 0.4, 0.05]} />
                <meshStandardMaterial color="#F5DEB3" /> {/* Wheat/Bone */}
            </mesh>
            <mesh position={[-0.2, 1.45, 0.4]}>
                <boxGeometry args={[0.05, 0.4, 0.05]} />
                <meshStandardMaterial color="#F5DEB3" />
            </mesh>
            {/* Antler Branches */}
            <mesh position={[0.25, 1.55, 0.5]}>
                <boxGeometry args={[0.05, 0.2, 0.05]} />
                <meshStandardMaterial color="#F5DEB3" />
            </mesh>
            <mesh position={[-0.25, 1.55, 0.5]}>
                <boxGeometry args={[0.05, 0.2, 0.05]} />
                <meshStandardMaterial color="#F5DEB3" />
            </mesh>


            {/* Legs */}
            <mesh position={[0.15, 0.25, 0.3]}>
                <boxGeometry args={[0.12, 0.5, 0.12]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
            <mesh position={[-0.15, 0.25, 0.3]}>
                <boxGeometry args={[0.12, 0.5, 0.12]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
            <mesh position={[0.15, 0.25, -0.3]}>
                <boxGeometry args={[0.12, 0.5, 0.12]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
            <mesh position={[-0.15, 0.25, -0.3]}>
                <boxGeometry args={[0.12, 0.5, 0.12]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>

            {/* Tail */}
            <mesh position={[0, 0.7, -0.5]}>
                <boxGeometry args={[0.15, 0.15, 0.15]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
        </>
    );
};
