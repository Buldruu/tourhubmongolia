import { useState } from 'react';
import { Eye, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import StatusBadge from '../components/StatusBadge';
import { updateBookingStatus } from '../lib/api';
import { formatDate, formatDateTime, STATUS_LABELS } from '../utils/format';
import type { Booking, BookingStatus } from '../types';

interface Props {
  bookings: Booking[];
  onChanged: () => void;
}

const STATUSES: BookingStatus[] = ['new', 'contacted', 'confirmed', 'cancelled'];

export default function BookingTable({ bookings, onChanged }: Props) {
  const [selected, setSelected] = useState<Booking | null>(null);
  const [saving, setSaving] = useState(false);

  async function updateStatus(id: string, status: BookingStatus) {
    setSaving(true);
    await updateBookingStatus(id, status);
    setSaving(false);
    setSelected(null);
    onChanged();
  }

  return (
    <>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-50/60 text-xs uppercase tracking-wide text-navy-500">
              <th className="px-4 py-3 font-semibold">Захиалагч</th>
              <th className="px-4 py-3 font-semibold">Утас</th>
              <th className="px-4 py-3 font-semibold">Чиглэл</th>
              <th className="px-4 py-3 font-semibold">Аялах огноо</th>
              <th className="px-4 py-3 font-semibold">Хүн</th>
              <th className="px-4 py-3 font-semibold">Төлөв</th>
              <th className="px-4 py-3 font-semibold">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-navy-50 transition hover:bg-navy-50/40">
                <td className="px-4 py-3 font-semibold text-navy-900">{b.customer_name}</td>
                <td className="px-4 py-3 text-navy-600">{b.phone}</td>
                <td className="px-4 py-3 text-navy-600">{b.destinations?.name ?? '—'}</td>
                <td className="px-4 py-3 text-navy-600">{formatDate(b.travel_date)}</td>
                <td className="px-4 py-3 text-navy-600">{b.travelers_count}</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelected(b)}
                    className="flex items-center gap-1.5 rounded-lg bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-700 transition hover:bg-navy-100"
                  >
                    <Eye size={13} /> Харах
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* detail modal */}
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
                <h3 className="font-display text-lg font-bold text-navy-900">Захиалгын дэлгэрэнгүй</h3>
                <button onClick={() => setSelected(null)} className="text-navy-400 hover:text-navy-700" aria-label="Хаах">
                  <X size={20} />
                </button>
              </div>

              <dl className="mt-4 space-y-2.5 text-sm">
                {[
                  ['Захиалагч', selected.customer_name],
                  ['Утас', selected.phone],
                  ['И-мэйл', selected.email ?? '—'],
                  ['Чиглэл', selected.destinations?.name ?? '—'],
                  ['Зочид буудал', selected.hotels?.name ?? '—'],
                  ['Аялал', selected.tours?.title ?? '—'],
                  ['Аялах огноо', formatDate(selected.travel_date)],
                  ['Зорчигчид', String(selected.travelers_count)],
                  ['Тусгай хүсэлт', selected.special_request ?? '—'],
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
    </>
  );
}
