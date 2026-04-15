'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/card';
import { Feedback } from '@/components/feedback';
import { useApi } from '@/lib/hooks/use-api';
import { apiFetch } from '@/lib/api';
import { Settings, Vehicle } from '@/lib/types';
export function SettingsClient() {
  const { data, error, refresh } = useApi<{ settings: Settings | null }>('/api/settings');
  const { data: vehiclesData } = useApi<{ vehicles: Vehicle[] }>('/api/vehicles');
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({ nome_app:'Controle do carro', proprietario_nome:'Felipe', segundo_condutor_nome:'Everton', usuario_principal:'FELIPE', veiculo_padrao_id:'' });
  useEffect(() => { if (data?.settings) setForm({ nome_app:data.settings.nome_app, proprietario_nome:data.settings.proprietario_nome, segundo_condutor_nome:data.settings.segundo_condutor_nome, usuario_principal:data.settings.usuario_principal, veiculo_padrao_id:data.settings.veiculo_padrao_id || '' }); }, [data]);
  async function onSubmit(e: React.FormEvent) { e.preventDefault(); setSuccess(null); await apiFetch('/api/settings', { method:'POST', body:JSON.stringify(form) }); setSuccess('Configurações salvas com sucesso.'); await refresh(); }
  return <div className="grid two"><Card title="Configurações gerais"><Feedback error={error} success={success} /><form className="form-grid" onSubmit={onSubmit}><div className="field"><label>Nome do app</label><input value={form.nome_app} onChange={(e)=>setForm({...form,nome_app:e.target.value})} required /></div><div className="form-grid two"><div className="field"><label>Nome do proprietário</label><input value={form.proprietario_nome} onChange={(e)=>setForm({...form,proprietario_nome:e.target.value})} required /></div><div className="field"><label>Nome do segundo condutor</label><input value={form.segundo_condutor_nome} onChange={(e)=>setForm({...form,segundo_condutor_nome:e.target.value})} required /></div></div><div className="field"><label>Veículo padrão</label><select value={form.veiculo_padrao_id} onChange={(e)=>setForm({...form,veiculo_padrao_id:e.target.value})}><option value="">Selecione</option>{vehiclesData?.vehicles.map((item)=><option key={item.id} value={item.id}>{item.nome}</option>)}</select></div><div className="actions"><button className="btn primary" type="submit">Salvar configurações</button></div></form></Card><Card title="Como o cálculo funciona"><div className="grid"><div>1. <strong>Despesas fixas</strong> ficam 100% para Felipe.</div><div>2. <strong>Despesas variáveis</strong> são rateadas conforme o km rodado por cada usuário no período.</div><div>3. Quando você inicia um novo uso e o km inicial está acima do último km final seu, a diferença vira uso inferido do Everton.</div><div>4. O dashboard calcula custo por km, total por usuário e alerta de óleo.</div></div></Card></div>;
}
