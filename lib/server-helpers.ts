import { NextResponse } from 'next/server';
export function ok(data: unknown) { return NextResponse.json(data); }
export function fail(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : 'Erro inesperado';
  return NextResponse.json({ error: message }, { status });
}
export function requiredString(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Campo obrigatório: ${field}`);
  return value.trim();
}
export function requiredNumber(value: unknown, field: string) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) throw new Error(`Número inválido: ${field}`);
  return parsed;
}
