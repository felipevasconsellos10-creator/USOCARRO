import { AppShell } from '@/components/shell';
import { PageHeader } from '@/components/page-header';
import { ExpenseTemplatesClient } from './view';
export default function Page() { return <AppShell><PageHeader title="Cadastro de despesas" description="Defina os tipos de despesa como fixa ou variável para o rateio automático." /><ExpenseTemplatesClient /></AppShell>; }
