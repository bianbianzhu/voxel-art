import React from 'react';

export const Fox: React.FC = () => {
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
};
