export type DestinationType = 'domestic' | 'international';
export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'cancelled';
export type TripType = 'one_way' | 'round_trip';

export interface Destination {
  id: string;
  name: string;
  country: string;
  type: DestinationType;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface Hotel {
  id: string;
  destination_id: string | null;
  name: string;
  city: string | null;
  country: string | null;
  rating: number;
  price_from: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
  destinations?: Pick<Destination, 'id' | 'name' | 'country' | 'type'> | null;
}

export interface Tour {
  id: string;
  destination_id: string | null;
  title: string;
  type: DestinationType;
  description: string | null;
  duration: string | null;
  price_from: number;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
  destinations?: Pick<Destination, 'id' | 'name' | 'country' | 'type'> | null;
}

export interface Booking {
  id: string;
  destination_id: string | null;
  hotel_id: string | null;
  tour_id: string | null;
  customer_name: string;
  phone: string;
  email: string | null;
  travel_date: string | null;
  travelers_count: number;
  special_request: string | null;
  status: BookingStatus;
  created_at: string;
  destinations?: Pick<Destination, 'id' | 'name' | 'country'> | null;
  hotels?: Pick<Hotel, 'id' | 'name'> | null;
  tours?: Pick<Tour, 'id' | 'title'> | null;
}

export interface FlightRequest {
  id: string;
  departure_city: string;
  arrival_city: string;
  departure_date: string | null;
  return_date: string | null;
  trip_type: TripType;
  passengers_count: number;
  customer_name: string;
  phone: string;
  email: string | null;
  note: string | null;
  status: BookingStatus;
  created_at: string;
}

export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

export interface BookingInsert {
  destination_id?: string | null;
  hotel_id?: string | null;
  tour_id?: string | null;
  customer_name: string;
  phone: string;
  email?: string | null;
  travel_date?: string | null;
  travelers_count?: number;
  special_request?: string | null;
}

export interface FlightRequestInsert {
  departure_city: string;
  arrival_city: string;
  departure_date?: string | null;
  return_date?: string | null;
  trip_type: TripType;
  passengers_count?: number;
  customer_name: string;
  phone: string;
  email?: string | null;
  note?: string | null;
}
