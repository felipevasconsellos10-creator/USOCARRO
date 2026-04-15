import { AppShell } from '@/components/shell';
import { PageHeader } from '@/components/page-header';
import { VehiclesClient } from './view';
export default function Page() { return <AppShell><PageHeader title="Cadastro de veículo" description="Cadastre o veículo, km atual, troca de óleo e consumo médio." /><VehiclesClient /></AppShell>; }
