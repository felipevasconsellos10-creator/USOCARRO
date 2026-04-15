import { AppShell } from '@/components/shell';
import { PageHeader } from '@/components/page-header';
import { ReportsClient } from './view';
export default function Page() { return <AppShell><PageHeader title="Relatórios" description="Veja relatórios de despesas, uso, abastecimento, consumo e rateio por usuário." /><ReportsClient /></AppShell>; }
