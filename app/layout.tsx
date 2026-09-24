import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import LoadingScreen from '@/components/LoadingScreen';

export const metadata: Metadata = {
  title: 'FELU AUTOMATION DEV — Architecting Workflows. Directing AI.',
  description: 'High-end technical consultant: business automation & AI digital media. Data Core cinematic experience.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LoadingScreen />
        <Navigation />
        {children}
        <footer><span>© 2026 FELU AUTOMATION DEV</span><span>LAGOS / REMOTE — WORLDWIDE</span></footer>
      </body>
    </html>
  );
}
