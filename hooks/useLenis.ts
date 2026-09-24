'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { registerGsap, ScrollTrigger } from '@/lib/registerGsap';

export function useLenis() {
  useEffect(() => {
    registerGsap();
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
}
