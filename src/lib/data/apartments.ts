import type { ApartmentFull } from "@/types/database";
import { createClient } from "@/lib/supabase/server";

export async function getApartmentData(): Promise<ApartmentFull | null> {
  const supabase = await createClient();

  const { data: apartments } = await supabase
    .from("apartments")
    .select("*")
    .limit(1)
    .single();

  if (!apartments) return null;

  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .eq("apartment_id", apartments.id)
    .order("name");

  const { data: images } = await supabase
    .from("images")
    .select("*")
    .eq("apartment_id", apartments.id);

  const { data: prices } = await supabase
    .from("prices")
    .select("*");

  const roomsWithData = (rooms || []).map((room) => ({
    ...room,
    prices: (prices || []).filter((p) => p.room_id === room.id),
    images: (images || []).filter(
      (img) => img.room_id === room.id && img.category === "room"
    ),
  }));

  return {
    ...apartments,
    rooms: roomsWithData,
    images: images || [],
  };
}

export async function getSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*").limit(1).single();
  return data;
}

export async function isAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.role?.trim().toLowerCase() === "admin";
}
