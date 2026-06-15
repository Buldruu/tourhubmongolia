import { useMemo, useState } from 'react';
import { RefreshCw, Eye, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import StatusBadge from '../../components/StatusBadge';
import { Loading, Empty, ErrorState } from '../../components/States';
import { getFlightRequests, updateFlightRequestStatus } from '../../lib/api';
import { useQuery } from '../../hooks/useQuery';
import { formatDate, formatDateTime, STATUS_LABELS, TRIP_TYPE_LABELS } from '../../utils/format';
import type { BookingStatus, FlightRequest } from '../../types';

const STATUSES: BookingStatus[] = ['new', 'contacted', 'confirmed', 'cancelled'];

export default function AdminFlights() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [selected, setSelected] = useState<FlightRequest | null>(null);
  const [saving, setSaving] = useState(false);

  const { data, loading, error, refetch } = useQuery<FlightRequest[]>(() => getFlightRequests(), []);

  const filtered = useMemo(() => {
    const list = data ?? [];
    return statusFilter === 'all' ? list : list.filter((f) => f.status === statusFilter);
  }, [data, statusFilter]);

  async function updateStatus(id: string, status: BookingStatus) {
    setSaving(true);
    await updateFlightRequestStatus(id, status);
    setSaving(false);
    setSelected(null);
    refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Нислэгийн хүсэлтүүд</h1>
          <p className="mt-1 text-navy-500">Тийзний хүсэлтийг хянах, төлөв удирдах</p>
        </div>
        <button onClick={refetch} className="btn-outline !px-4 !py-2 text-sm">
          <RefreshCw size={15} /> Шинэчлэх
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', ...STATUSES] as const).map((s) => (
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
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState text={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <Empty text="Нислэгийн хүсэлт одоогоор алга." />
      ) : (
        <div className="space-y-3">
          {filtered.map((f) => (
            <div
              key={f.id}
              className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-base font-bold text-navy-900">
                    {f.departure_city} → {f.arrival_city}
                  </p>
                  <StatusBadge status={f.status} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-500">
                  <span>{formatDate(f.departure_date)}</span>
                  <span>{TRIP_TYPE_LABELS[f.trip_type]}</span>
                  <span>{f.passengers_count} зорчигч</span>
                </div>
                <p className="mt-1 text-sm text-navy-600">
                  {f.customer_name} <span className="text-navy-400">· {f.phone}</span>
                </p>
              </div>
              <button
                onClick={() => setSelected(f)}
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-navy-50 px-3.5 py-2 text-xs font-semibold text-navy-700 hover:bg-navy-100"
              >
                <Eye size={13} /> Харах
              </button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-navy-950/50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-display text-lg font-bold text-navy-900">Нислэгийн хүсэлт</h3>
                <button onClick={() => setSelected(null)} className="text-navy-400 hover:text-navy-700" aria-label="Хаах">
                  <X size={20} />
                </button>
              </div>
              <dl className="mt-4 space-y-2.5 text-sm">
                {[
                  ['Чиглэл', `${selected.departure_city} → ${selected.arrival_city}`],
                  ['Нисэх огноо', formatDate(selected.departure_date)],
                  ['Буцах огноо', formatDate(selected.return_date)],
                  ['Төрөл', TRIP_TYPE_LABELS[selected.trip_type]],
                  ['Зорчигчид', String(selected.passengers_count)],
                  ['Захиалагч', selected.customer_name],
                  ['Утас', selected.phone],
                  ['И-мэйл', selected.email ?? '—'],
                  ['Тэмдэглэл', selected.note ?? '—'],
                  ['Бүртгэгдсэн', formatDateTime(selected.created_at)]
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-navy-50 pb-2">
                    <dt className="font-semibold text-navy-500">{k}</dt>
                    <dd className="text-right text-navy-900">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-navy-400">Төлөв өөрчлөх</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={saving || selected.status === s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                      selected.status === s
                        ? 'border-navy-700 bg-navy-700 text-white'
                        : 'border-navy-200 text-navy-600 hover:bg-navy-50'
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
