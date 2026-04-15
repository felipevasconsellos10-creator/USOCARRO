import { getSupabaseAdmin } from '@/lib/supabase-server';
import { fail, ok, requiredNumber, requiredString } from '@/lib/server-helpers';
export async function GET() {
  try { const supabase = getSupabaseAdmin(); const { data, error } = await supabase.from('despesas').select('*').order('data_despesa', { ascending: false }).order('created_at', { ascending: false }); if (error) throw error; return ok({ expenses: data || [] }); } catch (error) { return fail(error, 500); }
}
export async function POST(request: Request) {
  try { const body = await request.json(); const payload = { veiculo_id: requiredString(body.veiculo_id,'veiculo_id'), modelo_despesa_id: typeof body.modelo_despesa_id === 'string' && body.modelo_despesa_id ? body.modelo_despesa_id : null, descricao: requiredString(body.descricao,'descricao'), categoria: requiredString(body.categoria,'categoria'), tipo_despesa: requiredString(body.tipo_despesa,'tipo_despesa'), valor: requiredNumber(body.valor,'valor'), data_despesa: requiredString(body.data_despesa,'data_despesa'), vencimento: typeof body.vencimento === 'string' && body.vencimento ? body.vencimento : null, pago: Boolean(body.pago), observacao: typeof body.observacao === 'string' ? body.observacao.trim() : null }; const supabase = getSupabaseAdmin(); const { data, error } = await supabase.from('despesas').insert(payload).select().single(); if (error) throw error; return ok({ expense: data }); } catch (error) { return fail(error); }
}
export async function PATCH(request: Request) {
  try { const body = await request.json(); const supabase = getSupabaseAdmin(); const { data, error } = await supabase.from('despesas').update({ pago: Boolean(body.pago) }).eq('id', requiredString(body.id,'id')).select().single(); if (error) throw error; return ok({ expense: data }); } catch (error) { return fail(error); }
}
