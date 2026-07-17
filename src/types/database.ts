export type Locale = "sk" | "hu";

export interface Apartment {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  google_maps: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface Room {
  id: string;
  apartment_id: string;
  name_sk?: string;
  name_hu?: string;
  description_sk?: string;
  description_hu?: string;
  capacity: number;
  // name and description can be removed later
}

export interface Image {
  id: string;
  apartment_id: string | null;
  room_id: string | null;
  url: string;
  category: "city" | "apartment" | "room" | "shared";
}

export interface Price {
  id: string;
  room_id: string;
  price: string;
  currency: string;
  season: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export interface Settings {
  id: string;
  contact_email: string;
  phone: string;
  map_url: string;
  company_name: string;
}

export interface RoomWithPrices extends Room {
  prices: Price[];
  images: Image[];
}

export interface ApartmentFull extends Apartment {
  rooms: RoomWithPrices[];
  images: Image[];
}
