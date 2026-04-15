export function currencyBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}
export function numberBR(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(Number(value || 0));
}
export function toInputDate(date = new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
