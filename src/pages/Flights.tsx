import { motion } from 'framer-motion';
import { Plane, Clock, PhoneCall, BadgeCheck } from 'lucide-react';
import FlightRequestForm from '../components/FlightRequestForm';
import { useLang } from '../lib/i18n';

export default function Flights() {
  const { t } = useLang();

  const infoCards = [
    { icon: Clock, title: t('flights.fastTitle'), desc: t('flights.fastDesc') },
    { icon: BadgeCheck, title: t('flights.confirmedTitle'), desc: t('flights.confirmedDesc') },
    { icon: PhoneCall, title: t('flights.adviceTitle'), desc: t('flights.adviceDesc') }
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-14 text-white">
        <div className="container-x text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto inline-grid h-14 w-14 place-items-center rounded-2xl bg-gold-400/15 text-gold-400"
          >
            <Plane size={26} />
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-3xl font-extrabold sm:text-4xl"
          >
            {t('flights.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-3 max-w-xl text-navy-100/80"
          >
            {t('flights.sub')}
          </motion.p>
        </div>
      </section>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FlightRequestForm />
        </div>
        <aside className="space-y-4">
          {infoCards.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card flex gap-4 p-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-600">
                <Icon size={20} />
              </span>
              <div>
                <p className="font-bold text-navy-900">{title}</p>
                <p className="mt-1 text-sm text-navy-500">{desc}</p>
              </div>
            </motion.div>
          ))}
        </aside>
      </div>
    </>
  );
}
