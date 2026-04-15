'use client';
import { useMemo, useState } from 'react';
import { Card } from '@/components/card';
import { KpiCard } from '@/components/kpi-card';
import { Feedback } from '@/components/feedback';
import { useApi } from '@/lib/hooks/use-api';
import { DashboardData } from '@/lib/types';
import { currencyBRL, numberBR, toInputDate } from '@/lib/utils';
export function DashboardClient() {
  const [inicio, setInicio] = useState(toInputDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const [fim, setFim] = useState(toInputDate());
  const { data, error, loading, refresh } = useApi<DashboardData>(`/api/dashboard?start=${inicio}&end=${fim}`);
  const oilLabel = useMemo(() => {
    if (!data) return '-';
    if (data.km_restante_para_oleo === null) return 'Sem veículo cadastrado';
    return `${numberBR(data.km_restante_para_oleo)} km restantes`;
  }, [data]);
  return <div className="grid">
    <Card title="Filtro do período"><div className="form-grid two"><div className="field"><label>Início</label><input type="date" value={inicio} onChange={(e)=>setInicio(e.target.value)} /></div><div className="field"><label>Fim</label><input type="date" value={fim} onChange={(e)=>setFim(e.target.value)} /></div></div><div className="actions" style={{marginTop:12}}><button className="btn primary" onClick={()=>refresh()}>Atualizar</button></div></Card>
    <Feedback error={error} />
    {loading ? <div className="card">Carregando dashboard...</div> : null}
    {data ? <><div className="grid kpi">
      <KpiCard label="Total de despesas" value={currencyBRL(data.total_despesas)} helper="No período filtrado" />
      <KpiCard label="Despesas fixas" value={currencyBRL(data.total_fixas)} helper="Responsabilidade do Felipe" />
      <KpiCard label="Despesas variáveis" value={currencyBRL(data.total_variaveis)} helper="Rateadas por km" />
      <KpiCard label="Total de km" value={`${numberBR(data.total_km_periodo,2)} km`} helper="Usos finalizados" />
      <KpiCard label="Custo por km" value={currencyBRL(data.custo_por_km)} helper="Variáveis ÷ km do período" />
      <KpiCard label="Próxima troca de óleo" value={oilLabel} helper={data.proxima_troca_oleo_em_km ? `Prevista em ${numberBR(data.proxima_troca_oleo_em_km)} km` : 'Cadastre o veículo'} />
    </div><div className="grid two"><Card title="Rateio por usuário"><div className="table-wrap"><table><thead><tr><th>Usuário</th><th>KM</th><th>Total responsável</th></tr></thead><tbody><tr><td>Felipe</td><td>{numberBR(data.felipe_km,2)}</td><td>{currencyBRL(data.felipe_total_responsavel)}</td></tr><tr><td>Everton</td><td>{numberBR(data.everton_km,2)}</td><td>{currencyBRL(data.everton_total_responsavel)}</td></tr></tbody></table></div></Card><Card title="Uso em aberto">{data.uso_aberto ? <div className="grid"><div><span className="badge warn">Uso aberto</span></div><div><strong>KM inicial:</strong> {numberBR(data.uso_aberto.km_inicial,2)}</div><div><strong>Iniciado em:</strong> {new Date(data.uso_aberto.data_inicio).toLocaleString('pt-BR')}</div><div><strong>Observação:</strong> {data.uso_aberto.observacao || 'Sem observação'}</div></div> : <p className="empty">Não há uso aberto no momento.</p>}</Card></div></> : null}
  </div>;
}
