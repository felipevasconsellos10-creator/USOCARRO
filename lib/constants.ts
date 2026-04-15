import { FormaPagamento, TipoRecorrencia } from './types';
export const MENU_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/cadastros/veiculos', label: 'Cadastro de veículo' },
  { href: '/cadastros/despesas', label: 'Cadastro de despesas' },
  { href: '/financeiro', label: 'Financeiro' },
  { href: '/uso', label: 'Registrar uso' },
  { href: '/relatorios', label: 'Relatórios' },
  { href: '/configuracoes', label: 'Configurações' },
] as const;

export const CATEGORIAS_PADRAO = ['FINANCIAMENTO','IPVA','LICENCIAMENTO','SEGURO','MANUTENCAO','OLEO','PNEU','COMBUSTIVEL','LAVAGEM','OUTROS'] as const;
export const FORMAS_PAGAMENTO: FormaPagamento[] = ['A_VISTA', 'CARTAO', 'BOLETO', 'PIX', 'TRANSFERENCIA'];
export const TIPOS_RECORRENCIA: TipoRecorrencia[] = ['SEM_RECORRENCIA', 'SEMANAL', 'QUINZENAL', 'MENSAL', 'ANUAL'];
