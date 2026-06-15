import { Link } from 'react-router-dom';
import { CalendarCheck, Plane, Hotel, BellRing, ArrowRight, Users } from 'lucide-react';
import StatsCard from '../StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { Loading, Empty, ErrorState } from '../../components/States';
import { getBookings, getFlightRequests } from '../../lib/api';
import { useQuery } from '../../hooks/useQuery';
import { formatDateTime } from '../../utils/format';
import type { Booking, FlightRequest } from '../../types';

export default function AdminDashboard() {
  const bookings = useQuery<Booking[]>(() => getBookings(), []);
  const flights = useQuery<FlightRequest[]>(() => getFlightRequests(), []);

  if (bookings.loading || flights.loading) return <Loading />;
  if (bookings.error)
    return <ErrorState text={bookings.error} onRetry={bookings.refetch} />;

  const allBookings = bookings.data ?? [];
  const allFlights = flights.data ?? [];
  const newBookings = allBookings.filter((b) => b.status === 'new');
  const hotelRequests = allBookings.filter((b) => b.hotel_id);
  const recent = allBookings.slice(0, 6);
  const recentFlights = allFlights.slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900">Хяналтын самбар</h1>
        <p className="mt-1 text-navy-500">TourHub Mongolia захиалгын тойм</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Нийт захиалга" value={allBookings.length} icon={CalendarCheck} accent="navy" />
        <StatsCard title="Шинэ захиалга" value={newBookings.length} icon={BellRing} accent="sky" />
        <StatsCard title="Нислэгийн хүсэлт" value={allFlights.length} icon={Plane} accent="gold" />
        <StatsCard title="Буудалтай захиалга" value={hotelRequests.length} icon={Hotel} accent="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* recent bookings */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
            <h2 className="font-display font-bold text-navy-900">Сүүлийн захиалгууд</h2>
            <Link to="/admin/bookings" className="flex items-center gap-1 text-sm font-semibold text-sky-500 hover:underline">
              Бүгд <ArrowRight size={14} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="p-5"><Empty text="Захиалга алга байна." /></div>
          ) : (
            <ul className="divide-y divide-navy-50">
              {recent.map((b) => (
                <li key={b.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-100 font-bold text-navy-700">
                    {b.customer_name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-navy-900">{b.customer_name}</p>
                    <p className="truncate text-sm text-navy-500">
                      {b.destinations?.name ?? 'Чиглэлгүй'} · {b.phone} · {formatDateTime(b.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* recent flight requests */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
            <h2 className="font-display font-bold text-navy-900">Нислэгийн хүсэлт</h2>
            <Link to="/admin/flights" className="flex items-center gap-1 text-sm font-semibold text-sky-500 hover:underline">
              Бүгд <ArrowRight size={14} />
            </Link>
          </div>
          {recentFlights.length === 0 ? (
            <div className="p-5"><Empty text="Хүсэлт алга байна." /></div>
          ) : (
            <ul className="divide-y divide-navy-50">
              {recentFlights.map((f) => (
                <li key={f.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-navy-900">
                      {f.departure_city} → {f.arrival_city}
                    </p>
                    <StatusBadge status={f.status} />
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-navy-500">
                    <Users size={13} /> {f.passengers_count} · {f.customer_name} · {f.phone}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
