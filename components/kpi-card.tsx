export function KpiCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return <div className="card"><div className="small">{label}</div><div className="kpi-value">{value}</div>{helper ? <div className="kpi-helper">{helper}</div> : null}</div>;
}
