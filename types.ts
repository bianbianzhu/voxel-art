export interface VoxelData {
  x: number;
  y: number;
  z: number;
  color: string;
  type: 'ground' | 'water' | 'leaf' | 'wood' | 'stone' | 'snow';
}

export interface AnimalState {
  id: number;
  position: [number, number, number];
  target: [number, number, number];
  speed: number;
  type: 'fox' | 'bear' | 'deer' | 'fish';
  color: string;
}

export enum WeatherState {
  Sunny = 'Sunny',
  Windy = 'Windy',
}