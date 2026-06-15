import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe2, Target, Heart, Users } from 'lucide-react';
import { useLang } from '../lib/i18n';

const values = [
  {
    icon: Target,
    title: { mn: 'Бидний зорилго', en: 'Our mission' },
    desc: {
      mn: 'Аяллын захиалгыг хялбар, ил тод, найдвартай болгож, монгол хүн бүрд аялах боломжийг нээх.',
      en: 'Make travel booking simple, transparent, and reliable — so every Mongolian can travel.'
    }
  },
  {
    icon: Heart,
    title: { mn: 'Бидний үнэт зүйл', en: 'Our values' },
    desc: {
      mn: 'Үйлчлүүлэгч бүрд чин сэтгэлээсээ хандаж, аяллын туршид нь хамт байх.',
      en: 'Care for every customer sincerely and stay with them throughout the journey.'
    }
  },
  {
    icon: Users,
    title: { mn: 'Бидний баг', en: 'Our team' },
    desc: {
      mn: 'Аяллын салбарт олон жил ажилласан туршлагатай зөвлөхүүд, мэргэжлийн хамт олон.',
      en: 'Experienced consultants and professionals with years in the travel industry.'
    }
  }
];

const story = {
  mn: [
    'Монголчуудын гадаад, дотоод аялал жилээс жилд өсөж байгаа ч захиалгын процесс олон газар тарсан хэвээр байна — аяллыг нэг компаниас, тийзийг өөр газраас, буудлыг гуравдагч сайтаас захиалдаг.',
    'TourHub Mongolia эдгээрийг нэг дор нэгтгэж, монгол хэл дээр, монгол хэрэглэгчдэд зориулан бүтээгдсэн. Та чиглэлээ сонгоод, буудлаа шийдээд, хүсэлтээ илгээхэд л хангалттай — үлдсэнийг нь манай зөвлөхүүд хариуцна.'
  ],
  en: [
    'Travel by Mongolians keeps growing every year, yet booking remains scattered — tours from one company, tickets from another, hotels from a third-party site.',
    'TourHub Mongolia brings all of it together in one place, built for Mongolian travelers. Pick a destination, choose a hotel, send a request — our consultants handle the rest.'
  ]
};

export default function About() {
  const { t, lang } = useLang();

  return (
    <>
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-16 text-white">
        <div className="container-x max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-extrabold sm:text-4xl"
          >
            {t('about.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-navy-100/80"
          >
            {t('about.sub')}
          </motion.p>
        </div>
      </section>

      <div className="container-x py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title.en}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-7"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-700">
                <Icon size={22} />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold text-navy-900">{title[lang]}</h2>
              <p className="mt-2 leading-relaxed text-navy-500">{desc[lang]}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">{t('about.whyTitle')}</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-navy-600">
              {story[lang].map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <Link to="/contact" className="btn-primary mt-6">{t('about.contactUs')}</Link>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80"
              alt="Travel"
              className="rounded-3xl shadow-card"
            />
            <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-400 text-navy-900">
                <Globe2 size={20} />
              </span>
              <div>
                <p className="font-display font-bold text-navy-900">{t('about.destCount')}</p>
                <p className="text-xs text-navy-400">{t('about.destTypes')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
