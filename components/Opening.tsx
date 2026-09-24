'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from '@/lib/registerGsap';
import TypographyReveal from './TypographyReveal';

const DataCoreCanvas = dynamic(() => import('./DataCoreCanvas'), { ssr: false });

export default function Opening() {
  const root = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-title', {
        yPercent: -18, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1 }
      });
      ScrollTrigger.getAll();
      gsap.to({ v: 0 }, {
        v: 1, ease: 'none',
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1,
          onUpdate: (s) => setProgress(s.progress)
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root as any} id="top" className="opening">
      <div className="opening-sticky">
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="label">FELU AUTOMATION DEV — SYS.01 / DATA CORE ONLINE</div>
          <h1 className="display hero-title" style={{ marginTop: 18 }}>
            <TypographyReveal>ARCHITECTING</TypographyReveal>
            <TypographyReveal delay={0.08}>WORKFLOWS<span style={{ color: '#2B4EFF' }}>.</span></TypographyReveal>
            <TypographyReveal delay={0.16}><span className="thin">DIRECTING AI.</span></TypographyReveal>
          </h1>
          <p className="mono" style={{ marginTop: 22, color: '#8A8A93', maxWidth: 46 + 'ch' }}>
            Business automation × AI digital media. Scroll to compile the system — data becomes cinematic output.
          </p>
        </div>
        <div className="core-stage">
          <DataCoreCanvas state="idle" scrollProgress={progress} scale={1.15} />
        </div>
        <div className="scroll-hint mono label"><span>SCROLL — COMPILE</span><span style={{ color: '#2B4EFF' }}>●</span><span>00.{Math.round(progress * 100)}</span></div>
      </div>
    </section>
  );
}
