import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import type { Tour } from '../types';
import { formatPrice } from '../utils/format';
import { useLang } from '../lib/i18n';

export default function TourCard({ tour }: { tour: Tour }) {
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="card group flex h-full flex-col"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={tour.image_url ?? ''}
          alt={tour.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy-800">
          {t(`common.${tour.type}`)}
        </span>
        {tour.is_featured && (
          <span className="absolute right-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-navy-900">
            {t('common.featured')}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-navy-900">{tour.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-500">
          {tour.destinations && (
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {tour.destinations.name}
            </span>
          )}
          {tour.duration && (
            <span className="flex items-center gap-1">
              <Clock size={14} /> {tour.duration}
            </span>
          )}
        </div>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-navy-500">{tour.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
          <div>
            <p className="text-xs text-navy-400">{t('common.priceFrom')}</p>
            <p className="font-display text-lg font-bold text-navy-800">{formatPrice(tour.price_from)}</p>
          </div>
          <Link
            to={`/booking?tour=${tour.id}${tour.destination_id ? `&destination=${tour.destination_id}` : ''}`}
            className="btn-primary !px-4 !py-2 text-sm"
          >
            {t('common.book')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
