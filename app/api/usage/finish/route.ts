import { getSupabaseAdmin } from '@/lib/supabase-server';
import { fail, ok, requiredNumber, requiredString } from '@/lib/server-helpers';
export async function POST(request: Request) {
  try { const body = await request.json(); const supabase = getSupabaseAdmin(); const { data, error } = await supabase.rpc('finish_felipe_use', { p_uso_id: requiredString(body.id,'id'), p_km_final: requiredNumber(body.km_final,'km_final'), p_observacao: typeof body.observacao === 'string' ? body.observacao.trim() : null }); if (error) throw error; return ok(data); } catch (error) { return fail(error); }
}
