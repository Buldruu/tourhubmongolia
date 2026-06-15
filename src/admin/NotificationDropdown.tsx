import { useEffect, useRef, useState } from 'react';
import { Bell, Plane, CalendarCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getNotifications, markAllNotificationsRead } from '../lib/api';
import { formatDateTime } from '../utils/format';
import type { AdminNotification } from '../types';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AdminNotification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    const { data } = await getNotifications(15);
    setItems(data ?? []);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const unread = items.filter((i) => !i.is_read).length;

  async function markAllRead() {
    await markAllNotificationsRead();
    load();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-10 w-10 place-items-center rounded-xl text-navy-600 transition hover:bg-navy-50"
        aria-label="Мэдэгдэл"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card"
          >
            <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3">
              <span className="text-sm font-bold text-navy-900">Мэдэгдэл</span>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs font-semibold text-sky-500 hover:underline">
                  Бүгдийг уншсан болгох
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-navy-400">Мэдэгдэл алга байна.</p>
              )}
              {items.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 border-b border-navy-50 px-4 py-3 ${n.is_read ? '' : 'bg-sky-50/60'}`}
                >
                  <span
                    className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                      n.type === 'flight' ? 'bg-gold-300/40 text-gold-600' : 'bg-navy-50 text-navy-600'
                    }`}
                  >
                    {n.type === 'flight' ? <Plane size={15} /> : <CalendarCheck size={15} />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy-900">{n.title}</p>
                    <p className="truncate text-xs text-navy-500">{n.message}</p>
                    <p className="mt-0.5 text-[11px] text-navy-300">{formatDateTime(n.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
