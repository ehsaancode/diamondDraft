import { create } from 'zustand';

export const useViewportStore = create((set) => ({
  wireframe: false,
  activePbrChannel: 'full', // 'full', 'albedo', 'normal', 'roughness', 'metallic', 'ao'
  environment: 'studio', // 'studio', 'city', 'sunset', 'night'
  autoRotate: false,

  setWireframe: (enabled) => set({ wireframe: enabled }),
  toggleWireframe: () => set((state) => ({ wireframe: !state.wireframe })),
  setPbrChannel: (channel) => set({ activePbrChannel: channel }),
  setEnvironment: (env) => set({ environment: env }),
  setAutoRotate: (enabled) => set({ autoRotate: enabled }),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate }))
}));
