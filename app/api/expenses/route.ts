import { getSupabaseAdmin } from '@/lib/supabase-server';
import { fail, ok, requiredNumber, requiredString } from '@/lib/server-helpers';

function addDays(dateStr: string, days: number) {
  const date = new Date(`${dateStr}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function addMonths(dateStr: string, months: number, desiredDay?: number | null) {
  const base = new Date(`${dateStr}T12:00:00`);
  const day = desiredDay || base.getDate();
  const next = new Date(base.getFullYear(), base.getMonth() + months, 1, 12, 0, 0);
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, lastDay));
  return next.toISOString().slice(0, 10);
}

function addYears(dateStr: string, years: number, desiredDay?: number | null) {
  const base = new Date(`${dateStr}T12:00:00`);
  const target = new Date(base.getFullYear() + years, base.getMonth(), 1, 12, 0, 0);
  const day = desiredDay || base.getDate();
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, lastDay));
  return target.toISOString().slice(0, 10);
}

function nextRecurrenceDate(dateStr: string, recurrence: string, step: number, desiredDay?: number | null) {
  switch (recurrence) {
    case 'SEMANAL': return addDays(dateStr, 7 * step);
    case 'QUINZENAL': return addDays(dateStr, 15 * step);
    case 'MENSAL': return addMonths(dateStr, step, desiredDay);
    case 'ANUAL': return addYears(dateStr, step, desiredDay);
    default: return dateStr;
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('despesas').select('*').order('data_despesa', { ascending: false }).order('created_at', { ascending: false });
    if (error) throw error;
    return ok({ expenses: data || [] });
  } catch (error) {
    return fail(error, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const recorrente = Boolean(body.recorrente);
    const tipo_recorrencia = recorrente ? requiredString(body.tipo_recorrencia, 'tipo_recorrencia') : 'SEM_RECORRENCIA';
    const quantidade_parcelas = recorrente ? Math.max(1, requiredNumber(body.quantidade_parcelas || 1, 'quantidade_parcelas')) : 1;
    const dia_recorrencia = recorrente && body.dia_recorrencia !== '' && body.dia_recorrencia != null ? requiredNumber(body.dia_recorrencia, 'dia_recorrencia') : null;
    const basePayload = {
      veiculo_id: requiredString(body.veiculo_id, 'veiculo_id'),
      modelo_despesa_id: typeof body.modelo_despesa_id === 'string' && body.modelo_despesa_id ? body.modelo_despesa_id : null,
      descricao: requiredString(body.descricao, 'descricao'),
      categoria: requiredString(body.categoria, 'categoria'),
      categoria_id: typeof body.categoria_id === 'string' && body.categoria_id ? body.categoria_id : null,
      tipo_despesa: requiredString(body.tipo_despesa, 'tipo_despesa'),
      valor: requiredNumber(body.valor, 'valor'),
      data_despesa: requiredString(body.data_despesa, 'data_despesa'),
      vencimento: typeof body.vencimento === 'string' && body.vencimento ? body.vencimento : null,
      pago: Boolean(body.pago),
      forma_pagamento: requiredString(body.forma_pagamento, 'forma_pagamento'),
      cartao_titular: typeof body.cartao_titular === 'string' && body.cartao_titular.trim() ? body.cartao_titular.trim() : null,
      recorrente,
      tipo_recorrencia,
      dia_recorrencia,
      quantidade_parcelas,
      observacao: typeof body.observacao === 'string' ? body.observacao.trim() : null,
    };

    const rows = Array.from({ length: quantidade_parcelas }, (_, index) => {
      const parcelaAtual = index + 1;
      const data = recorrente ? nextRecurrenceDate(basePayload.data_despesa, tipo_recorrencia, index, dia_recorrencia) : basePayload.data_despesa;
      const vencimento = basePayload.vencimento
        ? (recorrente ? nextRecurrenceDate(basePayload.vencimento, tipo_recorrencia, index, dia_recorrencia) : basePayload.vencimento)
        : null;
      return {
        ...basePayload,
        data_despesa: data,
        vencimento,
        parcela_atual: recorrente ? parcelaAtual : null,
        quantidade_parcelas: recorrente ? quantidade_parcelas : null,
      };
    });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('despesas').insert(rows).select();
    if (error) throw error;
    return ok({ expenses: data, createdCount: rows.length });
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('despesas').update({ pago: Boolean(body.pago) }).eq('id', requiredString(body.id, 'id')).select().single();
    if (error) throw error;
    return ok({ expense: data });
  } catch (error) {
    return fail(error);
  }
}
