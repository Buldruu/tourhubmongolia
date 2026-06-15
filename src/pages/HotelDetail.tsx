import { Link, useParams } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { Loading, ErrorState } from '../components/States';
import { getHotel } from '../lib/api';
import { useQuery } from '../hooks/useQuery';
import { useLang } from '../lib/i18n';
import { formatPrice } from '../utils/format';
import type { Hotel } from '../types';

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();

  const { data: hotel, loading, error, refetch } = useQuery<Hotel>(() => getHotel(id ?? ''), [id]);

  if (loading) return <Loading />;
  if (error || !hotel)
    return (
      <div className="container-x py-12">
        <ErrorState text={t('hotel.notFoundDetail')} onRetry={refetch} />
      </div>
    );

  return (
    <>
      <section className="relative h-[320px] sm:h-[420px]">
        <img src={hotel.image_url ?? ''} alt={hotel.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-8">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-navy-800">
            <Star size={12} className="fill-gold-400 text-gold-400" /> {hotel.rating} {t('hotel.stars')}
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">{hotel.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-white/85">
            <MapPin size={16} /> {[hotel.city, hotel.country].filter(Boolean).join(', ')}
          </p>
        </div>
      </section>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="section-title !text-xl">{t('hotel.intro')}</h2>
          <p className="mt-4 leading-relaxed text-navy-600">{hotel.description}</p>

          {hotel.destinations && (
            <div className="mt-8 rounded-2xl bg-navy-50 p-6">
              <p className="text-sm font-semibold text-navy-500">{t('hotel.relatedDest')}</p>
              <Link
                to={`/destination/${hotel.destinations.id}`}
                className="mt-1 flex items-center gap-1 font-display text-lg font-bold text-navy-800 hover:text-sky-500"
              >
                {hotel.destinations.name}, {hotel.destinations.country} <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>

        <aside className="card h-fit p-6">
          <p className="text-sm text-navy-400">{t('common.perNight')}</p>
          <p className="font-display text-3xl font-extrabold text-navy-900">{formatPrice(hotel.price_from)}</p>
          <div className="mt-3 flex items-center gap-1 text-gold-400">
            {[...Array(Math.round(hotel.rating))].map((_, i) => (
              <Star key={i} size={16} className="fill-gold-400" />
            ))}
            <span className="ml-1 text-sm font-semibold text-navy-600">{hotel.rating}</span>
          </div>
          <Link
            to={`/booking?hotel=${hotel.id}${hotel.destination_id ? `&destination=${hotel.destination_id}` : ''}`}
            className="btn-gold mt-6 w-full"
          >
            {t('hotel.bookThis')}
          </Link>
          <p className="mt-3 text-center text-xs text-navy-400">{t('hotel.noCharge')}</p>
        </aside>
      </div>
    </>
  );
}
