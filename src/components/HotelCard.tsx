import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import type { Hotel } from '../types';
import { formatPrice } from '../utils/format';
import { useLang } from '../lib/i18n';

interface Props {
  hotel: Hotel;
  onSelect?: (hotel: Hotel) => void;
  selected?: boolean;
}

export default function HotelCard({ hotel, onSelect, selected }: Props) {
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className={`card group flex h-full flex-col ${selected ? 'ring-2 ring-gold-400' : ''}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.image_url ?? ''}
          alt={hotel.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-navy-800">
          <Star size={12} className="fill-gold-400 text-gold-400" /> {hotel.rating}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-navy-900">{hotel.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-navy-500">
          <MapPin size={14} /> {[hotel.city, hotel.country].filter(Boolean).join(', ')}
        </p>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-navy-500">{hotel.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
          <div>
            <p className="text-xs text-navy-400">{t('common.perNight')}</p>
            <p className="font-display text-lg font-bold text-navy-800">{formatPrice(hotel.price_from)}</p>
          </div>
          {onSelect ? (
            <button
              onClick={() => onSelect(hotel)}
              className={selected ? 'btn-gold !px-4 !py-2 text-sm' : 'btn-primary !px-4 !py-2 text-sm'}
            >
              {selected ? t('common.selected') : t('common.select')}
            </button>
          ) : (
            <Link to={`/hotel/${hotel.id}`} className="btn-primary !px-4 !py-2 text-sm">
              {t('common.details')}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
