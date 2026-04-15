import { getSupabaseAdmin } from '@/lib/supabase-server';
import { fail, ok, requiredNumber, requiredString } from '@/lib/server-helpers';
export async function GET() {
  try { const supabase = getSupabaseAdmin(); const [{ data: usages, error }, { data: openUsage, error: openError }] = await Promise.all([supabase.from('usos').select('*').order('data_inicio', { ascending: false }).limit(20), supabase.from('usos').select('*').eq('usuario_uso','FELIPE').eq('status','ABERTO').order('data_inicio', { ascending: false }).limit(1).maybeSingle()]); if (error) throw error; if (openError) throw openError; return ok({ usages: usages || [], openUsage: openUsage || null }); } catch (error) { return fail(error, 500); }
}
export async function POST(request: Request) {
  try { const body = await request.json(); const supabase = getSupabaseAdmin(); const { data, error } = await supabase.rpc('start_felipe_use', { p_veiculo_id: requiredString(body.veiculo_id,'veiculo_id'), p_km_inicial: requiredNumber(body.km_inicial,'km_inicial'), p_observacao: typeof body.observacao === 'string' ? body.observacao.trim() : null }); if (error) throw error; return ok(data); } catch (error) { return fail(error); }
}
