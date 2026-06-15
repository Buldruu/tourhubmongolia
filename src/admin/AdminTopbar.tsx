import { Menu, LogOut, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotificationDropdown from './NotificationDropdown';

export default function AdminTopbar({ onMenu }: { onMenu: () => void }) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-100 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="grid h-10 w-10 place-items-center rounded-xl text-navy-600 hover:bg-navy-50 lg:hidden"
          onClick={onMenu}
          aria-label="Цэс"
        >
          <Menu size={20} />
        </button>
        <Link
          to="/"
          className="hidden items-center gap-1.5 text-sm font-semibold text-navy-500 hover:text-navy-800 sm:flex"
        >
          <ExternalLink size={14} /> Вэбсайт руу очих
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-navy-900">{user?.email}</p>
          <p className="text-xs text-navy-400">Админ</p>
        </div>
        <button
          onClick={signOut}
          className="grid h-10 w-10 place-items-center rounded-xl text-navy-600 transition hover:bg-red-50 hover:text-red-500"
          aria-label="Гарах"
          title="Гарах"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
