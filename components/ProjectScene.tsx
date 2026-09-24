'use client';
import ImageReveal from './ImageReveal';

export interface CaseFile { no: string; title: string; tag: string; problem: string; process: string; solution: string; result: string; }

export default function ProjectScene({ c, flip = false }: { c: CaseFile; flip?: boolean }) {
  return (
    <div className="file">
      <div className={flip ? 'visual' : ''} style={flip ? { order: 2 } : undefined}>
        <ImageReveal>
          <div className="visual">
            <div className="ph">
              <span className="asset-tag">CASE FILE {c.no} — {c.tag}</span>
              <div className="display" style={{ fontSize: 28 }}>{c.title}</div>
              <div className="label">REPLACE WITH FINAL RENDER / FLOWCHART STILL</div>
            </div>
          </div>
        </ImageReveal>
      </div>
      <div>
        <div className="label" style={{ color: '#2B4EFF' }}>{c.no} / CLASSIFIED TERMINAL</div>
        <h3 className="display" style={{ fontSize: 'clamp(36px,5vw,72px)', margin: '12px 0' }}>{c.title}</h3>
        <div className="ppsr mono">
          <div><b>PROBLEM</b>{c.problem}</div>
          <div><b>PROCESS</b>{c.process}</div>
          <div><b>SOLUTION</b>{c.solution}</div>
          <div><b>RESULT</b>{c.result}</div>
        </div>
      </div>
    </div>
  );
}
