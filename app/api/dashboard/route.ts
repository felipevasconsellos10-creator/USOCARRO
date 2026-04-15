import { getSupabaseAdmin } from '@/lib/supabase-server';
import { fail, ok } from '@/lib/server-helpers';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10);
    const end = searchParams.get('end') || new Date().toISOString().slice(0,10);
    const supabase = getSupabaseAdmin();
    const [vehiclesRes, expensesRes, usesRes, openUsageRes] = await Promise.all([
      supabase.from('veiculos').select('*').order('created_at').limit(1),
      supabase.from('despesas').select('*').gte('data_despesa', start).lte('data_despesa', end),
      supabase.from('usos').select('*').gte('data_inicio', `${start}T00:00:00`).lte('data_inicio', `${end}T23:59:59`).eq('status','FINALIZADO'),
      supabase.from('usos').select('*').eq('usuario_uso','FELIPE').eq('status','ABERTO').order('data_inicio', { ascending:false }).limit(1).maybeSingle(),
    ]);
    if (vehiclesRes.error) throw vehiclesRes.error;
    if (expensesRes.error) throw expensesRes.error;
    if (usesRes.error) throw usesRes.error;
    if (openUsageRes.error) throw openUsageRes.error;
    const vehicle = (vehiclesRes.data?.[0] ?? null) as Record<string, unknown> | null;
    const expenses = (expensesRes.data ?? []) as Array<Record<string, unknown>>;
    const uses = (usesRes.data ?? []) as Array<Record<string, unknown>>;
    const total_fixas = expenses.filter((item) => item.tipo_despesa === 'FIXA').reduce((sum: number, item) => sum + Number(item.valor), 0);
    const total_variaveis = expenses.filter((item) => item.tipo_despesa === 'VARIAVEL').reduce((sum: number, item) => sum + Number(item.valor), 0);
    const total_despesas = total_fixas + total_variaveis;
    const felipe_km = uses.filter((item) => item.usuario_uso === 'FELIPE').reduce((sum: number, item) => sum + Number(item.km_rodado || 0), 0);
    const everton_km = uses.filter((item) => item.usuario_uso === 'EVERTON').reduce((sum: number, item) => sum + Number(item.km_rodado || 0), 0);
    const total_km_periodo = felipe_km + everton_km;
    const custo_por_km = total_km_periodo > 0 ? total_variaveis / total_km_periodo : 0;
    const felipe_total_responsavel = total_fixas + felipe_km * custo_por_km;
    const everton_total_responsavel = everton_km * custo_por_km;
    const proxima_troca_oleo_em_km = vehicle ? Number(vehicle.ultima_troca_oleo_km) + Number(vehicle.km_troca_oleo) : null;
    const km_restante_para_oleo = vehicle && proxima_troca_oleo_em_km !== null ? proxima_troca_oleo_em_km - Number(vehicle.km_atual) : null;
    return ok({ periodo_inicio:start, periodo_fim:end, total_despesas, total_fixas, total_variaveis, total_km_periodo, custo_por_km, felipe_km, everton_km, felipe_total_responsavel, everton_total_responsavel, proxima_troca_oleo_em_km, km_restante_para_oleo, uso_aberto: openUsageRes.data || null });
  } catch (error) {
    return fail(error, 500);
  }
}
