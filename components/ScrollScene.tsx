'use client';
export default function ScrollScene({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return <section id={id} className={className}>{children}</section>;
}
