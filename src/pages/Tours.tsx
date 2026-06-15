import { useMemo, useState } from 'react';
import TourCard from '../components/TourCard';
import SearchFilter from '../components/SearchFilter';
import { Loading, Empty, ErrorState } from '../components/States';
import { getTours } from '../lib/api';
import { useQuery } from '../hooks/useQuery';
import { useLang } from '../lib/i18n';
import type { Tour } from '../types';

interface Props {
  fixedType?: 'domestic' | 'international';
}

export default function Tours({ fixedType }: Props) {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | 'domestic' | 'international'>(fixedType ?? 'all');

  const { data, loading, error, refetch } = useQuery<Tour[]>(() => getTours(), []);

  const activeType = fixedType ?? type;

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (activeType !== 'all') list = list.filter((x) => x.type === activeType);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (x) =>
          x.title.toLowerCase().includes(q) ||
          (x.destinations?.name ?? '').toLowerCase().includes(q) ||
          (x.destinations?.country ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, activeType, search]);

  const title =
    fixedType === 'domestic'
      ? t('tours.title.domestic')
      : fixedType === 'international'
        ? t('tours.title.international')
        : t('tours.title.all');

  return (
    <div className="container-x py-12">
      <h1 className="section-title">{title}</h1>
      <p className="mt-2 text-navy-500">{t('tours.sub')}</p>

      <div className="mt-6">
        <SearchFilter
          search={search}
          onSearch={setSearch}
          type={fixedType ? undefined : type}
          onType={fixedType ? undefined : setType}
          placeholder={t('search.tours')}
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState text={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <Empty text={t('tours.notFound')} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((x) => (
              <TourCard key={x.id} tour={x} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
