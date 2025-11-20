import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/VoxelWorld/Scene';
import { generateNaturePoetry } from './services/geminiService';

const App: React.FC = () => {
  const [poetry, setPoetry] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRotating, setIsRotating] = useState(true);

  const handleListenToNature = async () => {
    setIsLoading(true);
    const description = "An autumn mountain voxel world with vibrant red, orange, and yellow leaves flying in the wind, a flowing blue river, wandering wildlife, under a golden sunset.";
    const text = await generateNaturePoetry(description);
    setPoetry(text);
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [30, 30, 30], fov: 35, near: 1, far: 200 }}>
          <color attach="background" args={['#222']} />
          {/* Warmer fog to match the colorful autumn theme */}
          <fog attach="fog" args={['#5D4037', 25, 95]} />
          <Scene isRotating={isRotating} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 pointer-events-none flex flex-col items-start">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 drop-shadow-md">
          Autumn Voxel World
        </h1>
        <p className="text-gray-300 text-sm mt-2 max-w-md drop-shadow-sm">
          A vibrant procedural zen garden.
        </p>
      </div>

      {/* Controls / Interactive Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-4 pointer-events-auto w-full px-4">
        {poetry && (
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center max-w-lg animate-fade-in">
            <p className="italic text-yellow-100 text-lg">"{poetry}"</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="
              flex items-center gap-2 px-6 py-3 rounded-full 
              bg-white/10 backdrop-blur-md
              hover:bg-white/20
              transition-all duration-300 shadow-lg
              border border-white/20
            "
          >
            {isRotating ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Stop Rotation</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Start Rotation</span>
              </>
            )}
          </button>

          <button
            onClick={handleListenToNature}
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full 
              bg-gradient-to-r from-orange-600 to-red-700 
              hover:from-orange-500 hover:to-red-600 
              transition-all duration-300 shadow-lg hover:shadow-orange-500/30
              border border-orange-400/30
              ${isLoading ? 'opacity-70 cursor-wait' : 'opacity-100'}
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Listening...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>Listen to the Wind</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-xs text-gray-500 pointer-events-none">
        Built with React Three Fiber & Gemini API
      </div>
    </div>
  );
};

export default App;