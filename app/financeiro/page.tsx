import { AppShell } from '@/components/shell';
import { PageHeader } from '@/components/page-header';
import { FinanceClient } from './view';
export default function Page() { return <AppShell><PageHeader title="Financeiro" description="Lance despesas, contas a pagar e marque pagamentos." /><FinanceClient /></AppShell>; }
