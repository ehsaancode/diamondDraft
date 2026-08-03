import React, { useRef, useMemo, useState, useEffect, Component, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF } from '@react-three/drei';
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

function Canvas3DLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 bg-slate-900/90 text-white px-4 py-3 rounded-2xl border border-slate-700 backdrop-blur-md shadow-2xl pointer-events-none">
        <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] font-mono tracking-wider font-semibold text-slate-300">
          Loading 3D Model...
        </span>
      </div>
    </Html>
  );
}

function CanvasErrorNotice() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-1 bg-slate-900/90 text-white px-4 py-3 rounded-2xl border border-slate-800 backdrop-blur-md text-center pointer-events-none">
        <span className="text-xs font-semibold text-red-400">3D Asset Unavailable</span>
        <span className="text-[10px] text-slate-400 font-mono">Unable to parse 3D file geometry</span>
      </div>
    </Html>
  );
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

function LoadedSTLModel({ url }) {
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

  if (hasError) {
    return <CanvasErrorNotice />;
  }

  if (!geometry) {
    return <Canvas3DLoader />;
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

function Smart3DModelLoader({ glbUrl, formats = [] }) {
  if (!glbUrl) {
    return (
      <Html center>
        <div className="flex flex-col items-center gap-1 bg-slate-900/90 text-white px-4 py-3 rounded-2xl border border-slate-800 backdrop-blur-md text-center pointer-events-none">
          <span className="text-xs font-semibold text-slate-300">No 3D Model File Attached</span>
          <span className="text-[10px] text-slate-500 font-mono">Upload a .glb or .stl file to view in 3D</span>
        </div>
      </Html>
    );
  }

  const urlLower = glbUrl.toLowerCase();
  const formatsLower = (formats || []).map((f) => String(f).toLowerCase());
  const isStl =
    urlLower.includes('.stl') ||
    formatsLower.some((f) => f.includes('stl')) ||
    (!urlLower.includes('.glb') && !urlLower.includes('.gltf'));

  return (
    <CanvasErrorBoundary fallback={<CanvasErrorNotice />}>
      <Suspense fallback={<Canvas3DLoader />}>
        {isStl ? (
          <LoadedSTLModel url={glbUrl} />
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
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />

        <Environment preset={environment || 'studio'} />

        <Smart3DModelLoader glbUrl={glbUrl} formats={formats} modelType={modelType} />

        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          minDistance={1}
          maxDistance={20}
        />
      </Canvas>

      {/* Floating Toolbar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-md text-xs text-slate-300 pointer-events-auto">
          {['full', 'albedo', 'normal', 'roughness', 'metallic'].map((ch) => (
            <button
              key={ch}
              onClick={() => setPbrChannel(ch)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase font-bold transition-all ${
                activePbrChannel === ch
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              wireframe
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Wireframe
          </button>

          <button
            onClick={toggleAutoRotate}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              autoRotate
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Rotate
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
