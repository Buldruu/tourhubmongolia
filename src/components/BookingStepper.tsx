import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '../lib/i18n';

const STEP_KEYS = [
  'booking.step.dest',
  'booking.step.hotel',
  'booking.step.date',
  'booking.step.info',
  'booking.step.confirm'
];

export default function BookingStepper({ current }: { current: number }) {
  const { t } = useLang();

  return (
    <div className="flex items-center justify-between">
      {STEP_KEYS.map((key, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ scale: active ? 1.1 : 1 }}
                className={`grid h-10 w-10 place-items-center rounded-full border-2 text-sm font-bold transition ${
                  done
                    ? 'border-gold-400 bg-gold-400 text-navy-900'
                    : active
                      ? 'border-navy-700 bg-navy-700 text-white'
                      : 'border-navy-200 bg-white text-navy-400'
                }`}
              >
                {done ? <Check size={18} /> : i + 1}
              </motion.div>
              <span
                className={`mt-1.5 hidden text-xs font-semibold sm:block ${
                  active ? 'text-navy-800' : 'text-navy-400'
                }`}
              >
                {t(key)}
              </span>
            </div>
            {i < STEP_KEYS.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 rounded sm:-mt-5 ${done ? 'bg-gold-400' : 'bg-navy-100'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
