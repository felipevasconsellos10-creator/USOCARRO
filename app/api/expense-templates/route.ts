import { getSupabaseAdmin } from '@/lib/supabase-server';
import { fail, ok, requiredNumber, requiredString } from '@/lib/server-helpers';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('modelos_despesa').select('*').order('descricao');
    if (error) throw error;
    return ok({ templates: data || [] });
  } catch (error) {
    return fail(error, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const recorrente = Boolean(body.recorrente);
    const tipo_recorrencia = recorrente ? requiredString(body.tipo_recorrencia, 'tipo_recorrencia') : 'SEM_RECORRENCIA';
    const payload = {
      descricao: requiredString(body.descricao, 'descricao'),
      categoria: requiredString(body.categoria, 'categoria'),
      categoria_id: typeof body.categoria_id === 'string' && body.categoria_id ? body.categoria_id : null,
      tipo_despesa: requiredString(body.tipo_despesa, 'tipo_despesa'),
      recorrente,
      tipo_recorrencia,
      dia_recorrencia: recorrente && body.dia_recorrencia !== '' && body.dia_recorrencia != null ? requiredNumber(body.dia_recorrencia, 'dia_recorrencia') : null,
      quantidade_parcelas: recorrente && body.quantidade_parcelas !== '' && body.quantidade_parcelas != null ? requiredNumber(body.quantidade_parcelas, 'quantidade_parcelas') : null,
      observacao: typeof body.observacao === 'string' ? body.observacao.trim() : null,
    };
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('modelos_despesa').insert(payload).select().single();
    if (error) throw error;
    return ok({ template: data });
  } catch (error) {
    return fail(error);
  }
}
