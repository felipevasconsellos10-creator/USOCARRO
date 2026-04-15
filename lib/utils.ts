export function currencyBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}
export function numberBR(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(Number(value || 0));
}
export function toInputDate(date = new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
export function formatDateTimeBR(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString('pt-BR');
}
export function recurrenceLabel(value: string) {
  const map: Record<string, string> = {
    SEM_RECORRENCIA: 'Sem recorrência',
    SEMANAL: 'Semanal',
    QUINZENAL: 'Quinzenal',
    MENSAL: 'Mensal',
    ANUAL: 'Anual',
  };
  return map[value] || value;
}
export function paymentLabel(value: string) {
  const map: Record<string, string> = {
    A_VISTA: 'À vista',
    CARTAO: 'Cartão',
    BOLETO: 'Boleto',
    PIX: 'Pix',
    TRANSFERENCIA: 'Transferência',
  };
  return map[value] || value;
}
