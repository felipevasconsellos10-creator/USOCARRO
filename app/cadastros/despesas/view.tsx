'use client';
import { useState } from 'react';
import { Card } from '@/components/card';
import { Feedback } from '@/components/feedback';
import { useApi } from '@/lib/hooks/use-api';
import { apiFetch } from '@/lib/api';
import { CATEGORIAS_DESPESA } from '@/lib/constants';
import { ExpenseTemplate, TipoDespesa } from '@/lib/types';
export function ExpenseTemplatesClient() {
  const { data, loading, error, refresh } = useApi<{ templates: ExpenseTemplate[] }>('/api/expense-templates');
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({ descricao:'', categoria:'OUTROS', tipo_despesa:'VARIAVEL' as TipoDespesa, recorrente:false, observacao:'' });
  async function onSubmit(e: React.FormEvent) { e.preventDefault(); setSuccess(null); await apiFetch('/api/expense-templates', { method:'POST', body:JSON.stringify(form) }); setSuccess('Modelo de despesa salvo com sucesso.'); setForm({ descricao:'', categoria:'OUTROS', tipo_despesa:'VARIAVEL', recorrente:false, observacao:'' }); await refresh(); }
  return <div className="grid two"><Card title="Novo modelo de despesa"><Feedback error={error} success={success} /><form className="form-grid" onSubmit={onSubmit}><div className="field"><label>Descrição</label><input value={form.descricao} onChange={(e)=>setForm({...form,descricao:e.target.value})} required /></div><div className="form-grid two"><div className="field"><label>Categoria</label><select value={form.categoria} onChange={(e)=>setForm({...form,categoria:e.target.value})}>{CATEGORIAS_DESPESA.map((item)=><option key={item}>{item}</option>)}</select></div><div className="field"><label>Tipo</label><select value={form.tipo_despesa} onChange={(e)=>setForm({...form,tipo_despesa:e.target.value as TipoDespesa})}><option value="FIXA">FIXA</option><option value="VARIAVEL">VARIAVEL</option></select></div></div><div className="field"><label><input type="checkbox" checked={form.recorrente} onChange={(e)=>setForm({...form,recorrente:e.target.checked})} /> Despesa recorrente</label></div><div className="field"><label>Observação</label><textarea value={form.observacao} onChange={(e)=>setForm({...form,observacao:e.target.value})} /></div><div className="actions"><button className="btn primary" type="submit">Salvar modelo</button></div></form></Card><Card title="Modelos cadastrados">{loading ? <p className="empty">Carregando...</p> : null}<div className="table-wrap"><table><thead><tr><th>Descrição</th><th>Categoria</th><th>Tipo</th><th>Recorrente</th></tr></thead><tbody>{data?.templates.map((item)=><tr key={item.id}><td>{item.descricao}</td><td>{item.categoria}</td><td><span className={`badge ${item.tipo_despesa === 'FIXA' ? 'dark' : 'success'}`}>{item.tipo_despesa}</span></td><td>{item.recorrente ? 'Sim' : 'Não'}</td></tr>)}</tbody></table></div>{!data?.templates.length ? <p className="empty">Nenhum modelo cadastrado.</p> : null}</Card></div>;
}
