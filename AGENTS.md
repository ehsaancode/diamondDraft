## 1. System Architecture (React.js Client & Microservices)

```
                            ┌─────────────────────────────────────────┐
                            │      React.js Single Page App (SPA)      │
                            │  (Vite, React Router v6, TanStack Query) │
                            └────────────────────┬────────────────────┘
                                                 │
                                                 ▼
                            ┌─────────────────────────────────────────┐
                            │    API Gateway / Node.js Backend Server  │
                            │        (Express / Fastify / GraphQL)    │
                            └────────────────────┬────────────────────┘
                                                 │
         ┌───────────────────────────────────────┼───────────────────────────────────────┐
         ▼                                       ▼                                       ▼
┌──────────────────┐                    ┌──────────────────┐                    ┌──────────────────┐
│ Core Marketplace │                    │ Search Engine    │                    │ 3D Processing    │
│ Service (Node.js)│                    │ (Typesense /     │                    │ Worker Queue     │
└────────┬─────────┘                    │  Elasticsearch)  │                    │ (Blender CLI)    │
         │                              └────────┬─────────┘                    └────────┬─────────┘
         ▼                                       │                                       │
┌──────────────────┐                             ▼                                       ▼
│ PostgreSQL DB    │                    ┌──────────────────┐                    ┌──────────────────┐
│ & Redis Cache    │                    │ Search Index     │                    │ AWS S3 / R2      │
└──────────────────┘                    └──────────────────┘                    │ Private Vault    │
                                                                                └──────────────────┘

```

| Layer | Technology | Primary Role in React Architecture |
| --- | --- | --- |
| **Frontend Core** | React.js (Vite), React Router v6 | Single-Page Application (SPA) with declarative client-side routing. |
| **3D Engine** | `@react-three/fiber`, `@react-three/drei`, Three.js | Native React declarative canvas for WebGL rendering and 3D inspection. |
| **State & Data Handling** | TanStack Query (React Query), Zustand | Async server state caching, optimistic updates, and global UI state. |
| **Styling & UI** | Tailwind CSS, Radix UI / Shadcn UI | Accessible, high-performance UI components and responsive styling. |
| **Search & Filtering** | Typesense Search Client / Algolia SDK | Client-side fast faceted search, typo tolerance, and filter sync via URL params. |
| **Backend & Storage** | Node.js (Express), PostgreSQL, AWS S3 / R2 | Auth, catalog management, media conversion queues, and private asset downloads. |

---

## 2. Core Feature Specifications

### **A. Search & Catalog Navigation**

* **Dynamic URL Sync:** Sync all search queries, file format filters (`.blend`, `.fbx`, `.obj`, `.stl`, `.gltf`), poly-count ranges, and licenses (Royalty-Free, Editorial, **No-AI License**) directly to React Router search params (`useSearchParams`).
* **Faceted Filtering Component:** React-driven sidebar connected to Typesense/Elasticsearch for real-time filter updates without page reloads.

---

### **B. WebGL & WebAR Viewport (`@react-three/fiber`)**

* **Interactive Inspection Canvas:**
* Render geometry wireframes, topology lines, and skeletal rigs dynamically using `@react-three/drei`.
* Inspect individual PBR channels (*Albedo, Normal, Roughness, Metallic, AO*).
* Orbit, Pan, and Zoom controls via `OrbitControls`.


* **Mobile WebAR Trigger:** Generate dynamic QR codes directing mobile browsers to native USDZ (iOS Quick Look) and GLB (Android Scene Viewer) files.

---

### **C. E-Commerce & Secure Downloads**

* **Checkout Integration:** React payment forms via **Stripe Elements** and **PayPal React SDK** for pay-per-model orders and recurring subscription download credits.
* **Signed Link Delivery:** On checkout completion, fetch temporal signed AWS S3/R2 download URLs ($\le 15$ minutes expiration) via TanStack Query mutation.

---

### **D. Creator Portal & Custom Freelance Jobs**

* **Batch Drag-and-Drop Ingestion:** React dropzone file upload interface supporting `.zip` packages, displaying real-time upload progress and server-side processing job status via WebSockets.
* **Custom Job Escrow Board:** Brief creation, bidding list, direct messaging with attachments, and milestone approval interface.

---

## 3. Agent Execution & Implementation Plan

### **Phase 1: React Project Setup & 3D Worker Pipeline**

> **Goal:** Bootstrap React application structure, routing, asset vault, and server-side 3D processing.

* [ ] **Task 1.1:** Initialize React.js project using Vite, React Router v6, Tailwind CSS, and Zustand.
* [ ] **Task 1.2:** Configure Node.js backend with PostgreSQL schema and private S3 bucket signed URL endpoints.
* [ ] **Task 1.3:** Build background worker queue using headless Blender CLI to extract `.zip` uploads, compute polygon/vertex metadata, and auto-export WebGL `.glb` previews.

---

### **Phase 2: Discovery, Filtering & E-Commerce Workflows**

> **Goal:** Deliver instant client-side catalog searching, product detail views, and payment checkout.

* [ ] **Task 2.1:** Implement Typesense search integration in React with debounced search inputs and filter state synced to URL parameters.
* [ ] **Task 2.2:** Build Product Detail Page (PDP) layout with lazy-loaded preview assets and specification matrices.
* [ ] **Task 2.3:** Integrate Stripe Elements and PayPal React SDK for split marketplace payments and automated tax calculations.

---

### **Phase 3: Native React 3D Viewport (`R3F`) & WebAR**

> **Goal:** Embed `@react-three/fiber` canvas for interactive asset previews in the browser.

* [ ] **Task 3.1:** Create reusable `<ModelViewer/>` component using `@react-three/fiber` with HDRI lighting, environment switching, wireframe toggle, and PBR material inspection.
* [ ] **Task 3.2:** Build subscription plan pricing table and user credit management UI using Stripe Billing hooks.
* [ ] **Task 3.3:** Add WebAR popup modal with dynamic QR code generation for mobile AR viewing.

---

### **Phase 4: Creator Studio & Custom Freelance Escrow**

> **Goal:** Deploy creator dashboard, upload health inspector, and freelance project management.

* [ ] **Task 4.1:** Build creator dashboard featuring batch drag-and-drop file ingestion (`react-dropzone`), sales analytics charts, and payout management.
* [ ] **Task 4.2:** Implement custom job request board with real-time bidding and milestone-based escrow release via Stripe.

---

## 4. Coding Standards & Guidelines for AI Agents

1. **React Component Structure:** Keep components modular and localized under `src/components/` (UI), `src/features/` (Marketplace logic), and `src/canvas/` (3D Three.js viewports).
2. **Lazy Loading 3D Canvas:** Always lazy-load `@react-three/fiber` components (`React.lazy` / `Suspense`) to ensure the initial page JS bundle size remains lightweight.
3. **State Management Protocol:** Use **TanStack Query** for all server API calls and caching; reserve **Zustand** strictly for global client UI state (e.g., active modal states, cart items, viewport render settings).
4. **Security & DRM:** Never store direct S3 URLs in React state or local storage. Always query for short-lived, signed temporal URLs.