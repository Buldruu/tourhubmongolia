import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useLang } from '../lib/i18n';

export default function Contact() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError(t('contact.err'));
      return;
    }
    setError(null);
    const body = encodeURIComponent(`${form.message}\n\n${form.name}\nУтас / Phone: ${form.phone}\nИ-мэйл / Email: ${form.email}`);
    window.location.href = `mailto:info@tourhubmongolia.com?subject=${encodeURIComponent('TourHub Mongolia — Contact')}&body=${body}`;
    setSent(true);
  }

  const infoItems = [
    { icon: Phone, title: t('contact.phone'), value: '+976 99682882' },
    { icon: Mail, title: t('common.email'), value: 'info@tourhubmongolia.com' },
    { icon: MapPin, title: t('contact.address'), value: t('contact.addressValue') },
    { icon: Clock, title: t('contact.hours'), value: t('contact.hoursValue') }
  ];

  return (
    <div className="container-x grid gap-10 py-14 lg:grid-cols-2">
      <div>
        <h1 className="section-title">{t('contact.title')}</h1>
        <p className="mt-3 max-w-md leading-relaxed text-navy-500">{t('contact.sub')}</p>

        <div className="mt-8 space-y-4">
          {infoItems.map(({ icon: Icon, title, value }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card flex items-center gap-4 p-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy-400">{title}</p>
                <p className="font-bold text-navy-900">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card flex h-full flex-col items-center justify-center gap-4 p-10 text-center"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={32} />
            </span>
            <h2 className="font-display text-xl font-bold text-navy-900">{t('contact.thanks')}</h2>
            <p className="text-navy-500">{t('contact.mailOpened')}</p>
            <button className="btn-outline" onClick={() => setSent(false)}>{t('contact.newMessage')}</button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4 p-7">
            <h2 className="font-display text-lg font-bold text-navy-900">{t('contact.formTitle')}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{t('common.name')} *</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('common.namePlaceholder')} />
              </div>
              <div>
                <label className="label">{t('contact.phone')} *</label>
                <input type="tel" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9911-0000" />
              </div>
            </div>
            <div>
              <label className="label">{t('common.email')}</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" />
            </div>
            <div>
              <label className="label">{t('contact.message')} *</label>
              <textarea className="input min-h-[130px]" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t('contact.messagePlaceholder')} />
            </div>
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full">
              <Send size={16} /> {t('common.send')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
