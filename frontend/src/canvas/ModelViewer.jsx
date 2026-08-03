import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Center, Html } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { useGLTF } from '@react-three/drei';
import { Maximize, Minimize, Loader2, AlertCircle } from 'lucide-react';
import { useViewportStore } from '../store/useViewportStore';

// In-canvas WebGL Loading Spinner
function Canvas3DLoader() {
  return (
    <Html center className="pointer-events-none">
      <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-white shadow-xl min-w-[200px]">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
        <span className="text-xs font-mono text-slate-300 font-semibold animate-pulse">
          Loading 3D Geometry...
        </span>
      </div>
    </Html>
  );
}

// In-canvas Error Notice when model fails or URL missing
function CanvasErrorNotice({ message = "Unable to load 3D file" }) {
  return (
    <Html center className="pointer-events-none">
      <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-red-500/40 backdrop-blur-md text-white shadow-xl max-w-[260px] text-center">
        <AlertCircle className="w-7 h-7 text-red-400 mb-2" />
        <span className="text-xs font-mono text-slate-200 font-semibold">{message}</span>
      </div>
    </Html>
  );
}

// Custom Error Boundary for Canvas
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Canvas 3D Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <CanvasErrorNotice message="Error parsing 3D model geometry" />;
    }
    return this.props.children;
  }
}

// STLLoader Component
function LoadedSTLModel({ url }) {
  const meshRef = useRef();
  const geometry = useLoader(STLLoader, url);
  const { wireframe, activePbrChannel, autoRotate } = useViewportStore();

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  useEffect(() => {
    if (geometry) {
      geometry.computeVertexNormals();
      geometry.center();
    }
  }, [geometry]);

  const materialProps = useMemo(() => {
    if (wireframe) {
      return { wireframe: true, color: new THREE.Color('#38bdf8') };
    }
    switch (activePbrChannel) {
      case 'albedo':
        return { color: new THREE.Color('#e0e7ff'), metalness: 0, roughness: 1 };
      case 'normal':
        return { color: new THREE.Color('#8080ff'), metalness: 0, roughness: 1 };
      case 'roughness':
        return { color: new THREE.Color('#777777'), metalness: 0, roughness: 0.8 };
      case 'metallic':
        return { color: new THREE.Color('#dddddd'), metalness: 1, roughness: 0.2 };
      case 'ao':
        return { color: new THREE.Color('#333333'), metalness: 0, roughness: 0.9 };
      default:
        return { color: new THREE.Color('#0284c7'), metalness: 0.85, roughness: 0.15 };
    }
  }, [activePbrChannel, wireframe]);

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial {...materialProps} envMapIntensity={1.5} />
    </mesh>
  );
}

// GLTF / GLB Loader Component
function LoadedGLTFModel({ url }) {
  const meshRef = useRef();
  const { scene } = useGLTF(url);
  const { wireframe, activePbrChannel, autoRotate } = useViewportStore();

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (wireframe) {
          child.material.wireframe = true;
        } else {
          child.material.wireframe = false;
        }
      }
    });
  }, [scene, activePbrChannel, wireframe]);

  return (
    <group ref={meshRef}>
      <primitive object={scene} />
    </group>
  );
}

// Smart 3D Model Loader Handler
function Smart3DModelLoader({ glbUrl, formats = [] }) {
  if (!glbUrl) {
    return <CanvasErrorNotice message="No 3D asset file available" />;
  }

  const urlLower = String(glbUrl).toLowerCase();
  const formatsLower = (formats || []).map((f) => String(f).toLowerCase());
  const isStl =
    urlLower.includes('.stl') ||
    formatsLower.some((f) => f.includes('stl')) ||
    (!urlLower.includes('.glb') && !urlLower.includes('.gltf'));

  return (
    <CanvasErrorBoundary>
      <Suspense fallback={<Canvas3DLoader />}>
        {isStl ? <LoadedSTLModel url={glbUrl} /> : <LoadedGLTFModel url={glbUrl} />}
      </Suspense>
    </CanvasErrorBoundary>
  );
}

export default function ModelViewer({ glbUrl, formats = [], className = 'h-[450px] w-full' }) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { environment, wireframe, activePbrChannel, setWireframe, setPbrChannel, autoRotate, toggleAutoRotate } =
    useViewportStore();

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.warn('Fullscreen request error:', err));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.warn('Exit fullscreen error:', err));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 ${
        isFullscreen ? 'w-screen h-screen rounded-none border-none z-50' : className
      }`}
    >
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        gl={{ preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <color attach="background" args={['#090d16']} />
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Center>
          <Smart3DModelLoader glbUrl={glbUrl} formats={formats} />
        </Center>

        <Environment preset={environment === 'studio' ? 'city' : environment} />
        <OrbitControls makeDefault enablePan={true} enableZoom={true} minDistance={1.5} maxDistance={12} />
      </Canvas>

      {/* Floating Viewport Toolbar Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 pointer-events-auto shadow-lg text-xs text-slate-200">
          <span className="text-slate-400 font-medium font-mono text-[11px] mr-1">PBR:</span>
          {['full', 'albedo', 'normal', 'roughness', 'metallic', 'ao'].map((channel) => (
            <button
              key={channel}
              onClick={() => setPbrChannel(channel)}
              className={`px-2 py-0.5 rounded-lg capitalize transition-colors font-mono font-medium text-[10px] ${
                activePbrChannel === channel
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              {channel}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 pointer-events-auto shadow-lg text-xs text-slate-200">
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium transition-all ${
              wireframe
                ? 'bg-indigo-600/80 border-indigo-400 text-white'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-300'
            }`}
          >
            Wireframe: {wireframe ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={toggleAutoRotate}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium transition-all ${
              autoRotate
                ? 'bg-cyan-600/80 border-cyan-400 text-white'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-300'
            }`}
          >
            Rotate: {autoRotate ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium bg-slate-800/80 border-slate-700 hover:border-cyan-400 text-cyan-400 transition-all"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
