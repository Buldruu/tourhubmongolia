import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  AdminNotification,
  Booking,
  BookingInsert,
  BookingStatus,
  Destination,
  FlightRequest,
  FlightRequestInsert,
  Hotel,
  Tour
} from '../types';

export interface Result<T> {
  data: T | null;
  error: { message: string } | null;
}

function ok<T>(data: T): Result<T> {
  return { data, error: null };
}

// Firestore-ийн алдааны кодыг ойлгомжтой Монгол мессеж рүү буулгана.
function firestoreErrorMessage(e: unknown): string {
  const code = (e as { code?: string })?.code ?? '';
  switch (code) {
    case 'permission-denied':
      return 'Унших/бичих эрх алга. Firestore Rules нийтлэгдсэн эсэхийг шалгана уу (Firestore Database → Rules → Publish).';
    case 'unauthenticated':
      return 'Нэвтрэлт дууссан байна. Дахин нэвтэрнэ үү.';
    case 'unavailable':
      return 'Firestore-той холбогдож чадсангүй. Сүлжээгээ шалгаад дахин оролдоно уу.';
    case 'failed-precondition':
      return 'Firestore индекс дутуу байж магадгүй (failed-precondition).';
    default:
      return e instanceof Error ? e.message : 'Алдаа гарлаа';
  }
}

function fail<T>(e: unknown): Result<T> {
  return { data: null, error: { message: firestoreErrorMessage(e) } };
}

function withId<T>(snap: { id: string; data: () => unknown }): T {
  return { id: snap.id, ...(snap.data() as Record<string, unknown>) } as T;
}

async function fetchAll<T>(coll: string): Promise<T[]> {
  const snap = await getDocs(collection(db, coll));
  return snap.docs.map((d) => withId<T>(d));
}

function byCreatedDesc<T extends { created_at: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''));
}

// ---------- destinations ----------

export async function getDestinations(): Promise<Result<Destination[]>> {
  try {
    const list = await fetchAll<Destination>('destinations');
    list.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
    return ok(list);
  } catch (e) {
    return fail(e);
  }
}

export async function getFeaturedDestinations(limitCount = 6): Promise<Result<Destination[]>> {
  try {
    const list = await fetchAll<Destination>('destinations');
    return ok(list.filter((d) => d.is_featured).slice(0, limitCount));
  } catch (e) {
    return fail(e);
  }
}

export async function getDestination(id: string): Promise<Result<Destination>> {
  try {
    const snap = await getDoc(doc(db, 'destinations', id));
    if (!snap.exists()) return { data: null, error: { message: 'Чиглэл олдсонгүй' } };
    return ok(withId<Destination>(snap));
  } catch (e) {
    return fail(e);
  }
}

export async function saveDestination(
  payload: Omit<Destination, 'id' | 'created_at'>,
  id?: string
): Promise<Result<true>> {
  try {
    if (id) await updateDoc(doc(db, 'destinations', id), payload as Record<string, unknown>);
    else
      await addDoc(collection(db, 'destinations'), {
        ...payload,
        created_at: new Date().toISOString()
      });
    return ok(true as const);
  } catch (e) {
    return fail(e);
  }
}

export async function deleteDestination(id: string): Promise<Result<true>> {
  try {
    // cascade: delete connected hotels & tours
    const batch = writeBatch(db);
    for (const coll of ['hotels', 'tours']) {
      const snap = await getDocs(query(collection(db, coll), where('destination_id', '==', id)));
      snap.docs.forEach((d) => batch.delete(d.ref));
    }
    batch.delete(doc(db, 'destinations', id));
    await batch.commit();
    return ok(true as const);
  } catch (e) {
    return fail(e);
  }
}

// ---------- helpers for joins ----------

async function destinationMap(): Promise<Map<string, Destination>> {
  const list = await fetchAll<Destination>('destinations');
  return new Map(list.map((d) => [d.id, d]));
}

function attachDestination<T extends { destination_id: string | null }>(
  item: T,
  map: Map<string, Destination>
): T & { destinations: Pick<Destination, 'id' | 'name' | 'country' | 'type'> | null } {
  const d = item.destination_id ? map.get(item.destination_id) : undefined;
  return {
    ...item,
    destinations: d ? { id: d.id, name: d.name, country: d.country, type: d.type } : null
  };
}

