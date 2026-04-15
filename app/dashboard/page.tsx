import { AppShell } from '@/components/shell';
import { PageHeader } from '@/components/page-header';
import { DashboardClient } from './view';
export default function Page() { return <AppShell><PageHeader title="Dashboard" description="Resumo mensal ou por período do custo do carro e do rateio por quilometragem." /><DashboardClient /></AppShell>; }
