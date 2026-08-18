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

// Safe Environment Wrapper with HDRI CDN Fallback
function SafeEnvironment({ preset = 'city' }) {
  const [hasEnvError, setHasEnvError] = useState(false);

  if (hasEnvError) {
    return (
      <>
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
      </>
    );
  }

  return (
    <CanvasErrorBoundary>
      <Suspense fallback={<ambientLight intensity={1.2} />}>
        <Environment preset={preset === 'studio' ? 'city' : preset} />
      </Suspense>
    </CanvasErrorBoundary>
  );
}

// 100% Resilient 3D Model Loader Hook & Component
function ResilientModelRenderer({ url, formats = [] }) {
  const meshRef = useRef();
  const [loadingState, setLoadingState] = useState({ loading: true, error: null, result: null, isGltf: false });
  const [retryCount, setRetryCount] = useState(0);
  const { wireframe, activePbrChannel, autoRotate } = useViewportStore();

  useEffect(() => {
    let isMounted = true;
    setLoadingState({ loading: true, error: null, result: null, isGltf: false });

    const loadModelWithRetry = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      let targetUrl = url;
      if (targetUrl && !targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('data:')) {
        const cleanPath = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`;
        targetUrl = `${apiUrl}${cleanPath}`;
      }

      let attempt = 0;
      const maxRetries = 3;

      while (attempt < maxRetries) {
        try {
          attempt++;
          // Fetch raw array buffer
          const safeUrl = encodeURI(targetUrl);
          const res = await fetch(safeUrl);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const buffer = await res.arrayBuffer();

          if (!isMounted) return;

          // Magic byte check for GLTF / GLB binary (0x46546C67 -> "glTF")
          const dataView = new DataView(buffer);
          const isGltfMagic = buffer.byteLength >= 4 && dataView.getUint32(0, true) === 0x46546C67;
          const urlLower = String(targetUrl).toLowerCase();
          const isGltfExt = urlLower.endsWith('.glb') || urlLower.endsWith('.gltf');
          const isJsonExt = urlLower.endsWith('.json');

          const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
          const pathUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

          const processGltfScene = (scene) => {
            // Auto-center and normalize scale so GLTF models always fit nicely in viewport
            const box = new THREE.Box3().setFromObject(scene);
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            if (maxDim > 0) {
              const targetSize = 2.2;
              const scale = targetSize / maxDim;
              scene.scale.set(scale, scale, scale);
            }
            const center = new THREE.Vector3();
            box.getCenter(center);
            scene.position.sub(center.clone().multiplyScalar(scene.scale.x));

            scene.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  child.material.needsUpdate = true;
                }
              }
            });
            return scene;
          };

          if (isGltfMagic || isGltfExt) {
            try {
              const loader = new GLTFLoader();
              const gltf = await new Promise((resolve, reject) => {
                loader.parse(buffer, pathUrl, resolve, (err) => reject(err));
              });
              const processedScene = processGltfScene(gltf.scene);
              if (isMounted) {
                setLoadingState({ loading: false, error: null, result: processedScene, isGltf: true });
              }
              return;
            } catch (gltfErr) {
              console.warn("GLTFLoader parse failed, attempting alternative parsers...", gltfErr);
            }
          }

          if (isJsonExt || !isGltfMagic) {
            try {
              const textDecoder = new TextDecoder('utf-8');
              const jsonText = textDecoder.decode(buffer);
              const json = JSON.parse(jsonText);

              // 1. glTF JSON structure (.json file format containing glTF object)
              if (json.asset && (json.asset.version || json.asset.generator)) {
                const loader = new GLTFLoader();
                const gltf = await new Promise((resolve, reject) => {
                  loader.parse(buffer, pathUrl, resolve, (err) => reject(err));
                });
                const processedScene = processGltfScene(gltf.scene);
                if (isMounted) {
                  setLoadingState({ loading: false, error: null, result: processedScene, isGltf: true });
                }
                return;
              }

              // 2. Three.js BufferGeometry JSON structure
              if (
                json.metadata?.type === 'BufferGeometry' ||
                json.type === 'BufferGeometry' ||
                (json.data && json.data.attributes)
              ) {
                const bgLoader = new THREE.BufferGeometryLoader();
                const geometry = bgLoader.parse(json);
                geometry.computeVertexNormals();
                geometry.center();
                geometry.computeBoundingSphere();
                const radius = geometry.boundingSphere ? geometry.boundingSphere.radius : 1;
                if (radius > 0) {
                  const targetRadius = 1.8;
                  const scale = targetRadius / radius;
                  geometry.scale(scale, scale, scale);
                }
                if (isMounted) {
                  setLoadingState({ loading: false, error: null, result: geometry, isGltf: false });
                }
                return;
              }

              // 3. Three.js Scene/Object JSON structure (ObjectLoader)
              if (json.metadata || json.object || json.geometries || json.materials) {
                const objLoader = new THREE.ObjectLoader();
                const object3D = objLoader.parse(json);
                const processedScene = processGltfScene(object3D);
                if (isMounted) {
                  setLoadingState({ loading: false, error: null, result: processedScene, isGltf: true });
                }
                return;
              }
            } catch (jsonErr) {
              console.warn("JSON parser attempt failed, falling back to STL:", jsonErr);
            }
          }

          // Fallback: STL Loader
          const stlLoader = new STLLoader();
          const geometry = stlLoader.parse(buffer);
          geometry.computeVertexNormals();
          geometry.center();
          geometry.computeBoundingSphere();
          const radius = geometry.boundingSphere ? geometry.boundingSphere.radius : 1;
          if (radius > 0) {
            const targetRadius = 1.8;
            const scale = targetRadius / radius;
            geometry.scale(scale, scale, scale);
          }

          if (isMounted) {
            setLoadingState({ loading: false, error: null, result: geometry, isGltf: false });
          }
          return;
        } catch (err) {
          console.warn(`3D Model load attempt ${attempt} failed:`, err);
          if (attempt >= maxRetries) {
            if (isMounted) {
              // Fallback to procedural CAD Gemstone 3D geometry if model fails to download
              const fallbackGeom = new THREE.IcosahedronGeometry(1.2, 1);
              fallbackGeom.computeVertexNormals();
              fallbackGeom.center();
              setLoadingState({ loading: false, error: null, result: fallbackGeom, isGltf: false });
            }
          } else {
            // Exponential backoff delay
            await new Promise((r) => setTimeout(r, attempt * 600));
          }
        }
      }
    };

    if (url) {
      loadModelWithRetry();
    } else {
      // Procedural CAD 3D Gemstone Geometry preview if no URL uploaded yet
      const fallbackGeom = new THREE.IcosahedronGeometry(1.2, 1);
      fallbackGeom.computeVertexNormals();
      fallbackGeom.center();
      setLoadingState({ loading: false, error: null, result: fallbackGeom, isGltf: false });
    }

    return () => {
      isMounted = false;
    };
  }, [url, retryCount]);

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

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

  if (loadingState.loading) {
    return <Canvas3DLoader />;
  }

  if (loadingState.error) {
    return (
      <Html center className="pointer-events-auto">
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/95 border border-red-500/40 backdrop-blur-md text-white shadow-2xl max-w-[280px] text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <span className="text-xs font-mono text-slate-200 font-medium">
            Unable to render 3D model geometry
          </span>
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
          >
            Retry Loading 3D Model
          </button>
        </div>
      </Html>
    );
  }

  if (loadingState.isGltf && loadingState.result) {
    return (
      <group ref={meshRef}>
        <primitive object={loadingState.result} />
      </group>
    );
  }

  if (!loadingState.isGltf && loadingState.result) {
    return (
      <mesh ref={meshRef} geometry={loadingState.result} castShadow receiveShadow>
        <meshStandardMaterial {...materialProps} envMapIntensity={1.5} />
      </mesh>
    );
  }

  return null;
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
      style={{ touchAction: 'none' }}
      className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 touch-none select-none ${
        isFullscreen ? 'w-screen h-screen rounded-none border-none z-50' : className
      }`}
    >
      <Canvas
        eventSource={containerRef}
        eventPrefix="client"
        shadows={{ type: THREE.PCFShadowMap }}
        gl={{ preserveDrawingBuffer: true, powerPreference: 'high-performance', antialias: true, failIfMajorPerformanceCaveat: false }}
        onCreated={({ gl }) => {
          if (gl && gl.domElement) {
            gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
          }
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <color attach="background" args={['#090d16']} />
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Center>
          <ResilientModelRenderer url={glbUrl} formats={formats} />
        </Center>

        <SafeEnvironment preset={environment} />
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          minDistance={0.5}
          maxDistance={50}
          zoomSpeed={1.2}
          rotateSpeed={0.8}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
        />
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
