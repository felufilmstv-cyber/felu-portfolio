# FELU AUTOMATION DEV — Cinematic Data Core Experience

Award-winning dark-mode agency site. Next.js 14 + R3F + GSAP + Lenis.

## Run locally (you handle Node)
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Replace placeholders with real assets
- 3D: `components/DataCore3D.tsx` accepts `model?: string` (future .glb). Swap inner `<mesh>` for `<primitive object={gltf.scene}>` — keep props `rotation/scale/position/lighting/state/scrollProgress`.
- Video: `components/CinematicPlaceholder.tsx` → `<video src="/felufilms-ep01.mp4" muted loop playsInline autoPlay />`
- Flowchart: `components/FlowchartPlaceholder.tsx` → Next/Image of UI mockup.
- Waveform: already live canvas; feed real analyser node if desired.
- Put GLB/MP4 in `/public` and lazy-load (already `dynamic(...,{ssr:false})` + `dpr={[1,1.75]}`).

## Structure
`app/` layout + page · `components/` DataCore3D, DataCoreCanvas, Opening, Engine, Arsenal, ProcessSection, Vault, BrandStatement, Initiation, Navigation, LoadingScreen, reveals · `hooks/useLenis` · `lib/registerGsap`
