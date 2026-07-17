"use client";

import type { ApartmentFull } from "@/types/database";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import PhotoGallery from "@/components/PhotoGallery";
import Image from "next/image";
import { MapPin, Users } from "lucide-react";

interface ApartmentsContentProps {
  apartment: ApartmentFull | null;
}

export default function ApartmentsContent({ apartment }: ApartmentsContentProps) {
  const { t, locale } = useLanguage();

  if (!apartment) {
    return <div className="section-padding text-center py-24">No data</div>;
  }

  const isHu = locale === 'hu';

  // New multilingual fields
  const aboutCity = isHu 
    ? (apartment.about_city_hu || apartment.about_city_sk) 
    : (apartment.about_city_sk || apartment.about_city_hu);

  const aboutApartments = isHu 
    ? (apartment.about_apartments_hu || apartment.about_apartments_sk) 
    : (apartment.about_apartments_sk || apartment.about_apartments_hu);

  const cityImages = apartment.images.filter((img) => img.category === "city");
  const apartmentImages = apartment.images.filter((img) => img.category === "apartment");


  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white py-16 md:py-24">
        <div className="section-padding !py-0 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{apartment.name}</h1>
          <p className="text-lg opacity-90 flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" />
            {apartment.city}
          </p>
        </div>
      </section>

      {/* About City */}
      <section className="section-padding">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">
          {t.apartments.aboutCity}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            {cityImages.length > 0 ? (
              <PhotoGallery images={cityImages} alt={apartment.city} />
            ) : (
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                No photos
              </div>
            )}
          </div>
          <div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {aboutCity || "No description available."}
            </p>
          </div>
        </div>
      </section>

      {/* About Apartments */}
      <section className="section-padding bg-white">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">
          {t.apartments.aboutApartments}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line order-2 md:order-1">
            {aboutApartments || "No description available."}
          </p>
          <div className="order-1 md:order-2">
            {apartmentImages.length > 0 ? (
              <PhotoGallery images={apartmentImages} alt={apartment.name} />
            ) : (
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                No photos
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Rooms */}
    <section className="section-padding">
      <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-8">
        {t.apartments.rooms}
      </h2>
      {apartment.rooms.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">{t.apartments.noRooms}</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartment.rooms.map((room) => {
            const roomName = locale === "sk" ? room.name_sk : room.name_hu;
            const roomDesc = locale === "sk" ? room.description_sk : room.description_hu;

            return (
              <div key={room.id} className="card overflow-hidden">
                {room.images?.length > 0 ? (
                  <div className="aspect-video relative">
                    <Image
                      src={room.images[0].url}
                      alt={roomName || "Room"}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    {t.apartments.noPhotos}
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">
                    {roomName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {t.apartments.capacity}: {room.capacity} {t.apartments.persons}
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {roomDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
    {/* Map */}
    <section className="section-padding bg-white">
      <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">
        {t.apartments.location}
      </h2>
      
      {apartment.google_maps ? (
        <div className="aspect-video rounded-xl overflow-hidden shadow-md border">
          <iframe
            src={apartment.google_maps}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location map"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border border-dashed">
          No map configured in admin panel
        </div>
      )}

      {apartment.address && (
        <p className="mt-4 flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          {apartment.address}, {apartment.city}
        </p>
      )}
    </section>

      {/* Rooms, Shared Space, Prices, Map, Contact sections remain the same */}
      {/* ... paste the rest of your original file from Rooms section downward ... */}

    </div>
  );
}