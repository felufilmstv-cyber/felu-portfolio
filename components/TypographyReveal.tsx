'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/registerGsap';

export default function TypographyReveal({ children, delay = 0, as: Tag = 'span' }: { children: React.ReactNode; delay?: number; as?: any }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { yPercent: 110 }, {
        yPercent: 0, duration: 1.1, delay, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
    return () => ctx.revert();
  }, [delay]);
  return <span className="reveal-mask"><Tag ref={ref}>{children}</Tag></span>;
}
