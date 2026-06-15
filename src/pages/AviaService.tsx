import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlaneTakeoff, PhoneCall } from 'lucide-react';
import { useLang } from '../lib/i18n';

export default function AviaService() {
  const { t } = useLang();

  return (
    <div className="container-x grid place-items-center py-24 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-navy-50 text-navy-700">
          <PlaneTakeoff size={36} />
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold text-navy-900 sm:text-4xl">
          {t('avia.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-navy-500">{t('avia.message')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/contact" className="btn-gold">
            <PhoneCall size={17} /> {t('avia.contact')}
          </Link>
          <a href="tel:+97699682882" className="btn-outline">
            +976 99682882
          </a>
        </div>
      </motion.div>
    </div>
  );
}
