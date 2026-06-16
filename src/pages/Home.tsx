import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Plane,
  ShieldCheck,
  Headphones,
  Wallet,
  Sparkles,
  Star,
  Users,
  Award,
  ArrowRight
} from 'lucide-react';
const HeroGlobe = lazy(() => import('../components/HeroGlobe'));
import TourCard from '../components/TourCard';
import DestinationCard from '../components/DestinationCard';
import { Loading, ErrorState } from '../components/States';
import { getFeaturedDestinations, getFeaturedTours } from '../lib/api';
import { useQuery } from '../hooks/useQuery';
import { useLang } from '../lib/i18n';
import type { Destination, Tour } from '../types';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const whyItems = [
  {
    icon: ShieldCheck,
    title: { mn: 'Найдвартай үйлчилгээ', en: 'Reliable service' },
    desc: {
      mn: 'Албан ёсны гэрээт түнш буудал, аяллын компаниудтай хамтран ажилладаг.',
      en: 'We work with officially contracted partner hotels and tour operators.'
    }
  },
  {
    icon: Wallet,
    title: { mn: 'Шударга үнэ', en: 'Fair pricing' },
    desc: {
      mn: 'Далд төлбөргүй, ил тод үнийн бодлого. Монгол төгрөгөөр төлбөр тооцоо.',
      en: 'No hidden fees, transparent pricing. Payments in Mongolian tugrik.'
    }
  },
  {
    icon: Headphones,
    title: { mn: '24/7 дэмжлэг', en: '24/7 support' },
    desc: {
      mn: 'Аяллын турш монгол хэлээр зөвлөгөө, тусламж авах боломжтой.',
      en: 'Advice and assistance throughout your trip, in Mongolian and English.'
    }
  },
  {
    icon: Sparkles,
    title: { mn: 'Нэг дороос бүгдийг', en: 'Everything in one place' },
    desc: {
      mn: 'Аялал, буудал, нислэг — бүх захиалгаа нэг платформоос шийднэ.',
      en: 'Tours, hotels, flights — manage every booking on one platform.'
    }
  }
];

const testimonials = [
  {
    name: 'Б. Болормаа',
    tour: { mn: 'Хөвсгөл аялал', en: 'Khuvsgul tour' },
    text: {
      mn: 'Маш сайхан зохион байгуулалттай аялал болсон. Дараа нь гэр бүлээрээ дахин явна!',
      en: 'A wonderfully organized trip. We will definitely go again with the whole family!'
    }
  },
  {
    name: 'Д. Тэмүүлэн',
    tour: { mn: 'Сөүл шопинг тур', en: 'Seoul shopping tour' },
    text: {
      mn: 'Нислэг, буудал бүгдийг нэг дороос шийдээд өгсөн нь үнэхээр амар байлаа.',
      en: 'Flights and hotels were all arranged in one place — incredibly convenient.'
    }
  },
  {
    name: 'С. Энхжин',
    tour: { mn: 'Тайланд амралт', en: 'Thailand vacation' },
    text: {
      mn: 'Зөвлөх нь түргэн холбогдож, бүх асуултад тодорхой хариулт өгсөн. Баярлалаа!',
      en: 'The consultant reached out quickly and answered every question clearly. Thank you!'
    }
  }
];

const trustStats = [
  { icon: Users, num: '1200+', label: { mn: 'Сэтгэл хангалуун аялагч', en: 'Happy travelers' } },
  { icon: Award, num: { mn: '5 жил', en: '5 years' }, label: { mn: 'Аяллын салбарын туршлага', en: 'Industry experience' } },
  { icon: ShieldCheck, num: '100%', label: { mn: 'Баталгаатай захиалга', en: 'Guaranteed bookings' } }
];

