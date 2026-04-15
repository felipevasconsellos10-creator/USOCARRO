import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
export function AppShell({ children }: { children: ReactNode }) {
  return <div className="layout-shell layout-with-sidebar"><Sidebar /><main className="page-wrap">{children}</main></div>;
}
