'use client';
import { useEffect, useRef } from 'react';

export default function WaveformPlaceholder({ label = 'PLACEHOLDER — REACTIVE AUDIO WAVEFORM' }: { label?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext('2d')!;
    let raf = 0; const t0 = performance.now();
    const draw = (t: number) => {
      const w = (c.width = c.offsetWidth * 2), h = (c.height = c.offsetHeight * 2);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = '#2B4EFF'; ctx.lineWidth = 3; ctx.beginPath();
      for (let x = 0; x < w; x += 6) {
        const k = (t - t0) / 900;
        const y = h / 2 + Math.sin(x / 40 + k) * Math.cos(x / 90 - k * 1.4) * h * 0.28;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke(); raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="asset">
      <div className="grid-bg" />
      <span className="asset-tag">{label}</span>
      <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <pre className="asset-code">{`Suno AI · voice synthesis · repair chain\n48kHz / dialogue isolate / master`}</pre>
    </div>
  );
}
