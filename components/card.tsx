import { ReactNode } from 'react';
export function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return <section className="card"><div className="section-title"><div><h3>{title}</h3>{subtitle ? <div className="small">{subtitle}</div> : null}</div></div>{children}</section>;
}
