import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Destination } from '../types';
import { useLang } from '../lib/i18n';

export default function DestinationCard({ destination }: { destination: Destination }) {
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/destination/${destination.id}`} className="card group block">
        <div className="relative h-56 overflow-hidden">
          <img
            src={destination.image_url ?? ''}
            alt={destination.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy-800">
            {t(`common.${destination.type}`)}
          </span>
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-display text-xl font-bold text-white">{destination.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-white/80">
              <MapPin size={13} /> {destination.country}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4">
          <p className="line-clamp-2 pr-2 text-sm text-navy-500">{destination.description}</p>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-700 transition group-hover:bg-gold-400 group-hover:text-navy-900">
            <ArrowRight size={16} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
