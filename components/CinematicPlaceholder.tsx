'use client';
export default function CinematicPlaceholder() {
  return (
    <div className="asset" style={{ aspectRatio: '16/9' }}>
      <div className="grid-bg" />
      <span className="asset-tag">PLACEHOLDER — CINEMATIC VIDEO / FELUFILMS TV 16:9</span>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
        <div className="display" style={{ fontSize: 42, letterSpacing: 0 }}>▶ 00:00:12:08</div>
        <div className="label">VEO3 · PROCEDURAL FILM PIPELINE — REPLACE WITH MP4/WEBM</div>
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, height: 2, background: 'rgba(255,255,255,.15)' }}>
        <div style={{ width: '34%', height: '100%', background: '#2B4EFF' }} />
      </div>
    </div>
  );
}
