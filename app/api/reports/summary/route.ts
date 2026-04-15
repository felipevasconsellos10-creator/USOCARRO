import { getSupabaseAdmin } from '@/lib/supabase-server';
import { fail, ok } from '@/lib/server-helpers';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10);
    const end = searchParams.get('end') || new Date().toISOString().slice(0,10);
    const supabase = getSupabaseAdmin();
    const [expensesRes, usesRes, vehiclesRes] = await Promise.all([
      supabase.from('despesas').select('*').gte('data_despesa', start).lte('data_despesa', end),
      supabase.from('usos').select('*').gte('data_inicio', `${start}T00:00:00`).lte('data_inicio', `${end}T23:59:59`).eq('status','FINALIZADO'),
      supabase.from('veiculos').select('*').limit(1),
    ]);
    if (expensesRes.error) throw expensesRes.error;
    if (usesRes.error) throw usesRes.error;
    if (vehiclesRes.error) throw vehiclesRes.error;
    const expenses = (expensesRes.data ?? []) as Array<Record<string, unknown>>;
    const uses = (usesRes.data ?? []) as Array<Record<string, unknown>>;
    const vehicle = (vehiclesRes.data?.[0] ?? null) as Record<string, unknown> | null;
    const despesasPorCategoria = Object.entries(expenses.reduce<Record<string, number>>((acc, item) => { const key = String(item.categoria); acc[key] = (acc[key] || 0) + Number(item.valor); return acc; }, {})).map(([categoria, total]) => ({ categoria, total }));
    const despesasPorTipo = Object.entries(expenses.reduce<Record<string, number>>((acc, item) => { const key = String(item.tipo_despesa); acc[key] = (acc[key] || 0) + Number(item.valor); return acc; }, {})).map(([tipo_despesa, total]) => ({ tipo_despesa, total }));
    const usosPorUsuario = Object.entries(uses.reduce<Record<string, number>>((acc, item) => { const key = String(item.usuario_uso); acc[key] = (acc[key] || 0) + Number(item.km_rodado || 0); return acc; }, {})).map(([usuario_uso, km_total]) => ({ usuario_uso, km_total }));
    const km_total = uses.reduce((sum: number, item) => sum + Number(item.km_rodado || 0), 0);
    const custo_total_combustivel = expenses.filter((item) => item.categoria === 'COMBUSTIVEL').reduce((sum: number, item) => sum + Number(item.valor), 0);
    const litros_estimados = vehicle ? km_total / Number(vehicle.consumo_medio_km_litro || 1) : 0;
    const total_fixas = expenses.filter((item) => item.tipo_despesa === 'FIXA').reduce((sum: number, item) => sum + Number(item.valor), 0);
    const total_variaveis = expenses.filter((item) => item.tipo_despesa === 'VARIAVEL').reduce((sum: number, item) => sum + Number(item.valor), 0);
    const custo_por_km = km_total > 0 ? total_variaveis / km_total : 0;
    const rateio = usosPorUsuario.map((item) => ({ usuario_uso: item.usuario_uso, total_responsavel: (item.usuario_uso === 'FELIPE' ? total_fixas : 0) + Number(item.km_total) * custo_por_km }));
    return ok({ summary: { despesasPorCategoria, despesasPorTipo, usosPorUsuario, abastecimentos: [{ litros_estimados, km_total, custo_total: custo_total_combustivel }], rateio } });
  } catch (error) {
    return fail(error, 500);
  }
}
