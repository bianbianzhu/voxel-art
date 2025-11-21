export const noise = (x: number, z: number) => {
    return Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2 + Math.sin(x * 0.3 + z * 0.2);
};

export const getTerrainHeight = (x: number, z: number) => {
    // 1. Base Terrain Height Calculation
    const distance = Math.sqrt(x * x + z * z);
    let height = Math.max(0, 12 - distance * 0.6);
    height += noise(x, z);

    // 2. River Carving
    const riverPath = Math.sin(z * 0.2) * 3;
    const distToRiver = Math.abs(x - riverPath);

    if (distToRiver < 2.5) {
        height = -1; // River bed
    } else if (distToRiver < 4) {
        height *= 0.5; // Banks
    }

    // Round to integer for voxel snap
    return Math.floor(height);
};

export const seededRandom = (x: number, z: number) => {
    const sin = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
    return sin - Math.floor(sin);
};

export const isTreeAt = (x: number, z: number) => {
    const height = getTerrainHeight(x, z);

    // Replicate river logic for distance check
    const riverPath = Math.sin(z * 0.2) * 3;
    const distToRiver = Math.abs(x - riverPath);

    // Tree placement logic from Scene.tsx
    // height >= 0 && height < 8 && Math.random() > 0.90 && distToRiver > 3
    // We use seededRandom instead of Math.random() for consistency
    if (height >= 0 && height < 8 && seededRandom(x, z) > 0.90 && distToRiver > 3) {
        return true;
    }
    return false;
};

export const getWaveHeight = (x: number, z: number, time: number) => {
    return Math.sin(time * 2 + x * 0.5 + z * 0.5) * 0.1;
};
