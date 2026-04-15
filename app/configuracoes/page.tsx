import { AppShell } from '@/components/shell';
import { PageHeader } from '@/components/page-header';
import { SettingsClient } from './view';
export default function Page() { return <AppShell><PageHeader title="Configurações" description="Defina o veículo padrão, nomes e parâmetros do aplicativo." /><SettingsClient /></AppShell>; }
