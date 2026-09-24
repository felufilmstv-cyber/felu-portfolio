'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLenis } from '@/hooks/useLenis';
import { registerGsap } from '@/lib/registerGsap';
import Opening from '@/components/Opening';
import Engine from '@/components/Engine';
import Arsenal from '@/components/Arsenal';
import ProcessSection from '@/components/ProcessSection';
import Vault from '@/components/Vault';
import BrandStatement from '@/components/BrandStatement';
import Initiation from '@/components/Initiation';

export default function Page() {
  useLenis();
  useEffect(() => { registerGsap(); }, []);
  return (
    <main>
      <Opening />
      <Engine />
      <Arsenal />
      <ProcessSection />
      <Vault />
      <BrandStatement />
      <Initiation />
    </main>
  );
}
