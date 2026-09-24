'use client';
export default function FlowchartPlaceholder() {
  return (
    <div className="asset">
      <div className="grid-bg" />
      <span className="asset-tag">PLACEHOLDER — E-COMMERCE FLOWCHART UI</span>
      <svg viewBox="0 0 400 220" style={{ position: 'absolute', inset: 32, width: 'calc(100% - 64px)', height: 'calc(100% - 64px)' }}>
        <rect x="10" y="20" width="100" height="44" fill="none" stroke="#2B4EFF" />
        <rect x="150" y="20" width="100" height="44" fill="none" stroke="#F2F0EA" opacity=".5" />
        <rect x="150" y="120" width="100" height="44" fill="none" stroke="#F2F0EA" opacity=".5" />
        <rect x="290" y="70" width="100" height="44" fill="none" stroke="#2B4EFF" />
        <line x1="110" y1="42" x2="150" y2="42" stroke="#2B4EFF" />
        <line x1="200" y1="64" x2="200" y2="120" stroke="#8A8A93" strokeDasharray="4 4" />
        <line x1="250" y1="42" x2="290" y2="92" stroke="#8A8A93" />
        <circle cx="10" cy="42" r="3" fill="#2B4EFF" />
      </svg>
      <pre className="asset-code">{`TRIGGER: order.created\n→ n8n: validate → WooCommerce sync\n→ Make.com: invoice + CRM + notify`}</pre>
    </div>
  );
}
