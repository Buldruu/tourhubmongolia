import { useMemo, useState } from 'react';
import DestinationCard from '../components/DestinationCard';
import SearchFilter from '../components/SearchFilter';
import { Loading, Empty, ErrorState } from '../components/States';
import { getDestinations } from '../lib/api';
import { useQuery } from '../hooks/useQuery';
import { useLang } from '../lib/i18n';
import type { Destination } from '../types';

export default function Destinations() {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | 'domestic' | 'international'>('all');

  const { data, loading, error, refetch } = useQuery<Destination[]>(() => getDestinations(), []);

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (type !== 'all') list = list.filter((d) => d.type === type);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, type, search]);

  return (
    <div className="container-x py-12">
      <h1 className="section-title">{t('dest.title')}</h1>
      <p className="mt-2 text-navy-500">{t('dest.sub')}</p>

      <div className="mt-6">
        <SearchFilter search={search} onSearch={setSearch} type={type} onType={setType} placeholder={t('search.destinations')} />
      </div>

      <div className="mt-8">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState text={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <Empty text={t('dest.notFound')} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
