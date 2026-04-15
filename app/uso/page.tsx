import { AppShell } from '@/components/shell';
import { PageHeader } from '@/components/page-header';
import { UsageClient } from './view';
export default function Page() { return <AppShell><PageHeader title="Registrar uso" description="Registre o km inicial e final do Felipe. A diferença entre um uso seu e outro vira uso do Everton automaticamente." /><UsageClient /></AppShell>; }
