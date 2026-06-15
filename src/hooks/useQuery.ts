import { useCallback, useEffect, useState } from 'react';
import type { Result } from '../lib/api';

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic data-fetching hook around any async function returning Result<T>.
 * Re-runs whenever `deps` change. Exposes refetch() for manual reload.
 */
export function useQuery<T>(queryFn: () => Promise<Result<T>>, deps: unknown[] = []): QueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    queryFn()
      .then(({ data: d, error: e }) => {
        if (cancelled) return;
        if (e) setError(e.message);
        else setData(d);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Алдаа гарлаа');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data, loading, error, refetch };
}
