'use client';
import ProjectScene, { CaseFile } from './ProjectScene';

const CASES: CaseFile[] = [
  { no: 'FILE 01', title: 'E-COMMERCE AUTOMATION MATRIX', tag: 'WOOCOMMERCE / N8N',
    problem: 'Manual orders + stock errors.', process: 'Audit → n8n blueprint → API mesh.', solution: 'Matrix: sync, invoice, CRM, alerts.', result: '0 manual touches. 24/7 flow.' },
  { no: 'FILE 02', title: 'FELUFILMS TV PRODUCTION', tag: 'VEO3 / CINEMATIC PIPELINE',
    problem: 'Costly episodic shoots.', process: 'Treatment → prompt direction → grade.', solution: 'Procedural film system.', result: 'Series output at indie cost.' },
  { no: 'FILE 03', title: 'AI VOICE RECEPTIONISTS', tag: 'VOICE SYNTH / SUNO',
    problem: 'Missed calls = lost revenue.', process: 'Script → synthesis → repair chain.', solution: 'Always-on receptionist.', result: 'Every call answered, logged.' },
];

export default function Vault() {
  return (
    <section id="vault" className="vault">
      <div style={{ padding: '0 4vw 6vh' }}>
        <div className="label">05 — THE VAULT / CASE FILES</div>
        <h2 className="display" style={{ fontSize: 'clamp(48px,9vw,148px)' }}>PROOF<span style={{ color: '#2B4EFF' }}>.</span></h2>
      </div>
      {CASES.map((c, i) => <ProjectScene key={c.no} c={c} flip={i % 2 === 1} />)}
    </section>
  );
}
