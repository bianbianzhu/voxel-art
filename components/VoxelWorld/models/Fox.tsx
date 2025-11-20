import React from 'react';

export const Fox: React.FC = () => {
    return (
        <>
            {/* Body */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.35, 0.35, 0.7]} />
                <meshStandardMaterial color="#E36414" /> {/* Orange */}
            </mesh>

            {/* Head */}
            <mesh position={[0, 0.8, 0.45]}>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color="#E36414" />
            </mesh>

            {/* Snout */}
            <mesh position={[0, 0.75, 0.65]}>
                <boxGeometry args={[0.15, 0.15, 0.2]} />
                <meshStandardMaterial color="#FFFFFF" /> {/* White snout */}
            </mesh>
            <mesh position={[0, 0.82, 0.74]}>
                <boxGeometry args={[0.08, 0.08, 0.05]} />
                <meshStandardMaterial color="#000000" /> {/* Nose */}
            </mesh>

            {/* Ears */}
            <mesh position={[0.1, 1.0, 0.45]}>
                <boxGeometry args={[0.1, 0.2, 0.1]} />
                <meshStandardMaterial color="#2D1B0E" /> {/* Dark ears */}
            </mesh>
            <mesh position={[-0.1, 1.0, 0.45]}>
                <boxGeometry args={[0.1, 0.2, 0.1]} />
                <meshStandardMaterial color="#2D1B0E" />
            </mesh>

            {/* Legs */}
            <mesh position={[0.12, 0.2, 0.25]}>
                <boxGeometry args={[0.1, 0.4, 0.1]} />
                <meshStandardMaterial color="#2D1B0E" /> {/* Dark legs */}
            </mesh>
            <mesh position={[-0.12, 0.2, 0.25]}>
                <boxGeometry args={[0.1, 0.4, 0.1]} />
                <meshStandardMaterial color="#2D1B0E" />
            </mesh>
            <mesh position={[0.12, 0.2, -0.25]}>
                <boxGeometry args={[0.1, 0.4, 0.1]} />
                <meshStandardMaterial color="#2D1B0E" />
            </mesh>
            <mesh position={[-0.12, 0.2, -0.25]}>
                <boxGeometry args={[0.1, 0.4, 0.1]} />
                <meshStandardMaterial color="#2D1B0E" />
            </mesh>

            {/* Tail */}
            <mesh position={[0, 0.6, -0.5]}>
                <boxGeometry args={[0.25, 0.25, 0.5]} />
                <meshStandardMaterial color="#E36414" />
            </mesh>
            {/* Tail Tip */}
            <mesh position={[0, 0.65, -0.8]}>
                <boxGeometry args={[0.15, 0.15, 0.2]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
        </>
    );
};
