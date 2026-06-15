import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Map,
  Hotel,
  Plane,
  Settings,
  Globe2,
  X
} from 'lucide-react';

const items = [
  { to: '/admin/dashboard', label: 'Хяналтын самбар', icon: LayoutDashboard },
  { to: '/admin/bookings', label: 'Захиалгууд', icon: CalendarCheck },
  { to: '/admin/tours', label: 'Аялал ба чиглэл', icon: Map },
  { to: '/admin/hotels', label: 'Зочид буудал', icon: Hotel },
  { to: '/admin/flights', label: 'Нислэгийн хүсэлт', icon: Plane },
  { to: '/admin/settings', label: 'Тохиргоо', icon: Settings }
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: Props) {
  return (
    <>
      {/* mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-navy-950/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy-950 text-navy-100 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-navy-800 px-5">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy-700 text-gold-400">
              <Globe2 size={16} />
            </span>
            <span className="font-display text-sm font-bold text-white">
              TourHub <span className="text-sky-400">Admin</span>
            </span>
          </div>
          <button className="text-navy-300 lg:hidden" onClick={onClose} aria-label="Хаах">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-navy-700 text-white'
                    : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-navy-800 p-4 text-xs text-navy-400">
          tourhubmongolia.com
        </div>
      </aside>
    </>
  );
}
