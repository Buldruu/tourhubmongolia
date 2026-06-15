import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { useLang } from '../lib/i18n';

export default function NotFound() {
  const { t } = useLang();

  return (
    <div className="container-x grid place-items-center py-28 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-navy-50 text-navy-400">
          <Compass size={36} />
        </span>
        <h1 className="mt-6 font-display text-5xl font-extrabold text-navy-900">404</h1>
        <p className="mt-3 text-lg text-navy-500">{t('nf.message')}</p>
        <Link to="/" className="btn-primary mt-7">{t('nf.goHome')}</Link>
      </motion.div>
    </div>
  );
}
