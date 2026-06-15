import { Link } from 'react-router-dom';
import { Globe2, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { useLang } from '../lib/i18n';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-700 text-gold-400">
              <Globe2 size={20} />
            </span>
            <span className="font-display text-lg font-bold text-white">
              TourHub <span className="text-sky-400">Mongolia</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-200">{t('footer.desc')}</p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-lg bg-navy-800 transition hover:bg-navy-700">
              <Facebook size={16} />
            </a>
            <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-lg bg-navy-800 transition hover:bg-navy-700">
              <Instagram size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-white">{t('footer.tours')}</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/tours/domestic" className="hover:text-gold-400">{t('footer.domestic')}</Link></li>
            <li><Link to="/tours/international" className="hover:text-gold-400">{t('footer.international')}</Link></li>
            <li><Link to="/destinations" className="hover:text-gold-400">{t('nav.destinations')}</Link></li>
            <li><Link to="/hotels" className="hover:text-gold-400">{t('nav.hotels')}</Link></li>
            <li><Link to="/flights" className="hover:text-gold-400">{t('footer.flightBooking')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-white">{t('footer.company')}</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-gold-400">{t('nav.about')}</Link></li>
            <li><Link to="/faq" className="hover:text-gold-400">{t('footer.faq')}</Link></li>
            <li><Link to="/contact" className="hover:text-gold-400">{t('footer.contact')}</Link></li>
            <li><Link to="/booking" className="hover:text-gold-400">{t('footer.book')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-white">{t('footer.contact')}</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone size={15} className="text-gold-400" /> +976 99682882</li>
            <li className="flex items-center gap-2"><Mail size={15} className="text-gold-400" /> info@tourhubmongolia.com</li>
            <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-gold-400" /> {t('contact.addressValue')}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-800">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-navy-300 sm:flex-row">
          <span>© {new Date().getFullYear()} TourHub Mongolia. {t('footer.rights')}</span>
          <span className="flex items-center gap-4">
            <span>tourhubmongolia.com</span>
            <Link to="/admin/login" className="text-navy-400 transition hover:text-gold-400">
              {t('footer.admin')}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
