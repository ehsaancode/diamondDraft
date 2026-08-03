import React, { Suspense, lazy } from 'react';
import { Box } from 'lucide-react';

const LazyModelViewer = lazy(() => import('./ModelViewer'));

export default function CanvasWrapper(props) {
  return (
    <div className={`relative ${props.className || 'h-[450px] w-full'}`}>
      <Suspense
        fallback={
          <div className="relative flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-3xl h-full w-full">
            <Box className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
            <span className="text-xs font-mono text-slate-400 animate-pulse">
              Loading WebGL 3D Model Viewer...
            </span>
          </div>
        }
      >
        <LazyModelViewer {...props} />
      </Suspense>
    </div>
  );
}
