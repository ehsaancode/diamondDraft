import React, { useRef, useMemo, useState, useEffect, Component, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Center, useGLTF } from '@react-three/drei';
import { Maximize, Minimize } from 'lucide-react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { useViewportStore } from '../store/useViewportStore';

// Suppress THREE.Clock deprecation warning emitted by R3F internal loop in Three r160+
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('THREE.Clock') || args[0].includes('PCFSoftShadowMap'))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn('3D Canvas Loader Error Caught:', error?.message || error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const getPbrMaterialProps = (activePbrChannel, wireframe) => {
  const base = {
    wireframe: wireframe,
    roughness: 0.15,
    metalness: 0.85,
  };

  switch (activePbrChannel) {
    case 'albedo':
      return { ...base, color: '#38bdf8', metalness: 0, roughness: 1 };
    case 'normal':
      return { ...base, color: '#8080ff', metalness: 0, roughness: 1 };
    case 'roughness':
      return { ...base, color: '#666666', metalness: 0, roughness: 0.8 };
    case 'metallic':
      return { ...base, color: '#cccccc', metalness: 1.0, roughness: 0.2 };
    case 'ao':
      return { ...base, color: '#444444', metalness: 0, roughness: 0.9 };
    case 'full':
    default:
      return { ...base, color: '#0ea5e9', metalness: 0.85, roughness: 0.15 };
  }
};

function LoadedSTLModel({ url, modelType }) {
  const meshRef = useRef();
  const [geometry, setGeometry] = useState(null);
  const [hasError, setHasError] = useState(false);
  const { wireframe, activePbrChannel, autoRotate } = useViewportStore();

  useEffect(() => {
    let isMounted = true;
    setHasError(false);
    setGeometry(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buffer) => {
        if (!isMounted) return;
        const loader = new STLLoader();
        const parsedGeom = loader.parse(buffer);
        parsedGeom.computeVertexNormals();
        parsedGeom.center();
        setGeometry(parsedGeom);
      })
      .catch((err) => {
        console.warn('STL ArrayBuffer Parse Warning:', err.message);
        if (isMounted) setHasError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const materialProps = useMemo(
    () => getPbrMaterialProps(activePbrChannel, wireframe),
    [activePbrChannel, wireframe]
  );

  if (hasError || !geometry) {
    return <InspectableMesh modelType={modelType} />;
  }

  return (
    <group ref={meshRef}>
      <mesh geometry={geometry} castShadow receiveShadow scale={[0.05, 0.05, 0.05]}>
        <meshStandardMaterial {...materialProps} envMapIntensity={1.5} />
      </mesh>
    </group>
  );
}

function LoadedGLTFModel({ url }) {
  const meshRef = useRef();
  const { wireframe, activePbrChannel, autoRotate } = useViewportStore();
  const { scene } = useGLTF(url);

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = wireframe;
        if (activePbrChannel === 'albedo') {
          child.material.color = new THREE.Color('#38bdf8');
          child.material.metalness = 0;
          child.material.roughness = 1;
        } else if (activePbrChannel === 'normal') {
          child.material.color = new THREE.Color('#8080ff');
          child.material.metalness = 0;
          child.material.roughness = 1;
        } else if (activePbrChannel === 'roughness') {
          child.material.color = new THREE.Color('#666666');
          child.material.metalness = 0;
          child.material.roughness = 0.8;
        } else if (activePbrChannel === 'metallic') {
          child.material.color = new THREE.Color('#cccccc');
          child.material.metalness = 1;
          child.material.roughness = 0.2;
        } else if (activePbrChannel === 'ao') {
          child.material.color = new THREE.Color('#444444');
          child.material.metalness = 0;
          child.material.roughness = 0.9;
        } else {
          child.material.color = new THREE.Color('#0ea5e9');
          child.material.metalness = 0.85;
          child.material.roughness = 0.15;
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

function InspectableMesh({ modelType = 'character' }) {
  const meshRef = useRef();
  const { wireframe, activePbrChannel, autoRotate } = useViewportStore();

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const materialProps = useMemo(
    () => getPbrMaterialProps(activePbrChannel, wireframe),
    [activePbrChannel, wireframe]
  );

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef}>
        {modelType === 'diamond' ? (
          <mesh castShadow receiveShadow>
            <octahedronGeometry args={[1.8, 2]} />
            <meshStandardMaterial {...materialProps} envMapIntensity={1.5} />
          </mesh>
        ) : modelType === 'character' ? (
          <mesh castShadow receiveShadow>
            <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
            <meshStandardMaterial {...materialProps} envMapIntensity={1.5} />
          </mesh>
        ) : (
          <mesh castShadow receiveShadow>
            <icosahedronGeometry args={[1.6, 3]} />
            <meshStandardMaterial {...materialProps} envMapIntensity={1.5} />
          </mesh>
        )}
      </group>
    </Float>
  );
}

function Smart3DModelLoader({ glbUrl, formats = [], modelType }) {
  if (!glbUrl) {
    return <InspectableMesh modelType={modelType} />;
  }

  const urlLower = glbUrl.toLowerCase();
  const formatsLower = (formats || []).map((f) => String(f).toLowerCase());
  const isStl =
    urlLower.includes('.stl') ||
    formatsLower.some((f) => f.includes('stl')) ||
    (!urlLower.includes('.glb') && !urlLower.includes('.gltf'));

  return (
    <CanvasErrorBoundary fallback={<InspectableMesh modelType={modelType} />}>
      <Suspense fallback={<InspectableMesh modelType={modelType} />}>
        {isStl ? (
          <LoadedSTLModel url={glbUrl} modelType={modelType} />
        ) : (
          <LoadedGLTFModel url={glbUrl} />
        )}
      </Suspense>
    </CanvasErrorBoundary>
  );
}

export default function ModelViewer({ glbUrl, formats = [], modelType = 'character', className = 'h-[450px] w-full' }) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { environment, wireframe, activePbrChannel, setWireframe, setPbrChannel, autoRotate, toggleAutoRotate } =
    useViewportStore();

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch((err) => {
        console.warn('Fullscreen request error:', err);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch((err) => {
        console.warn('Exit fullscreen error:', err);
      });
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
          <Smart3DModelLoader glbUrl={glbUrl} formats={formats} modelType={modelType} />
        </Center>

        <Environment preset={environment === 'studio' ? 'city' : environment} />
        <OrbitControls makeDefault enablePan={true} enableZoom={true} minDistance={2} maxDistance={10} />
      </Canvas>

      {/* Floating Toolbar Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 pointer-events-auto shadow-lg text-xs text-slate-200">
          <span className="text-slate-400 font-medium font-mono text-[11px]">PBR Channel:</span>
          {['full', 'albedo', 'normal', 'roughness', 'metallic', 'ao'].map((channel) => (
            <button
              key={channel}
              onClick={() => setPbrChannel(channel)}
              className={`px-2 py-0.5 rounded-lg capitalize transition-colors font-mono font-medium text-[11px] ${
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
