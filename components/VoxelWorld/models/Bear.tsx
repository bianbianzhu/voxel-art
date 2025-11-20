import React from 'react';

export const Bear: React.FC = () => {
    return (
        <>
            {/* Body */}
            <mesh position={[0, 0.7, 0]}>
                <boxGeometry args={[0.9, 0.8, 1.3]} />
                <meshStandardMaterial color="#4A3728" />
            </mesh>

            {/* Head */}
            <mesh position={[0, 1.2, 0.7]}>
                <boxGeometry args={[0.6, 0.5, 0.5]} />
                <meshStandardMaterial color="#4A3728" />
            </mesh>

            {/* Snout */}
            <mesh position={[0, 1.1, 1.0]}>
                <boxGeometry args={[0.25, 0.2, 0.2]} />
                <meshStandardMaterial color="#6F5E53" /> {/* Lighter brown */}
            </mesh>

            {/* Ears */}
            <mesh position={[0.2, 1.5, 0.6]}>
                <boxGeometry args={[0.15, 0.15, 0.1]} />
                <meshStandardMaterial color="#4A3728" />
            </mesh>
            <mesh position={[-0.2, 1.5, 0.6]}>
                <boxGeometry args={[0.15, 0.15, 0.1]} />
                <meshStandardMaterial color="#4A3728" />
            </mesh>

            {/* Legs */}
            <mesh position={[0.3, 0.3, 0.4]}>
                <boxGeometry args={[0.25, 0.6, 0.25]} />
                <meshStandardMaterial color="#4A3728" />
            </mesh>
            <mesh position={[-0.3, 0.3, 0.4]}>
                <boxGeometry args={[0.25, 0.6, 0.25]} />
                <meshStandardMaterial color="#4A3728" />
            </mesh>
            <mesh position={[0.3, 0.3, -0.4]}>
                <boxGeometry args={[0.25, 0.6, 0.25]} />
                <meshStandardMaterial color="#4A3728" />
            </mesh>
            <mesh position={[-0.3, 0.3, -0.4]}>
                <boxGeometry args={[0.25, 0.6, 0.25]} />
                <meshStandardMaterial color="#4A3728" />
            </mesh>

            {/* Tail */}
            <mesh position={[0, 0.8, -0.7]}>
                <boxGeometry args={[0.15, 0.15, 0.15]} />
                <meshStandardMaterial color="#4A3728" />
            </mesh>
        </>
    );
};
