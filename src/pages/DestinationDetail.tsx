import { Link, useParams } from 'react-router-dom';
import { MapPin, ArrowRight, Hotel as HotelIcon, Map } from 'lucide-react';
import HotelCard from '../components/HotelCard';
import TourCard from '../components/TourCard';
import { Loading, Empty, ErrorState } from '../components/States';
import { getDestination, getHotelsByDestination, getToursByDestination } from '../lib/api';
import { useQuery } from '../hooks/useQuery';
import { useLang } from '../lib/i18n';
import type { Destination, Hotel, Tour } from '../types';

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();

  const destination = useQuery<Destination>(() => getDestination(id ?? ''), [id]);
  const hotels = useQuery<Hotel[]>(() => getHotelsByDestination(id ?? ''), [id]);
  const tours = useQuery<Tour[]>(() => getToursByDestination(id ?? ''), [id]);

  if (destination.loading) return <Loading />;
  if (destination.error || !destination.data)
    return (
      <div className="container-x py-12">
        <ErrorState text={t('dest.notFoundDetail')} onRetry={destination.refetch} />
      </div>
    );

  const d = destination.data;

  return (
    <>
      {/* hero */}
      <section className="relative h-[340px] sm:h-[420px]">
        <img src={d.image_url ?? ''} alt={d.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-8">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy-800">
            {t(`common.${d.type}`)}
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">{d.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-white/85">
            <MapPin size={16} /> {d.country}
          </p>
        </div>
      </section>

      <div className="container-x py-12">
        <p className="max-w-3xl text-lg leading-relaxed text-navy-600">{d.description}</p>

        {/* hotels */}
        <div className="mt-12">
          <div className="flex items-center gap-2">
            <HotelIcon size={20} className="text-sky-500" />
            <h2 className="section-title !text-xl sm:!text-2xl">{t('dest.relatedHotels')}</h2>
          </div>
          {hotels.loading ? (
            <Loading />
          ) : (hotels.data ?? []).length === 0 ? (
            <div className="mt-4"><Empty text={t('dest.noHotels')} /></div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(hotels.data ?? []).map((h) => (
                <HotelCard key={h.id} hotel={h} />
              ))}
            </div>
          )}
        </div>

        {/* tours */}
        <div className="mt-12">
          <div className="flex items-center gap-2">
            <Map size={20} className="text-sky-500" />
            <h2 className="section-title !text-xl sm:!text-2xl">{t('dest.relatedTours')}</h2>
          </div>
          {tours.loading ? (
            <Loading />
          ) : (tours.data ?? []).length === 0 ? (
            <div className="mt-4"><Empty text={t('dest.noTours')} /></div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(tours.data ?? []).map((x) => (
                <TourCard key={x.id} tour={x} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 rounded-3xl bg-navy-50 p-8 text-center">
          <h3 className="font-display text-xl font-bold text-navy-900">
            {d.name}{t('dest.readyTitle')}
          </h3>
          <p className="mt-2 text-navy-500">{t('dest.readySub')}</p>
          <Link to={`/booking?destination=${d.id}`} className="btn-gold mt-5">
            {t('dest.startBooking')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </>
  );
}
