'use client';
import { useState } from 'react';

const LINKS = [
  { label: 'VAULT', href: '#vault' },
  { label: 'PROCESS', href: '#process' },
  { label: 'ARSENAL', href: '#arsenal' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <a href="#top" className="brand">FAVOUR ADEFELU ADELEYE</a>
          <div className="nav-links">
            {LINKS.map(l => <a key={l.label} href={l.href}>{l.label}</a>)}
          </div>
          <button className="burger" onClick={() => setOpen(!open)} style={{ display: 'none' }}>{open ? 'CLOSE' : 'MENU'}</button>
        </div>
      </nav>
      {open && (
        <div className="mobile-menu">
          {LINKS.map(l => <a key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}
        </div>
      )}
      <style jsx>{`@media(max-width:900px){.nav-links{display:none}.burger{display:block!important}}`}</style>
    </>
  );
}
