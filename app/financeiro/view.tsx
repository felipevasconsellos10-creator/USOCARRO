'use client';
import { useMemo, useState } from 'react';
import { Card } from '@/components/card';
import { Feedback } from '@/components/feedback';
import { useApi } from '@/lib/hooks/use-api';
import { apiFetch } from '@/lib/api';
import { Expense, ExpenseCategory, ExpenseTemplate, FormaPagamento, TipoDespesa, TipoRecorrencia, Vehicle } from '@/lib/types';
import { FORMAS_PAGAMENTO, TIPOS_RECORRENCIA, CATEGORIAS_PADRAO } from '@/lib/constants';
import { currencyBRL, paymentLabel, recurrenceLabel, toInputDate } from '@/lib/utils';

export function FinanceClient() {
  const { data: templatesData } = useApi<{ templates: ExpenseTemplate[] }>('/api/expense-templates');
  const { data: categoriesData } = useApi<{ categories: ExpenseCategory[] }>('/api/expense-categories');
  const { data: vehiclesData } = useApi<{ vehicles: Vehicle[] }>('/api/vehicles');
  const { data, loading, error, refresh } = useApi<{ expenses: Expense[] }>('/api/expenses');
  const [success, setSuccess] = useState<string | null>(null);
  const defaultVehicleId = vehiclesData?.vehicles?.[0]?.id || '';
  const templateMap = useMemo(() => new Map((templatesData?.templates || []).map((item) => [item.id, item])), [templatesData]);
  const categories = useMemo(() => [...new Set([...(categoriesData?.categories || []).map((item)=>item.nome), ...CATEGORIAS_PADRAO])], [categoriesData]);
  const [form, setForm] = useState({
    veiculo_id:'', modelo_despesa_id:'', descricao:'', categoria:'OUTROS', categoria_id:'', tipo_despesa:'VARIAVEL' as TipoDespesa, valor:0,
    data_despesa:toInputDate(), vencimento:toInputDate(), pago:false, forma_pagamento:'A_VISTA' as FormaPagamento, cartao_titular:'',
    recorrente:false, tipo_recorrencia:'MENSAL' as TipoRecorrencia, dia_recorrencia:5, quantidade_parcelas:1, observacao:''
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    const result = await apiFetch<{ createdCount: number }>('/api/expenses',{
      method:'POST',
      body:JSON.stringify({
        ...form,
        veiculo_id: form.veiculo_id || defaultVehicleId,
        vencimento: form.vencimento || null,
        cartao_titular: form.forma_pagamento === 'CARTAO' ? form.cartao_titular : null,
        tipo_recorrencia: form.recorrente ? form.tipo_recorrencia : 'SEM_RECORRENCIA',
        dia_recorrencia: form.recorrente ? form.dia_recorrencia : null,
        quantidade_parcelas: form.recorrente ? form.quantidade_parcelas : 1,
      })
    });
    setSuccess(result.createdCount > 1 ? `${result.createdCount} despesas recorrentes foram criadas.` : 'Despesa lançada com sucesso.');
    setForm({...form, descricao:'', valor:0, observacao:'', modelo_despesa_id:'', vencimento:toInputDate(), pago:false, cartao_titular:'', recorrente:false, quantidade_parcelas:1});
    await refresh();
  }

  function applyTemplate(id: string) {
    const tpl = templateMap.get(id);
    if (!tpl) return;
    setForm((prev)=>({
      ...prev,
      modelo_despesa_id:id,
      descricao:tpl.descricao,
      categoria:tpl.categoria,
      categoria_id:tpl.categoria_id || '',
      tipo_despesa:tpl.tipo_despesa,
      recorrente:tpl.recorrente,
      tipo_recorrencia:tpl.tipo_recorrencia,
      dia_recorrencia:tpl.dia_recorrencia || prev.dia_recorrencia,
      quantidade_parcelas:tpl.quantidade_parcelas || prev.quantidade_parcelas,
      observacao:tpl.observacao || ''
    }));
  }

  async function togglePaid(id: string, current: boolean) {
    await apiFetch('/api/expenses', { method:'PATCH', body:JSON.stringify({ id, pago:!current }) });
    await refresh();
  }

  return <div className="grid two">
    <Card title="Lançar despesa / conta a pagar">
      <Feedback error={error} success={success} />
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="form-grid two">
          <div className="field"><label>Veículo</label><select value={form.veiculo_id} onChange={(e)=>setForm({...form,veiculo_id:e.target.value})}><option value="">Selecione</option>{vehiclesData?.vehicles.map((v)=><option key={v.id} value={v.id}>{v.nome}</option>)}</select></div>
          <div className="field"><label>Modelo de despesa</label><select value={form.modelo_despesa_id} onChange={(e)=>applyTemplate(e.target.value)}><option value="">Manual</option>{templatesData?.templates.map((t)=><option key={t.id} value={t.id}>{t.descricao}</option>)}</select></div>
        </div>
        <div className="field"><label>Descrição</label><input value={form.descricao} onChange={(e)=>setForm({...form,descricao:e.target.value})} required /></div>
        <div className="form-grid three">
          <div className="field"><label>Categoria</label><select value={form.categoria} onChange={(e)=>setForm({...form,categoria:e.target.value, categoria_id: categoriesData?.categories.find((item)=>item.nome===e.target.value)?.id || ''})}>{categories.map((item)=><option key={item}>{item}</option>)}</select></div>
          <div className="field"><label>Tipo</label><select value={form.tipo_despesa} onChange={(e)=>setForm({...form,tipo_despesa:e.target.value as TipoDespesa})}><option value="FIXA">FIXA</option><option value="VARIAVEL">VARIAVEL</option></select></div>
          <div className="field"><label>Valor</label><input type="number" step="0.01" value={form.valor} onChange={(e)=>setForm({...form,valor:Number(e.target.value)})} required /></div>
        </div>
        <div className="form-grid two">
          <div className="field"><label>Data da despesa</label><input type="date" value={form.data_despesa} onChange={(e)=>setForm({...form,data_despesa:e.target.value})} required /></div>
          <div className="field"><label>Vencimento</label><input type="date" value={form.vencimento} onChange={(e)=>setForm({...form,vencimento:e.target.value})} /></div>
        </div>
        <div className="form-grid two">
          <div className="field"><label>Forma de pagamento</label><select value={form.forma_pagamento} onChange={(e)=>setForm({...form,forma_pagamento:e.target.value as FormaPagamento})}>{FORMAS_PAGAMENTO.map((item)=><option key={item} value={item}>{paymentLabel(item)}</option>)}</select></div>
          <div className="field"><label>{form.forma_pagamento === 'CARTAO' ? 'Cartão de quem?' : 'Complemento do pagamento'}</label><input value={form.cartao_titular} onChange={(e)=>setForm({...form,cartao_titular:e.target.value})} placeholder={form.forma_pagamento === 'CARTAO' ? 'Ex.: Cartão do Felipe' : 'Opcional'} /></div>
        </div>
        <div className="field"><label><input type="checkbox" checked={form.recorrente} onChange={(e)=>setForm({...form,recorrente:e.target.checked})} /> Despesa recorrente</label></div>
        {form.recorrente ? <div className="form-grid three">
          <div className="field"><label>Como vai repetir</label><select value={form.tipo_recorrencia} onChange={(e)=>setForm({...form,tipo_recorrencia:e.target.value as TipoRecorrencia})}>{TIPOS_RECORRENCIA.filter((item)=>item !== 'SEM_RECORRENCIA').map((item)=><option key={item} value={item}>{recurrenceLabel(item)}</option>)}</select></div>
          <div className="field"><label>{form.tipo_recorrencia === 'MENSAL' ? 'Dia do mês' : 'Dia base'}</label><input type="number" min="1" max="31" value={form.dia_recorrencia} onChange={(e)=>setForm({...form,dia_recorrencia:Number(e.target.value)})} /></div>
          <div className="field"><label>Quantas parcelas criar</label><input type="number" min="1" value={form.quantidade_parcelas} onChange={(e)=>setForm({...form,quantidade_parcelas:Number(e.target.value)})} /></div>
        </div> : null}
        <div className="field"><label><input type="checkbox" checked={form.pago} onChange={(e)=>setForm({...form,pago:e.target.checked})} /> Já está pago</label></div>
        <div className="field"><label>Observação</label><textarea value={form.observacao} onChange={(e)=>setForm({...form,observacao:e.target.value})} /></div>
        <div className="actions"><button className="btn primary" type="submit">Salvar despesa</button></div>
      </form>
    </Card>

    <Card title="Despesas lançadas">
      {loading ? <p className="empty">Carregando...</p> : null}
      <div className="table-wrap"><table><thead><tr><th>Descrição</th><th>Pagamento</th><th>Valor</th><th>Data</th><th>Status</th></tr></thead><tbody>{data?.expenses.map((item)=><tr key={item.id}><td>{item.descricao}{item.parcela_atual && item.quantidade_parcelas ? <div className="small">Parcela {item.parcela_atual}/{item.quantidade_parcelas}</div> : null}</td><td>{paymentLabel(item.forma_pagamento)}{item.cartao_titular ? <div className="small">{item.cartao_titular}</div> : null}</td><td>{currencyBRL(item.valor)}</td><td>{new Date(item.data_despesa).toLocaleDateString('pt-BR')}</td><td><button className={`btn ${item.pago ? 'secondary' : 'primary'}`} onClick={()=>togglePaid(item.id,item.pago)}>{item.pago ? 'Pago' : 'Marcar pago'}</button></td></tr>)}</tbody></table></div>
      {!data?.expenses.length ? <p className="empty">Nenhuma despesa lançada.</p> : null}
    </Card>
  </div>;
}