// ---------- tours ----------

export async function getTours(): Promise<Result<Tour[]>> {
  try {
    const [list, map] = await Promise.all([fetchAll<Tour>('tours'), destinationMap()]);
    return ok(byCreatedDesc(list).map((t) => attachDestination(t, map)));
  } catch (e) {
    return fail(e);
  }
}

export async function getFeaturedTours(limitCount = 8): Promise<Result<Tour[]>> {
  try {
    const [list, map] = await Promise.all([fetchAll<Tour>('tours'), destinationMap()]);
    return ok(
      byCreatedDesc(list.filter((t) => t.is_featured))
        .slice(0, limitCount)
        .map((t) => attachDestination(t, map))
    );
  } catch (e) {
    return fail(e);
  }
}

export async function getToursByDestination(destinationId: string): Promise<Result<Tour[]>> {
  try {
    const snap = await getDocs(
      query(collection(db, 'tours'), where('destination_id', '==', destinationId))
    );
    const map = await destinationMap();
    return ok(snap.docs.map((d) => attachDestination(withId<Tour>(d), map)));
  } catch (e) {
    return fail(e);
  }
}

export async function saveTour(
  payload: Omit<Tour, 'id' | 'created_at' | 'destinations'>,
  id?: string
): Promise<Result<true>> {
  try {
    if (id) await updateDoc(doc(db, 'tours', id), payload as Record<string, unknown>);
    else
      await addDoc(collection(db, 'tours'), { ...payload, created_at: new Date().toISOString() });
    return ok(true as const);
  } catch (e) {
    return fail(e);
  }
}

export async function deleteTour(id: string): Promise<Result<true>> {
  try {
    await deleteDoc(doc(db, 'tours', id));
    return ok(true as const);
  } catch (e) {
    return fail(e);
  }
}

// ---------- hotels ----------

export async function getHotels(): Promise<Result<Hotel[]>> {
  try {
    const [list, map] = await Promise.all([fetchAll<Hotel>('hotels'), destinationMap()]);
    list.sort((a, b) => b.rating - a.rating);
    return ok(list.map((h) => attachDestination(h, map)));
  } catch (e) {
    return fail(e);
  }
}

export async function getHotelsByDestination(destinationId: string): Promise<Result<Hotel[]>> {
  try {
    const snap = await getDocs(
      query(collection(db, 'hotels'), where('destination_id', '==', destinationId))
    );
    const list = snap.docs.map((d) => withId<Hotel>(d));
    list.sort((a, b) => b.rating - a.rating);
    return ok(list);
  } catch (e) {
    return fail(e);
  }
}

export async function getHotel(id: string): Promise<Result<Hotel>> {
  try {
    const snap = await getDoc(doc(db, 'hotels', id));
    if (!snap.exists()) return { data: null, error: { message: 'Буудал олдсонгүй' } };
    const hotel = withId<Hotel>(snap);
    const map = await destinationMap();
    return ok(attachDestination(hotel, map));
  } catch (e) {
    return fail(e);
  }
}

export async function saveHotel(
  payload: Omit<Hotel, 'id' | 'created_at' | 'destinations'>,
  id?: string
): Promise<Result<true>> {
  try {
    if (id) await updateDoc(doc(db, 'hotels', id), payload as Record<string, unknown>);
    else
      await addDoc(collection(db, 'hotels'), { ...payload, created_at: new Date().toISOString() });
    return ok(true as const);
  } catch (e) {
    return fail(e);
  }
}

export async function deleteHotel(id: string): Promise<Result<true>> {
  try {
    await deleteDoc(doc(db, 'hotels', id));
    return ok(true as const);
  } catch (e) {
    return fail(e);
  }
}

// ---------- bookings ----------

