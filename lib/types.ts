export type UsuarioUso = 'FELIPE' | 'EVERTON';
export type TipoDespesa = 'FIXA' | 'VARIAVEL';
export type FormaPagamento = 'A_VISTA' | 'CARTAO' | 'BOLETO' | 'PIX' | 'TRANSFERENCIA';
export type TipoRecorrencia = 'SEM_RECORRENCIA' | 'SEMANAL' | 'QUINZENAL' | 'MENSAL' | 'ANUAL';

export type ExpenseCategory = {
  id: string;
  nome: string;
  ativo: boolean;
  created_at: string;
};

export type Vehicle = {
  id: string;
  nome: string;
  placa: string;
  km_atual: number;
  km_troca_oleo: number;
  ultima_troca_oleo_km: number;
  consumo_medio_km_litro: number;
  ativo: boolean;
  created_at: string;
};

export type ExpenseTemplate = {
  id: string;
  descricao: string;
  categoria: string;
  categoria_id: string | null;
  tipo_despesa: TipoDespesa;
  recorrente: boolean;
  tipo_recorrencia: TipoRecorrencia;
  dia_recorrencia: number | null;
  quantidade_parcelas: number | null;
  observacao: string | null;
  created_at: string;
};

export type Expense = {
  id: string;
  veiculo_id: string;
  modelo_despesa_id: string | null;
  descricao: string;
  categoria: string;
  categoria_id: string | null;
  tipo_despesa: TipoDespesa;
  valor: number;
  data_despesa: string;
  vencimento: string | null;
  pago: boolean;
  forma_pagamento: FormaPagamento;
  cartao_titular: string | null;
  recorrente: boolean;
  tipo_recorrencia: TipoRecorrencia;
  dia_recorrencia: number | null;
  quantidade_parcelas: number | null;
  parcela_atual: number | null;
  observacao: string | null;
  created_at: string;
};

export type Usage = {
  id: string;
  veiculo_id: string;
  usuario_uso: UsuarioUso;
  km_inicial: number;
  km_final: number | null;
  km_rodado: number | null;
  data_inicio: string;
  data_fim: string | null;
  status: 'ABERTO' | 'FINALIZADO';
  inferido: boolean;
  observacao: string | null;
  created_at: string;
};

export type DashboardData = {
  periodo_inicio: string;
  periodo_fim: string;
  total_despesas: number;
  total_fixas: number;
  total_variaveis: number;
  total_km_periodo: number;
  custo_por_km: number;
  felipe_km: number;
  everton_km: number;
  felipe_total_responsavel: number;
  everton_total_responsavel: number;
  proxima_troca_oleo_em_km: number | null;
  km_restante_para_oleo: number | null;
  uso_aberto: Usage | null;
};

export type Settings = {
  id: string;
  nome_app: string;
  proprietario_nome: string;
  segundo_condutor_nome: string;
  usuario_principal: UsuarioUso;
  veiculo_padrao_id: string | null;
  created_at: string;
};
