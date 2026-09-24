'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from '@/lib/registerGsap';
import type { CoreState } from './DataCore3D';

const DataCoreCanvas = dynamic(() => import('./DataCoreCanvas'), { ssr: false });

export default function Engine() {
  const root = useRef<HTMLElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [state, setState] = useState<CoreState>('idle');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to({}, {
        ease: 'none',
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1,
          onUpdate: (s) => {
            const v = s.progress; setP(v);
            if (fill.current) fill.current.style.height = `${v * 100}%`;
            setState(v < 0.25 ? 'idle' : v < 0.55 ? 'processing' : 'splitting');
            gsap.set('.split-left', { xPercent: -20 * (1 - Math.min(1, v * 1.6)), opacity: Math.min(1, Math.max(0, (v - 0.45) * 3)) });
            gsap.set('.split-right', { xPercent: 20 * (1 - Math.min(1, v * 1.6)), opacity: Math.min(1, Math.max(0, (v - 0.45) * 3)) });
          }
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root as any} className="engine">
      <div className="engine-sticky">
        <div className="engine-core"><DataCoreCanvas state={state} scrollProgress={p} scale={1.6} /></div>
        <div className="progress-rail"><div ref={fill} className="progress-fill" /></div>
        <div className="label" style={{ position: 'absolute', top: 28, left: '4vw' }}>02 — THE ENGINE / {state.toUpperCase()} — {Math.round(p * 100)}%</div>
        <div className="split">
          <div className="split-left">
            <div className="tick">◈ LEFT PATHWAY — BACKEND LOGIC</div>
            <div className="display" style={{ fontSize: 'clamp(28px,4vw,64px)' }}>AUTOMATE</div>
            <div className="mono" style={{ color: '#8A8A93' }}>Make.com / n8n / WooCommerce<br />API orchestration → structured flow</div>
          </div>
          <div className="split-right">
            <div className="tick">RIGHT PATHWAY — CINEMATIC OUTPUT ◈</div>
            <div className="display" style={{ fontSize: 'clamp(28px,4vw,64px)' }}>RENDER</div>
            <div className="mono" style={{ color: '#8A8A93' }}>Veo3 / procedural film<br />data → light → story</div>
          </div>
        </div>
      </div>
    </section>
  );
}
