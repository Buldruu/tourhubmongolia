import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Globe2, Menu, X, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang, type Lang } from '../lib/i18n';

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/tours/domestic', key: 'nav.domesticTours' },
  { to: '/tours/international', key: 'nav.intlTours' },
  { to: '/hotels', key: 'nav.hotels' },
  { to: '/flights', key: 'nav.flights' },
  { to: '/avia-service', key: 'nav.avia' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' }
];

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex shrink-0 rounded-lg border border-navy-200 p-0.5">
      {(['mn', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-md px-2 py-1 text-xs font-bold uppercase transition ${
            lang === l ? 'bg-navy-700 text-white' : 'text-navy-500 hover:text-navy-800'
          }`}
          aria-label={l === 'mn' ? 'Монгол хэл' : 'English'}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1520px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-700 text-gold-400">
            <Globe2 size={20} />
          </span>
          <span className="whitespace-nowrap font-display text-lg font-bold text-navy-900">
            TourHub <span className="text-sky-500">Mongolia</span>
          </span>
        </Link>

        {/* desktop nav — horizontal single row, words never stack */}
        <nav className="hidden flex-1 items-center justify-center gap-0.5 xl:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition 2xl:px-4 ${
                  isActive ? 'bg-navy-50 text-navy-800' : 'text-navy-600 hover:bg-navy-50 hover:text-navy-800'
                }`
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        {/* pushed to the far right, with breathing room from the corner */}
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <LangToggle />
          <Link to="/booking" className="btn-gold whitespace-nowrap !px-4 !py-2 text-sm">
            <Plane size={15} /> {t('nav.book')}
          </Link>
        </div>

        {/* mobile / tablet */}
        <div className="ml-auto flex items-center gap-2 xl:hidden">
          <LangToggle />
          <button
            className="grid h-10 w-10 place-items-center rounded-lg text-navy-700 hover:bg-navy-50"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-navy-100 bg-white xl:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-3">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 font-semibold ${
                      isActive ? 'bg-navy-50 text-navy-800' : 'text-navy-600'
                    }`
                  }
                >
                  {t(l.key)}
                </NavLink>
              ))}
              <Link to="/booking" onClick={() => setOpen(false)} className="btn-gold mt-2">
                <Plane size={16} /> {t('nav.book')}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