export async function createBooking(payload: BookingInsert): Promise<Result<true>> {
  try {
    await addDoc(collection(db, 'bookings'), {
      destination_id: payload.destination_id ?? null,
      hotel_id: payload.hotel_id ?? null,
      tour_id: payload.tour_id ?? null,
      customer_name: payload.customer_name,
      phone: payload.phone,
      email: payload.email ?? null,
      travel_date: payload.travel_date ?? null,
      travelers_count: payload.travelers_count ?? 1,
      special_request: payload.special_request ?? null,
      status: 'new',
      created_at: new Date().toISOString()
    });
    await addDoc(collection(db, 'admin_notifications'), {
      type: 'booking',
      title: 'Шинэ захиалга',
      message: `${payload.customer_name} — ${payload.phone}`,
      is_read: false,
      created_at: new Date().toISOString()
    });
    return ok(true as const);
  } catch (e) {
    return fail(e);
  }
}

export async function getBookings(): Promise<Result<Booking[]>> {
  try {
    const [list, destMap, hotels, tours] = await Promise.all([
      fetchAll<Booking>('bookings'),
      destinationMap(),
      fetchAll<Hotel>('hotels'),
      fetchAll<Tour>('tours')
    ]);
    const hotelMap = new Map(hotels.map((h) => [h.id, h]));
    const tourMap = new Map(tours.map((t) => [t.id, t]));
    const merged = byCreatedDesc(list).map((b) => {
      const d = b.destination_id ? destMap.get(b.destination_id) : undefined;
      const h = b.hotel_id ? hotelMap.get(b.hotel_id) : undefined;
      const t = b.tour_id ? tourMap.get(b.tour_id) : undefined;
      return {
        ...b,
        destinations: d ? { id: d.id, name: d.name, country: d.country } : null,
        hotels: h ? { id: h.id, name: h.name } : null,
        tours: t ? { id: t.id, title: t.title } : null
      };
    });
    return ok(merged);
  } catch (e) {
    return fail(e);
  }
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Result<true>> {
  try {
    await updateDoc(doc(db, 'bookings', id), { status });
    return ok(true as const);
  } catch (e) {
    return fail(e);
  }
}

// ---------- flight requests ----------

export async function createFlightRequest(payload: FlightRequestInsert): Promise<Result<true>> {
  try {
    await addDoc(collection(db, 'flight_requests'), {
      departure_city: payload.departure_city,
      arrival_city: payload.arrival_city,
      departure_date: payload.departure_date ?? null,
      return_date: payload.return_date ?? null,
      trip_type: payload.trip_type,
      passengers_count: payload.passengers_count ?? 1,
      customer_name: payload.customer_name,
      phone: payload.phone,
      email: payload.email ?? null,
      note: payload.note ?? null,
      status: 'new',
      created_at: new Date().toISOString()
    });
    await addDoc(collection(db, 'admin_notifications'), {
      type: 'flight',
      title: 'Нислэгийн шинэ хүсэлт',
      message: `${payload.customer_name} — ${payload.departure_city} → ${payload.arrival_city}`,
      is_read: false,
      created_at: new Date().toISOString()
    });
    return ok(true as const);
  } catch (e) {
    return fail(e);
  }
}

export async function getFlightRequests(): Promise<Result<FlightRequest[]>> {
  try {
    const list = await fetchAll<FlightRequest>('flight_requests');
    return ok(byCreatedDesc(list));
  } catch (e) {
    return fail(e);
  }
}

export async function updateFlightRequestStatus(
  id: string,
  status: BookingStatus
): Promise<Result<true>> {
  try {
    await updateDoc(doc(db, 'flight_requests', id), { status });
    return ok(true as const);
  } catch (e) {
    return fail(e);
  }
}

// ---------- notifications ----------

export async function getNotifications(limitCount = 15): Promise<Result<AdminNotification[]>> {
  try {
    const list = await fetchAll<AdminNotification>('admin_notifications');
    return ok(byCreatedDesc(list).slice(0, limitCount));
  } catch (e) {
    return fail(e);
  }
}

export async function markAllNotificationsRead(): Promise<Result<true>> {
  try {
    const snap = await getDocs(
      query(collection(db, 'admin_notifications'), where('is_read', '==', false))
    );
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.update(d.ref, { is_read: true }));
    await batch.commit();
    return ok(true as const);
  } catch (e) {
    return fail(e);
  }
}

export async function clearNotifications(): Promise<Result<true>> {
  try {
    const snap = await getDocs(collection(db, 'admin_notifications'));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    return ok(true as const);
  } catch (e) {
    return fail(e);
  }
}
