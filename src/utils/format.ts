import type { BookingStatus, TripType } from '../types';

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('mn-MN').format(value) + '₮';
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('mn-MN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('mn-MN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const STATUS_LABELS: Record<BookingStatus, string> = {
  new: 'Шинэ',
  contacted: 'Холбогдсон',
  confirmed: 'Баталгаажсан',
  cancelled: 'Цуцлагдсан'
};

export const STATUS_COLORS: Record<BookingStatus, string> = {
  new: 'bg-sky-100 text-sky-700 border-sky-200',
  contacted: 'bg-gold-300/30 text-gold-600 border-gold-400/40',
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200'
};

export const TRIP_TYPE_LABELS: Record<TripType, string> = {
  one_way: 'Нэг талын',
  round_trip: 'Хоёр талын'
};

export const TYPE_LABELS: Record<'domestic' | 'international', string> = {
  domestic: 'Дотоод',
  international: 'Гадаад'
};
