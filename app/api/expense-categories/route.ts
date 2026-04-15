import { getSupabaseAdmin } from '@/lib/supabase-server';
import { fail, ok, requiredString } from '@/lib/server-helpers';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('categorias_despesa').select('*').eq('ativo', true).order('nome');
    if (error) throw error;
    return ok({ categories: data || [] });
  } catch (error) {
    return fail(error, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nome = requiredString(body.nome, 'nome').toUpperCase();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('categorias_despesa').insert({ nome }).select().single();
    if (error) throw error;
    return ok({ category: data });
  } catch (error) {
    return fail(error);
  }
}
