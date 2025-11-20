import React from 'react';

export const Bear: React.FC = () => {
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
    );
};
