'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/registerGsap';

const STAGES = [
  { n: '01', t: 'AUDIT', d: 'Raw data. Map every leak — manual entry, missed follow-ups, fragmented tools. Nothing is automated until it is measured.' },
  { n: '02', t: 'ARCHITECT', d: 'Structured code. Systems blueprint: triggers, schemas, APIs, failure paths. The Data Core takes shape.' },
  { n: '03', t: 'INTEGRATE', d: 'Connected tissue. WooCommerce, CRMs, media pipelines wired into one nervous system.' },
  { n: '04', t: 'AUTOMATE', d: 'Flowing UI. Humans approve, machines execute. Voice agents, render queues and notifications run 24/7.' },
  { n: '05', t: 'SCALE', d: 'Compounding output. From one workflow to a matrix — more volume, same headcount, cinematic consistency.' },
];

export default function ProcessSection() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      STAGES.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: `.stage-${i}`, start: 'top 62%', end: 'bottom 40%',
          onToggle: (s) => document.querySelector(`.stage-${i}`)?.classList.toggle('active', s.isActive)
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root as any} id="process" className="process">
      <div className="wrap"><div className="label">04 — THE PROCESS / TECHNICAL DOCUMENTARY</div>
        <h2 className="display" style={{ fontSize: 'clamp(48px,8vw,128px)', margin: '16px 0 40px' }}>RAW → RENDER</h2>
      </div>
      {STAGES.map((s, i) => (
        <div key={s.n} className={`stage stage-${i}`}>
          <div className="mono label">{s.n} / 05</div>
          <div><h3>{s.t}</h3><p className="mono" style={{ marginTop: 12 }}>{s.d}</p></div>
        </div>
      ))}
    </section>
  );
}
