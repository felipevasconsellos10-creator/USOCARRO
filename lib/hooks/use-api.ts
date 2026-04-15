'use client';
import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const payload = await apiFetch<T>(url);
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados.');
    } finally { setLoading(false); }
  }, [url]);
  useEffect(() => { void refresh(); }, [refresh]);
  return { data, loading, error, refresh, setData };
}
