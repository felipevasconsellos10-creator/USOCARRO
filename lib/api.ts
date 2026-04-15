export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, cache: 'no-store' });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'Erro inesperado.');
  return payload as T;
}
