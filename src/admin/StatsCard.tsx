import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  value: number | string;
  icon: LucideIcon;
  accent?: 'navy' | 'sky' | 'gold' | 'green';
}

const accents = {
  navy: 'bg-navy-50 text-navy-700',
  sky: 'bg-sky-100 text-sky-600',
  gold: 'bg-gold-300/40 text-gold-600',
  green: 'bg-green-100 text-green-600'
};

export default function StatsCard({ title, value, icon: Icon, accent = 'navy' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex items-center gap-4 p-5"
    >
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${accents[accent]}`}>
        <Icon size={22} />
      </span>
      <div>
        <p className="text-sm font-medium text-navy-400">{title}</p>
        <p className="font-display text-2xl font-bold text-navy-900">{value}</p>
      </div>
    </motion.div>
  );
}
