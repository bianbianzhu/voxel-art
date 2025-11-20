import React from 'react';

export const Fish: React.FC = () => {
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
};
