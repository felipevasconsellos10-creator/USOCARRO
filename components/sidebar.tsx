'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CarFront, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { MENU_ITEMS } from '@/lib/constants';
export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (<>
    <button className="sidebar-toggle" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu size={22} /></button>
    {open ? <div className="sidebar-backdrop" onClick={() => setOpen(false)} /> : null}
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ background: '#e2e8f0', borderRadius: 14, padding: 10, display: 'flex' }}><CarFront size={22} /></div>
          <div><div className="small">Controle do carro</div><strong>Felipe</strong></div>
        </div>
        <button className="btn secondary" style={{ padding: 10 }} onClick={() => setOpen(false)}><X size={16} /></button>
      </div>
      <nav>{MENU_ITEMS.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={pathname === item.href ? 'active' : ''}>{item.label}</Link>)}</nav>
    </aside>
  </>);
}
