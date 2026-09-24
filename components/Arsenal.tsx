'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/registerGsap';
import DisciplineVariant from './DisciplineVariant';
import FlowchartPlaceholder from './FlowchartPlaceholder';
import CinematicPlaceholder from './CinematicPlaceholder';
import WaveformPlaceholder from './WaveformPlaceholder';

export default function Arsenal() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 901px)', () => {
        gsap.to('.h-track', {
          xPercent: -66.666, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=2800', pin: true, scrub: 1 }
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root as any} id="arsenal" className="arsenal">
      <div className="label" style={{ padding: '48px 4vw 0' }}>03 — CAPABILITIES / THE ARSENAL</div>
      <div className="h-track">
        <DisciplineVariant index="DISCIPLINE 01" title="WORKFLOW ARCHITECTURE" code="MAKE.COM / N8N / WOOCOMMERCE / APIS" body="Backend systems that remove manual work. Orders, CRMs, invoices and notifications compiled into one deterministic flow — auditable, retryable, scalable.">
          <FlowchartPlaceholder />
        </DisciplineVariant>
        <DisciplineVariant index="DISCIPLINE 02" title="AI VIDEO PRODUCTION" code="VEO3 / PROCEDURAL FILM PIPELINE" body="Prompt-to-screen direction. Treatment, shot logic, consistent characters and grade — rendered as episodic output for FeluFilms TV.">
          <CinematicPlaceholder />
        </DisciplineVariant>
        <DisciplineVariant index="DISCIPLINE 03" title="INTELLIGENT AUDIO" code="SUNO AI / VOICE SYNTHESIS / REPAIR" body="Voice receptionists, narration and scored sound. Synthesis tuned for natural cadence, plus dialogue isolation and mastering chains.">
          <WaveformPlaceholder />
        </DisciplineVariant>
      </div>
    </section>
  );
}
