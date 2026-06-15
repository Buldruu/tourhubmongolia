import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  Send,
  Star,
  Users
} from 'lucide-react';
import BookingStepper from '../components/BookingStepper';
import HotelCard from '../components/HotelCard';
import { Loading, Empty } from '../components/States';
import { createBooking, getDestinations, getHotel, getHotelsByDestination } from '../lib/api';
import { useQuery } from '../hooks/useQuery';
import { useLang } from '../lib/i18n';
import { formatDate } from '../utils/format';
import type { BookingInsert, Destination, Hotel } from '../types';

interface CustomerInfo {
  customer_name: string;
  phone: string;
  email: string;
  travelers_count: number;
  special_request: string;
}

export default function BookingPage() {
  const [params] = useSearchParams();
  const { t } = useLang();
  const presetDestination = params.get('destination');
  const presetHotel = params.get('hotel');
  const presetTour = params.get('tour');

  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [travelDate, setTravelDate] = useState('');
  const [info, setInfo] = useState<CustomerInfo>({
    customer_name: '',
    phone: '',
    email: '',
    travelers_count: 1,
    special_request: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // all destinations for step 0
  const destinations = useQuery<Destination[]>(() => getDestinations(), []);

  // hotels of the chosen destination for step 1
  const hotels = useQuery<Hotel[]>(async () => {
    if (!destination) return { data: [] as Hotel[], error: null };
    return getHotelsByDestination(destination.id);
  }, [destination?.id]);

  // apply presets from URL once data is in
  useEffect(() => {
    if (presetDestination && destinations.data && !destination) {
      const d = destinations.data.find((x) => x.id === presetDestination);
      if (d) {
        setDestination(d);
        setStep((s) => (s === 0 ? 1 : s));
      }
    }
  }, [presetDestination, destinations.data]);

  useEffect(() => {
    async function applyHotel() {
      if (!presetHotel || hotel) return;
      const { data } = await getHotel(presetHotel);
      if (data) {
        setHotel(data);
        if (!destination && destinations.data) {
          const d = destinations.data.find((x) => x.id === data.destination_id);
          if (d) setDestination(d);
        }
        setStep((s) => (s < 2 ? 2 : s));
      }
    }
    applyHotel();
  }, [presetHotel, destinations.data]);

  const grouped = useMemo(() => {
    const list = destinations.data ?? [];
    return {
      domestic: list.filter((d) => d.type === 'domestic'),
      international: list.filter((d) => d.type === 'international')
    };
  }, [destinations.data]);

  function next() {
    setFormError(null);
    if (step === 0 && !destination) return setFormError(t('booking.errDest'));
    if (step === 2 && !travelDate) return setFormError(t('booking.errDate'));
    if (step === 3) {
      if (!info.customer_name.trim() || !info.phone.trim()) return setFormError(t('booking.errInfo'));
      if (info.travelers_count < 1) return setFormError(t('booking.errTravelers'));
    }
    setStep((s) => Math.min(s + 1, 4));
  }

  function back() {
    setFormError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    const payload: BookingInsert = {
      destination_id: destination?.id ?? null,
      hotel_id: hotel?.id ?? null,
      tour_id: presetTour ?? null,
      customer_name: info.customer_name.trim(),
      phone: info.phone.trim(),
      email: info.email.trim() || null,
      travel_date: travelDate || null,
      travelers_count: info.travelers_count,
      special_request: info.special_request.trim() || null
    };
    const { error } = await createBooking(payload);
    setSubmitting(false);
    if (error) {
      setSubmitError(t('booking.errSubmit') + error.message);
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="container-x grid place-items-center py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card flex max-w-lg flex-col items-center gap-4 p-10 text-center"
        >
          <span className="grid h-20 w-20 place-items-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={40} />
          </span>
          <h1 className="font-display text-2xl font-bold text-navy-900">{t('booking.successTitle')}</h1>
          <p className="text-navy-500">{t('booking.successMsg')}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-primary">{t('booking.goHome')}</Link>
            <Link to="/tours" className="btn-outline">{t('booking.moreTours')}</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-x max-w-4xl py-12">
      <h1 className="section-title text-center">{t('booking.title')}</h1>
      <p className="mt-2 text-center text-navy-500">{t('booking.flow')}</p>

      <div className="mt-8">
        <BookingStepper current={step} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3 }}
          className="mt-10"
        >
          {/* STEP 0: destination */}
          {step === 0 && (
            <div>
              {destinations.loading ? (
                <Loading />
              ) : (
                (['domestic', 'international'] as const).map((ty) => (
                  <div key={ty} className="mb-8">
                    <h2 className="mb-4 font-display text-lg font-bold text-navy-800">
                      {ty === 'domestic' ? t('booking.domesticDest') : t('booking.intlDest')}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {grouped[ty].map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setDestination(d)}
                          className={`card group overflow-hidden text-left transition ${
                            destination?.id === d.id ? 'ring-2 ring-gold-400' : 'hover:shadow-card'
                          }`}
                        >
                          <div className="relative h-28">
                            <img src={d.image_url ?? ''} alt={d.name} className="h-full w-full object-cover" />
                            {destination?.id === d.id && (
                              <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-gold-400 text-navy-900">
                                <CheckCircle2 size={16} />
                              </span>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="font-bold text-navy-900">{d.name}</p>
                            <p className="flex items-center gap-1 text-xs text-navy-400">
                              <MapPin size={11} /> {d.country}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* STEP 1: hotel */}
          {step === 1 && (
            <div>
              <h2 className="mb-1 font-display text-lg font-bold text-navy-800">
                {destination?.name} {t('booking.connectedHotels')}
              </h2>
              <p className="mb-5 text-sm text-navy-500">{t('booking.hotelOptional')}</p>
              {hotels.loading ? (
                <Loading />
              ) : (hotels.data ?? []).length === 0 ? (
                <Empty text={t('booking.noHotelsContinue')} />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {(hotels.data ?? []).map((h) => (
                    <HotelCard
                      key={h.id}
                      hotel={h}
                      selected={hotel?.id === h.id}
                      onSelect={(sel) => setHotel(hotel?.id === sel.id ? null : sel)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: date */}
          {step === 2 && (
            <div className="card mx-auto max-w-md p-8 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sky-100 text-sky-600">
                <CalendarDays size={26} />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold text-navy-900">{t('booking.pickDate')}</h2>
              <input
                type="date"
                className="input mt-5"
                value={travelDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setTravelDate(e.target.value)}
              />
            </div>
          )}

          {/* STEP 3: info */}
          {step === 3 && (
            <div className="card mx-auto max-w-xl space-y-4 p-8">
              <h2 className="font-display text-lg font-bold text-navy-900">{t('booking.customerInfo')}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">{t('common.name')} *</label>
                  <input
                    className="input"
                    value={info.customer_name}
                    onChange={(e) => setInfo({ ...info, customer_name: e.target.value })}
                    placeholder={t('common.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="label">{t('common.phone')} *</label>
                  <input
                    type="tel"
                    className="input"
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                    placeholder="9911-0000"
                  />
                </div>
                <div>
                  <label className="label">{t('common.email')}</label>
                  <input
                    type="email"
                    className="input"
                    value={info.email}
                    onChange={(e) => setInfo({ ...info, email: e.target.value })}
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="label">{t('booking.travelers')} *</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    className="input"
                    value={info.travelers_count}
                    onChange={(e) => setInfo({ ...info, travelers_count: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="label">{t('booking.specialRequest')}</label>
                <textarea
                  className="input min-h-[90px]"
                  value={info.special_request}
                  onChange={(e) => setInfo({ ...info, special_request: e.target.value })}
                  placeholder={t('booking.specialPlaceholder')}
                />
              </div>
            </div>
          )}

          {/* STEP 4: confirm */}
          {step === 4 && (
            <div className="card mx-auto max-w-xl p-8">
              <h2 className="font-display text-lg font-bold text-navy-900">{t('booking.review')}</h2>
              <dl className="mt-5 space-y-3 text-sm">
                {[
                  [t('booking.destLabel'), destination ? `${destination.name}, ${destination.country}` : '—'],
                  [t('booking.hotelLabel'), hotel?.name ?? t('booking.notSelected')],
                  [t('booking.dateLabel'), formatDate(travelDate)],
                  [t('booking.customerLabel'), info.customer_name],
                  [t('common.phone'), info.phone],
                  [t('common.email'), info.email || '—'],
                  [t('booking.travelersLabel'), `${info.travelers_count} ${t('booking.people')}`],
                  [t('booking.specialRequest'), info.special_request || '—']
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-navy-50 pb-2.5">
                    <dt className="font-semibold text-navy-500">{k}</dt>
                    <dd className="text-right font-medium text-navy-900">{v}</dd>
                  </div>
                ))}
              </dl>
              {hotel && (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-navy-50 p-3">
                  <img src={hotel.image_url ?? ''} alt={hotel.name} className="h-14 w-20 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-bold text-navy-900">{hotel.name}</p>
                    <p className="flex items-center gap-1 text-xs text-navy-500">
                      <Star size={11} className="fill-gold-400 text-gold-400" /> {hotel.rating} · {hotel.city}
                    </p>
                  </div>
                </div>
              )}
              {submitError && (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {submitError}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {formError && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
          {formError}
        </p>
      )}

      {/* nav buttons */}
      <div className="mt-8 flex items-center justify-between">
        <button onClick={back} disabled={step === 0} className="btn-outline disabled:invisible">
          <ArrowLeft size={16} /> {t('common.back')}
        </button>
        {step < 4 ? (
          <button onClick={next} className="btn-primary">
            {t('common.continue')} <ArrowRight size={16} />
          </button>
        ) : (
          <button onClick={submit} disabled={submitting} className="btn-gold">
            {submitting ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}
            {submitting ? t('common.sending') : t('booking.submit')}
          </button>
        )}
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-navy-400">
        <Users size={13} /> {t('booking.noChargeNote')}
      </p>
    </div>
  );
}
