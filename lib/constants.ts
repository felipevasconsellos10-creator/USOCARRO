import { CategoriaDespesa } from './types';
export const MENU_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/cadastros/veiculos', label: 'Cadastro de veículo' },
  { href: '/cadastros/despesas', label: 'Cadastro de despesas' },
  { href: '/financeiro', label: 'Financeiro' },
  { href: '/uso', label: 'Registrar uso' },
  { href: '/relatorios', label: 'Relatórios' },
  { href: '/configuracoes', label: 'Configurações' },
] as const;
export const CATEGORIAS_DESPESA: CategoriaDespesa[] = ['FINANCIAMENTO','IPVA','LICENCIAMENTO','SEGURO','MANUTENCAO','OLEO','PNEU','COMBUSTIVEL','LAVAGEM','OUTROS'];
