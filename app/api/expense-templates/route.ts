import { getSupabaseAdmin } from '@/lib/supabase-server';
import { fail, ok, requiredString } from '@/lib/server-helpers';
export async function GET() {
  try { const supabase = getSupabaseAdmin(); const { data, error } = await supabase.from('modelos_despesa').select('*').order('descricao'); if (error) throw error; return ok({ templates: data || [] }); } catch (error) { return fail(error, 500); }
}
export async function POST(request: Request) {
  try { const body = await request.json(); const payload = { descricao: requiredString(body.descricao,'descricao'), categoria: requiredString(body.categoria,'categoria'), tipo_despesa: requiredString(body.tipo_despesa,'tipo_despesa'), recorrente: Boolean(body.recorrente), observacao: typeof body.observacao === 'string' ? body.observacao.trim() : null }; const supabase = getSupabaseAdmin(); const { data, error } = await supabase.from('modelos_despesa').insert(payload).select().single(); if (error) throw error; return ok({ template: data }); } catch (error) { return fail(error); }
}