export default function Home() {
  const { t, lang } = useLang();

  const tours = useQuery<Tour[]>(() => getFeaturedTours(8), []);
  const destinations = useQuery<Destination[]>(() => getFeaturedDestinations(6), []);

  const domestic = (tours.data ?? []).filter((x) => x.type === 'domestic').slice(0, 4);
  const international = (tours.data ?? []).filter((x) => x.type === 'international').slice(0, 4);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          {[...Array(40)].map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-sky-300"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                opacity: 0.2 + ((i * 13) % 60) / 100
              }}
            />
          ))}
        </div>

        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-sm font-semibold text-sky-300"
            >
              <Sparkles size={14} /> {t('home.badge')}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl"
            >
              {t('home.heroTitle1')}{' '}
              <span className="bg-gradient-to-r from-sky-400 to-gold-400 bg-clip-text text-transparent">
                {t('home.heroTitle2')}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 max-w-xl text-lg text-navy-100/80"
            >
              {t('home.heroSub')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/tours" className="btn-gold">
                <Search size={18} /> {t('home.searchTours')}
              </Link>
              <Link to="/flights" className="btn-outline !border-white/20 !bg-white/10 !text-white hover:!bg-white/20">
                <Plane size={18} /> {t('home.bookFlight')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-8"
            >
              {[
                ['1200+', t('home.statTravelers')],
                ['50+', t('home.statDestinations')],
                ['4.9★', t('home.statRating')]
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl font-bold text-gold-400">{num}</p>
                  <p className="text-sm text-navy-200">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <Suspense fallback={<div className="mx-auto aspect-square w-full max-w-[460px]" />}>
            <HeroGlobe />
          </Suspense>
        </div>
      </section>

      {/* ============ FEATURED DOMESTIC ============ */}
      <section className="container-x py-16">
        <motion.div {...fadeUp} className="flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">{t('home.featuredDomestic')}</h2>
            <p className="mt-2 text-navy-500">{t('home.featuredDomesticSub')}</p>
          </div>
          <Link to="/tours/domestic" className="hidden items-center gap-1 font-semibold text-sky-500 hover:underline sm:flex">
            {t('common.viewAll')} <ArrowRight size={16} />
          </Link>
        </motion.div>
        {tours.loading ? (
          <Loading />
        ) : tours.error ? (
          <ErrorState text={tours.error} onRetry={tours.refetch} />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {domestic.map((x) => (
              <TourCard key={x.id} tour={x} />
            ))}
          </div>
        )}
      </section>

      {/* ============ FEATURED INTERNATIONAL ============ */}
      <section className="bg-navy-50/50 py-16">
        <div className="container-x">
          <motion.div {...fadeUp} className="flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">{t('home.featuredIntl')}</h2>
              <p className="mt-2 text-navy-500">{t('home.featuredIntlSub')}</p>
            </div>
            <Link to="/tours/international" className="hidden items-center gap-1 font-semibold text-sky-500 hover:underline sm:flex">
              {t('common.viewAll')} <ArrowRight size={16} />
            </Link>
          </motion.div>
          {!tours.loading && !tours.error && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {international.map((x) => (
                <TourCard key={x.id} tour={x} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ POPULAR DESTINATIONS ============ */}
      <section className="container-x py-16">
        <motion.div {...fadeUp} className="text-center">
          <h2 className="section-title">{t('home.popularDest')}</h2>
          <p className="mt-2 text-navy-500">{t('home.popularDestSub')}</p>
        </motion.div>
        {destinations.loading ? (
          <Loading />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(destinations.data ?? []).map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link to="/destinations" className="btn-outline">
            {t('home.viewAllDest')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="bg-navy-950 py-16 text-white">
        <div className="container-x">
          <motion.h2 {...fadeUp} className="text-center font-display text-2xl font-bold sm:text-3xl">
            {t('home.whyTitle')}
          </motion.h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title.en}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-navy-800 bg-navy-900/60 p-6"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-400/15 text-gold-400">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">{desc[lang]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRUST ============ */}
      <section className="container-x py-16">
        <motion.h2 {...fadeUp} className="text-center font-display text-2xl font-bold text-navy-900 sm:text-3xl">
          {t('home.trustTitle')}
        </motion.h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map(({ name, tour, text }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex gap-1 text-gold-400">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={15} className="fill-gold-400" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">“{text[lang]}”</p>
              <div className="mt-4 flex items-center gap-3 border-t border-navy-100 pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-navy-100 font-bold text-navy-700">
                  {name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold text-navy-900">{name}</p>
                  <p className="text-xs text-navy-400">{tour[lang]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 rounded-3xl bg-gradient-to-r from-navy-800 to-navy-700 p-8 text-white sm:grid-cols-3 sm:p-10">
          {trustStats.map(({ icon: Icon, num, label }) => (
            <div key={label.en} className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-400">
                <Icon size={22} />
              </span>
              <div>
                <p className="font-display text-2xl font-bold">{typeof num === 'string' ? num : num[lang]}</p>
                <p className="text-sm text-navy-100">{label[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="container-x pb-16">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-navy-700 p-10 text-center text-white sm:p-14"
        >
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('home.ctaTitle')}</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/85">{t('home.ctaSub')}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link to="/booking" className="btn-gold">{t('nav.book')}</Link>
            <Link to="/contact" className="btn-outline !border-white/30 !bg-white/10 !text-white hover:!bg-white/20">
              {t('nav.contact')}
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
