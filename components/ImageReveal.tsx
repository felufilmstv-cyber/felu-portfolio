'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/registerGsap';

// Scroll-controlled mask reveal — no generic fade.
export default function ImageReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { clipPath: 'inset(12% 8% 12% 8%)', scale: 0.98 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'top 30%', scrub: 1 } });
    });
    return () => ctx.revert();
  }, []);
  return <div ref={ref} style={{ willChange: 'clip-path,transform' }}>{children}</div>;
}
