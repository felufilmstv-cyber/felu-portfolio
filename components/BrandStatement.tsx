'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/registerGsap';

export default function BrandStatement() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.brand-line', { yPercent: 60, opacity: 0 }, {
        yPercent: 0, opacity: 1, stagger: 0.12, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center 40%', scrub: 1 }
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root as any} className="brand-stmt">
      <h2 className="display">
        <span className="brand-line" style={{ display: 'block' }}>CODE THAT THINKS.</span>
        <span className="brand-line" style={{ display: 'block', color: 'transparent', WebkitTextStroke: '1px #F2F0EA' }}>MEDIA THAT SCALES.</span>
      </h2>
    </section>
  );
}
