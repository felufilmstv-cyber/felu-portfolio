'use client';
export default function DisciplineVariant({ index, title, code, body, children }: {
  index: string; title: string; code: string; body: string; children: React.ReactNode;
}) {
  return (
    <div className="h-panel">
      <div>
        <div className="disc-num">{index}</div>
        <h3 className="display disc-title">{title}</h3>
        <div className="line" style={{ margin: '22px 0' }} />
        <p className="disc-body mono">{body}</p>
        <div className="label" style={{ marginTop: 18, color: '#2B4EFF' }}>{code}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}
