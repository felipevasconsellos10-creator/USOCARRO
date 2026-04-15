import { getSupabaseAdmin } from '@/lib/supabase-server';
import { fail, ok, requiredString } from '@/lib/server-helpers';
export async function GET() {
  try { const supabase = getSupabaseAdmin(); const { data, error } = await supabase.from('app_settings').select('*').limit(1).maybeSingle(); if (error) throw error; return ok({ settings: data || null }); } catch (error) { return fail(error, 500); }
}
export async function POST(request: Request) {
  try { const body = await request.json(); const supabase = getSupabaseAdmin(); const { data: current, error: currentError } = await supabase.from('app_settings').select('*').limit(1).maybeSingle(); if (currentError) throw currentError; const payload = { nome_app: requiredString(body.nome_app,'nome_app'), proprietario_nome: requiredString(body.proprietario_nome,'proprietario_nome'), segundo_condutor_nome: requiredString(body.segundo_condutor_nome,'segundo_condutor_nome'), usuario_principal: 'FELIPE', veiculo_padrao_id: typeof body.veiculo_padrao_id === 'string' && body.veiculo_padrao_id ? body.veiculo_padrao_id : null }; const result = current?.id ? await supabase.from('app_settings').update(payload).eq('id', current.id).select().single() : await supabase.from('app_settings').insert(payload).select().single(); if (result.error) throw result.error; return ok({ settings: result.data }); } catch (error) { return fail(error); }
}
