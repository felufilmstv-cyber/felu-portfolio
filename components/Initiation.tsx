'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from '@/lib/registerGsap';

const DataCoreCanvas = dynamic(() => import('./DataCoreCanvas'), { ssr: false });

export default function Initiation() {
  const root = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to({}, {
        ease: 'none',
        scrollTrigger: {
          trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 1,
          onUpdate: (s) => setP(s.progress)
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root as any} id="contact" className="initiation">
      <div className="init-sticky">
        <div style={{ height: '60vh' }}>
          <DataCoreCanvas state="condensed" scrollProgress={p} scale={1.1} lighting={{ intensity: 3 }} />
          <div className="label" style={{ textAlign: 'center' }}>CORE RETURN — CONDENSING {Math.round(p * 100)}%</div>
        </div>
        <div>
          <div className="label">07 — INITIATION / FINAL MOMENT</div>
          <h2 className="display" style={{ fontSize: 'clamp(48px,6vw,96px)', margin: '14px 0 28px' }}>INITIATE<br />A PROJECT<span style={{ color: '#2B4EFF' }}>.</span></h2>
          {!sent ? (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="field-wrap"><input required className="field" placeholder="NAME / ORGANISATION" /></div>
              <div className="field-wrap"><input required type="email" className="field" placeholder="EMAIL" /></div>
              <div className="field-wrap"><input className="field" placeholder="MISSION — AUTOMATION / FILM / VOICE" /></div>
              <button className="btn" type="submit">TRANSMIT →</button>
            </form>
          ) : (
            <div className="mono" style={{ border: '1px solid #2B4EFF', padding: 24 }}>
              <span style={{ color: '#2B4EFF' }}>◈ SIGNAL RECEIVED.</span><br />Core locked. Expect response within 48h.
            </div>
          )}
          <div className="label" style={{ marginTop: 28 }}>FAVOUR ADEFELU ADELEYE — AUTOMATION × MEDIA</div>
        </div>
      </div>
    </section>
  );
}
