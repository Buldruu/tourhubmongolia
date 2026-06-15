import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Plane, ArrowRightLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { createFlightRequest } from '../lib/api';
import { useLang } from '../lib/i18n';
import type { FlightRequestInsert, TripType } from '../types';

const initial: FlightRequestInsert = {
  departure_city: 'Улаанбаатар',
  arrival_city: '',
  departure_date: '',
  return_date: '',
  trip_type: 'round_trip',
  passengers_count: 1,
  customer_name: '',
  phone: '',
  email: '',
  note: ''
};

export default function FlightRequestForm() {
  const { t } = useLang();
  const [form, setForm] = useState<FlightRequestInsert>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FlightRequestInsert>(key: K, value: FlightRequestInsert[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.departure_city || !form.arrival_city || !form.customer_name || !form.phone || !form.departure_date) {
      setError(t('common.requiredFields'));
      return;
    }
    if (form.trip_type === 'round_trip' && !form.return_date) {
      setError(t('flights.errReturn'));
      return;
    }

    setSubmitting(true);
    const payload: FlightRequestInsert = {
      ...form,
      return_date: form.trip_type === 'one_way' ? null : form.return_date,
      email: form.email || null,
      note: form.note || null
    };
    const { error: e2 } = await createFlightRequest(payload);
    setSubmitting(false);

    if (e2) {
      setError(t('flights.errSubmit') + e2.message);
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card flex flex-col items-center gap-4 p-10 text-center"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 size={32} />
        </span>
        <h3 className="font-display text-xl font-bold text-navy-900">{t('flights.successTitle')}</h3>
        <p className="max-w-md text-navy-500">{t('flights.successMsg')}</p>
        <button
          className="btn-outline"
          onClick={() => {
            setForm(initial);
            setSuccess(false);
          }}
        >
          {t('flights.newRequest')}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8">
      {/* trip type */}
      <div className="flex rounded-xl border border-navy-200 bg-navy-50/50 p-1">
        {([
          ['round_trip', t('flights.roundTrip'), ArrowRightLeft],
          ['one_way', t('flights.oneWay'), ArrowRight]
        ] as [TripType, string, typeof ArrowRight][]).map(([value, label, Icon]) => (
          <button
            type="button"
            key={value}
            onClick={() => set('trip_type', value)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              form.trip_type === value ? 'bg-navy-700 text-white shadow' : 'text-navy-600'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">{t('flights.from')} *</label>
          <input
            className="input"
            value={form.departure_city}
            onChange={(e) => set('departure_city', e.target.value)}
            placeholder="Улаанбаатар / Ulaanbaatar"
            required
          />
        </div>
        <div>
          <label className="label">{t('flights.to')} *</label>
          <input
            className="input"
            value={form.arrival_city}
            onChange={(e) => set('arrival_city', e.target.value)}
            placeholder={t('flights.toPlaceholder')}
            required
          />
        </div>
        <div>
          <label className="label">{t('flights.departDate')} *</label>
          <input
            type="date"
            className="input"
            value={form.departure_date ?? ''}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => set('departure_date', e.target.value)}
            required
          />
        </div>
        {form.trip_type === 'round_trip' && (
          <div>
            <label className="label">{t('flights.returnDate')} *</label>
            <input
              type="date"
              className="input"
              value={form.return_date ?? ''}
              min={form.departure_date || new Date().toISOString().split('T')[0]}
              onChange={(e) => set('return_date', e.target.value)}
            />
          </div>
        )}
        <div>
          <label className="label">{t('flights.passengers')} *</label>
          <input
            type="number"
            min={1}
            max={50}
            className="input"
            value={form.passengers_count}
            onChange={(e) => set('passengers_count', Number(e.target.value))}
            required
          />
        </div>
      </div>

      <hr className="border-navy-100" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">{t('common.name')} *</label>
          <input
            className="input"
            value={form.customer_name}
            onChange={(e) => set('customer_name', e.target.value)}
            placeholder={t('common.namePlaceholder')}
            required
          />
        </div>
        <div>
          <label className="label">{t('common.phone')} *</label>
          <input
            type="tel"
            className="input"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="9911-0000"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">{t('common.email')}</label>
          <input
            type="email"
            className="input"
            value={form.email ?? ''}
            onChange={(e) => set('email', e.target.value)}
            placeholder="name@example.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">{t('flights.note')}</label>
          <textarea
            className="input min-h-[90px]"
            value={form.note ?? ''}
            onChange={(e) => set('note', e.target.value)}
            placeholder={t('flights.notePlaceholder')}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-gold w-full">
        {submitting ? <Loader2 className="animate-spin" size={18} /> : <Plane size={18} />}
        {submitting ? t('common.sending') : t('flights.submit')}
      </button>
      <p className="text-center text-xs text-navy-400">{t('flights.mvpNote')}</p>
    </form>
  );
}
