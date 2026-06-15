import { useMemo, useState } from 'react';
import HotelCard from '../components/HotelCard';
import SearchFilter from '../components/SearchFilter';
import { Loading, Empty, ErrorState } from '../components/States';
import { getHotels } from '../lib/api';
import { useQuery } from '../hooks/useQuery';
import { useLang } from '../lib/i18n';
import type { Hotel } from '../types';

export default function Hotels() {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | 'domestic' | 'international'>('all');

  const { data, loading, error, refetch } = useQuery<Hotel[]>(() => getHotels(), []);

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (type !== 'all') list = list.filter((h) => h.destinations?.type === type);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          (h.city ?? '').toLowerCase().includes(q) ||
          (h.country ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, type, search]);

  return (
    <div className="container-x py-12">
      <h1 className="section-title">{t('hotels.title')}</h1>
      <p className="mt-2 text-navy-500">{t('hotels.sub')}</p>

      <div className="mt-6">
        <SearchFilter search={search} onSearch={setSearch} type={type} onType={setType} placeholder={t('search.hotels')} />
      </div>

      <div className="mt-8">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState text={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <Empty text={t('hotels.notFound')} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
