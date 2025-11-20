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
