import { getSupabaseAdmin } from '@/lib/supabase-server';
import { fail, ok, requiredNumber, requiredString } from '@/lib/server-helpers';
export async function GET() {
  try { const supabase = getSupabaseAdmin(); const { data, error } = await supabase.from('veiculos').select('*').order('created_at', { ascending: false }); if (error) throw error; return ok({ vehicles: data || [] }); } catch (error) { return fail(error, 500); }
}
export async function POST(request: Request) {
  try { const body = await request.json(); const payload = { nome: requiredString(body.nome,'nome'), placa: requiredString(body.placa,'placa'), km_atual: requiredNumber(body.km_atual,'km_atual'), km_troca_oleo: requiredNumber(body.km_troca_oleo,'km_troca_oleo'), ultima_troca_oleo_km: requiredNumber(body.ultima_troca_oleo_km,'ultima_troca_oleo_km'), consumo_medio_km_litro: requiredNumber(body.consumo_medio_km_litro,'consumo_medio_km_litro') }; const supabase = getSupabaseAdmin(); const { data, error } = await supabase.from('veiculos').insert(payload).select().single(); if (error) throw error; const { data: settings } = await supabase.from('app_settings').select('id, veiculo_padrao_id').limit(1).maybeSingle(); if (settings?.id && !settings.veiculo_padrao_id) await supabase.from('app_settings').update({ veiculo_padrao_id: data.id }).eq('id', settings.id); return ok({ vehicle: data }); } catch (error) { return fail(error); }
}
