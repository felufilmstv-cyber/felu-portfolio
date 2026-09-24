'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/registerGsap';

export default function LoadingScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const o = { v: 0 };
      gsap.to(o, {
        v: 100, duration: 1.6, ease: 'power2.inOut',
        onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, '0'); },
        onComplete: () => {
          gsap.to(ref.current, { yPercent: -100, duration: 1, ease: 'power4.inOut', delay: 0.2,
            onComplete: () => ref.current?.remove() });
        }
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className="loader">
      <div style={{ width: '100%' }}>
        <div className="label">FELU AUTOMATION DEV — INITIALISING CORE</div>
        <div className="display" style={{ fontSize: 'clamp(60px,12vw,160px)' }}><span ref={num}>000</span></div>
      </div>
    </div>
  );
}
