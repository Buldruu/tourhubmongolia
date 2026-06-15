import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import BookingTable from '../BookingTable';
import { Loading, Empty, ErrorState } from '../../components/States';
import { getBookings } from '../../lib/api';
import { useQuery } from '../../hooks/useQuery';
import { STATUS_LABELS } from '../../utils/format';
import type { Booking, BookingStatus } from '../../types';

export default function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

  const { data, loading, error, refetch } = useQuery<Booking[]>(() => getBookings(), []);

  const filtered = useMemo(() => {
    const list = data ?? [];
    return statusFilter === 'all' ? list : list.filter((b) => b.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Захиалгууд</h1>
          <p className="mt-1 text-navy-500">Аялал, буудлын захиалгын хүсэлтүүд</p>
        </div>
        <button onClick={refetch} className="btn-outline !px-4 !py-2 text-sm">
          <RefreshCw size={15} /> Шинэчлэх
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'new', 'contacted', 'confirmed', 'cancelled'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              statusFilter === s
                ? 'border-navy-700 bg-navy-700 text-white'
                : 'border-navy-200 bg-white text-navy-600 hover:bg-navy-50'
            }`}
          >
            {s === 'all' ? 'Бүгд' : STATUS_LABELS[s]}
            {s !== 'all' && data && (
              <span className="ml-1.5 text-xs opacity-70">
                {(data ?? []).filter((b) => b.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState text={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <Empty text="Захиалга олдсонгүй." />
      ) : (
        <BookingTable bookings={filtered} onChanged={refetch} />
      )}
    </div>
  );
}
