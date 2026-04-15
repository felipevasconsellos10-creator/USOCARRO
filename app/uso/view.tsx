'use client';
import { useMemo, useState } from 'react';
import { Card } from '@/components/card';
import { Feedback } from '@/components/feedback';
import { useApi } from '@/lib/hooks/use-api';
import { apiFetch } from '@/lib/api';
import { Usage, Vehicle } from '@/lib/types';
import { formatDateTimeBR, numberBR } from '@/lib/utils';

export function UsageClient() {
  const { data: vehiclesData } = useApi<{ vehicles: Vehicle[] }>('/api/vehicles');
  const { data, loading, error, refresh } = useApi<{ usages: Usage[]; openUsage: Usage | null }>('/api/usage/start');
  const [success, setSuccess] = useState<string | null>(null);
  const [startForm, setStartForm] = useState({ veiculo_id:'', km_inicial:0, observacao:'' });
  const [finishForm, setFinishForm] = useState({ km_final:0, observacao:'' });
  const defaultVehicleId = useMemo(() => vehiclesData?.vehicles?.[0]?.id || '', [vehiclesData]);

  async function startUsage(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    const result = await apiFetch<{ message: string; evertonKmInferido: number }>('/api/usage/start',{ method:'POST', body:JSON.stringify({ ...startForm, veiculo_id: startForm.veiculo_id || defaultVehicleId }) });
    setSuccess(result.evertonKmInferido > 0 ? `${result.message} Uso inferido do Everton: ${numberBR(result.evertonKmInferido,2)} km.` : `${result.message} Data e hora foram gravadas automaticamente.`);
    setStartForm({ veiculo_id:'', km_inicial:0, observacao:'' });
    await refresh();
  }

  async function finishUsage(e: React.FormEvent) {
    e.preventDefault();
    const open = data?.openUsage;
    if (!open) return;
    setSuccess(null);
    const result = await apiFetch<{ message: string; kmRodado: number }>('/api/usage/finish',{ method:'POST', body:JSON.stringify({ id: open.id, km_final: finishForm.km_final, observacao: finishForm.observacao }) });
    setSuccess(`${result.message} Total deste uso: ${numberBR(result.kmRodado,2)} km. Data e hora final registradas.`);
    setFinishForm({ km_final:0, observacao:'' });
    await refresh();
  }

  return <div className="grid two">
    <Card title="Iniciar uso do Felipe" subtitle="O sistema grava data e hora automaticamente. Ao iniciar um novo uso, a diferença para o último km final do Felipe entra como uso do Everton.">
      <Feedback error={error} success={success} />
      <form className="form-grid" onSubmit={startUsage}>
        <div className="field"><label>Veículo</label><select value={startForm.veiculo_id} onChange={(e)=>setStartForm({...startForm,veiculo_id:e.target.value})}><option value="">Selecione</option>{vehiclesData?.vehicles.map((v)=><option key={v.id} value={v.id}>{v.nome}</option>)}</select></div>
        <div className="field"><label>KM inicial</label><input type="number" step="0.01" value={startForm.km_inicial} onChange={(e)=>setStartForm({...startForm,km_inicial:Number(e.target.value)})} required /></div>
        <div className="field"><label>Observação</label><textarea value={startForm.observacao} onChange={(e)=>setStartForm({...startForm,observacao:e.target.value})} /></div>
        <div className="actions"><button className="btn primary" type="submit">Iniciar uso</button></div>
      </form>
    </Card>

    <Card title="Finalizar uso aberto">
      {data?.openUsage ? <form className="form-grid" onSubmit={finishUsage}>
        <div><span className="badge warn">Uso aberto em {numberBR(data.openUsage.km_inicial,2)} km</span></div>
        <div className="small">Iniciado em {formatDateTimeBR(data.openUsage.data_inicio)}</div>
        <div className="field"><label>KM final</label><input type="number" step="0.01" value={finishForm.km_final} onChange={(e)=>setFinishForm({...finishForm,km_final:Number(e.target.value)})} required /></div>
        <div className="field"><label>Observação final</label><textarea value={finishForm.observacao} onChange={(e)=>setFinishForm({...finishForm,observacao:e.target.value})} /></div>
        <div className="actions"><button className="btn primary" type="submit">Finalizar uso</button></div>
      </form> : <p className="empty">Não existe uso aberto para finalizar.</p>}
    </Card>

    <Card title="Histórico recente de usos">
      {loading ? <p className="empty">Carregando...</p> : null}
      <div className="table-wrap"><table><thead><tr><th>Usuário</th><th>KM inicial</th><th>KM final</th><th>Rodado</th><th>Início</th><th>Fim</th><th>Status</th></tr></thead><tbody>{data?.usages.map((item)=><tr key={item.id}><td>{item.usuario_uso} {item.inferido ? <span className="small">(inferido)</span> : ''}</td><td>{numberBR(item.km_inicial,2)}</td><td>{item.km_final ? numberBR(item.km_final,2) : '-'}</td><td>{item.km_rodado ? numberBR(item.km_rodado,2) : '-'}</td><td>{formatDateTimeBR(item.data_inicio)}</td><td>{formatDateTimeBR(item.data_fim)}</td><td><span className={`badge ${item.status === 'ABERTO' ? 'warn' : 'success'}`}>{item.status}</span></td></tr>)}</tbody></table></div>
    </Card>
  </div>;
}
