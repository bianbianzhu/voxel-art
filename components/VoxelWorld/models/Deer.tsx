import React from 'react';

export const Deer: React.FC<{ color: string }> = ({ color }) => {
    return (
        <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.4, 0.4, 0.6]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};
