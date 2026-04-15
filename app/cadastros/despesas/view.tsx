'use client';
import { useMemo, useState } from 'react';
import { Card } from '@/components/card';
import { Feedback } from '@/components/feedback';
import { useApi } from '@/lib/hooks/use-api';
import { apiFetch } from '@/lib/api';
import { ExpenseCategory, ExpenseTemplate, TipoDespesa, TipoRecorrencia } from '@/lib/types';
import { TIPOS_RECORRENCIA, CATEGORIAS_PADRAO } from '@/lib/constants';
import { recurrenceLabel } from '@/lib/utils';

export function ExpenseTemplatesClient() {
  const { data, loading, error, refresh } = useApi<{ templates: ExpenseTemplate[] }>('/api/expense-templates');
  const { data: categoriesData, refresh: refreshCategories } = useApi<{ categories: ExpenseCategory[] }>('/api/expense-categories');
  const [success, setSuccess] = useState<string | null>(null);
  const [categorySuccess, setCategorySuccess] = useState<string | null>(null);
  const categories = useMemo(() => categoriesData?.categories || [], [categoriesData]);
  const [newCategory, setNewCategory] = useState('');
  const [form, setForm] = useState({
    descricao:'',
    categoria:'OUTROS',
    categoria_id:'',
    tipo_despesa:'VARIAVEL' as TipoDespesa,
    recorrente:false,
    tipo_recorrencia:'MENSAL' as TipoRecorrencia,
    dia_recorrencia:5,
    quantidade_parcelas:12,
    observacao:''
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    await apiFetch('/api/expense-templates', {
      method:'POST',
      body:JSON.stringify({
        ...form,
        dia_recorrencia: form.recorrente ? form.dia_recorrencia : null,
        quantidade_parcelas: form.recorrente ? form.quantidade_parcelas : null,
        tipo_recorrencia: form.recorrente ? form.tipo_recorrencia : 'SEM_RECORRENCIA',
      })
    });
    setSuccess('Modelo de despesa salvo com sucesso.');
    setForm({ descricao:'', categoria:'OUTROS', categoria_id:'', tipo_despesa:'VARIAVEL', recorrente:false, tipo_recorrencia:'MENSAL', dia_recorrencia:5, quantidade_parcelas:12, observacao:'' });
    await refresh();
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setCategorySuccess(null);
    await apiFetch('/api/expense-categories', { method:'POST', body:JSON.stringify({ nome:newCategory }) });
    setNewCategory('');
    setCategorySuccess('Categoria cadastrada com sucesso.');
    await refreshCategories();
  }

  return <div className="grid two">
    <Card title="Nova categoria de despesa">
      <Feedback success={categorySuccess} />
      <form className="form-grid" onSubmit={saveCategory}>
        <div className="field"><label>Nome da categoria</label><input value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} required /></div>
        <div className="actions"><button className="btn primary" type="submit">Salvar categoria</button></div>
      </form>
      <div className="table-wrap"><table><thead><tr><th>Categorias disponíveis</th></tr></thead><tbody>{[...new Set([...CATEGORIAS_PADRAO, ...categories.map((item)=>item.nome)])].map((item)=><tr key={item}><td>{item}</td></tr>)}</tbody></table></div>
    </Card>

    <Card title="Novo modelo de despesa">
      <Feedback error={error} success={success} />
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="field"><label>Descrição</label><input value={form.descricao} onChange={(e)=>setForm({...form,descricao:e.target.value})} required /></div>
        <div className="form-grid two">
          <div className="field"><label>Categoria</label><select value={form.categoria} onChange={(e)=>setForm({...form,categoria:e.target.value, categoria_id: categories.find((item)=>item.nome===e.target.value)?.id || ''})}>{[...new Set([...CATEGORIAS_PADRAO, ...categories.map((item)=>item.nome)])].map((item)=><option key={item}>{item}</option>)}</select></div>
          <div className="field"><label>Tipo</label><select value={form.tipo_despesa} onChange={(e)=>setForm({...form,tipo_despesa:e.target.value as TipoDespesa})}><option value="FIXA">FIXA</option><option value="VARIAVEL">VARIAVEL</option></select></div>
        </div>
        <div className="field"><label><input type="checkbox" checked={form.recorrente} onChange={(e)=>setForm({...form,recorrente:e.target.checked})} /> Despesa recorrente</label></div>
        {form.recorrente ? <div className="form-grid three">
          <div className="field"><label>Como repete</label><select value={form.tipo_recorrencia} onChange={(e)=>setForm({...form,tipo_recorrencia:e.target.value as TipoRecorrencia})}>{TIPOS_RECORRENCIA.filter((item)=>item !== 'SEM_RECORRENCIA').map((item)=><option key={item} value={item}>{recurrenceLabel(item)}</option>)}</select></div>
          <div className="field"><label>{form.tipo_recorrencia === 'MENSAL' ? 'Dia do mês' : 'Dia base'}</label><input type="number" min="1" max="31" value={form.dia_recorrencia} onChange={(e)=>setForm({...form,dia_recorrencia:Number(e.target.value)})} /></div>
          <div className="field"><label>Quantidade de parcelas</label><input type="number" min="1" value={form.quantidade_parcelas} onChange={(e)=>setForm({...form,quantidade_parcelas:Number(e.target.value)})} /></div>
        </div> : null}
        <div className="field"><label>Observação</label><textarea value={form.observacao} onChange={(e)=>setForm({...form,observacao:e.target.value})} /></div>
        <div className="actions"><button className="btn primary" type="submit">Salvar modelo</button></div>
      </form>
    </Card>

    <Card title="Modelos cadastrados">
      {loading ? <p className="empty">Carregando...</p> : null}
      <div className="table-wrap"><table><thead><tr><th>Descrição</th><th>Categoria</th><th>Tipo</th><th>Recorrência</th></tr></thead><tbody>{data?.templates.map((item)=><tr key={item.id}><td>{item.descricao}</td><td>{item.categoria}</td><td><span className={`badge ${item.tipo_despesa === 'FIXA' ? 'dark' : 'success'}`}>{item.tipo_despesa}</span></td><td>{item.recorrente ? `${recurrenceLabel(item.tipo_recorrencia)}${item.tipo_recorrencia === 'MENSAL' && item.dia_recorrencia ? ` / dia ${item.dia_recorrencia}` : ''}${item.quantidade_parcelas ? ` / ${item.quantidade_parcelas} parcela(s)` : ''}` : 'Não'}</td></tr>)}</tbody></table></div>
      {!data?.templates.length ? <p className="empty">Nenhum modelo cadastrado.</p> : null}
    </Card>
  </div>;
}
