"use client";

import type { ApartmentFull } from "@/types/database";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import PhotoGallery from "@/components/PhotoGallery";
import ContactForm from "@/components/ContactForm";
import Image from "next/image";
import { MapPin, Mail, Phone, Users } from "lucide-react";

interface ApartmentsContentProps {
  apartment: ApartmentFull | null;
}

export default function ApartmentsContent({ apartment }: ApartmentsContentProps) {
  const { t } = useLanguage();

  if (!apartment) {
    return (
      <div className="section-padding text-center py-24">
        <p className="text-[var(--color-text-muted)] text-lg">
          {t.apartments.noRooms}
        </p>
      </div>
    );
  }

  const cityImages = apartment.images.filter((img) => img.category === "city");
  const apartmentImages = apartment.images.filter((img) => img.category === "apartment");
  const sharedImages = apartment.images.filter((img) => img.category === "shared");

  const allPrices = apartment.rooms.flatMap((room) =>
    room.prices.map((price) => ({ ...price, roomName: room.name }))
  );

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
                {t.apartments.noPhotos}
              </div>
            )}
          </div>
          <div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {apartment.description || apartment.city}
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
            {apartment.description}
          </p>
          <div className="order-1 md:order-2">
            {apartmentImages.length > 0 ? (
              <PhotoGallery images={apartmentImages} alt={apartment.name} />
            ) : (
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                {t.apartments.noPhotos}
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
            {apartment.rooms.map((room) => (
              <div key={room.id} className="card">
                {room.images.length > 0 ? (
                  <div className="aspect-video relative">
                    <Image
                      src={room.images[0].url}
                      alt={room.name}
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
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {t.apartments.capacity}: {room.capacity} {t.apartments.persons}
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {room.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Shared Space */}
      <section className="section-padding bg-white">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">
          {t.apartments.sharedSpace}
        </h2>
        {sharedImages.length > 0 ? (
          <PhotoGallery images={sharedImages} alt="Shared space" />
        ) : (
          <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 max-w-3xl">
            {t.apartments.noPhotos}
          </div>
        )}
      </section>

      {/* Price List */}
      <section className="section-padding">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">
          {t.apartments.priceList}
        </h2>
        {allPrices.length === 0 ? (
          <p className="text-[var(--color-text-muted)]">{t.apartments.noPrices}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full card">
              <thead>
                <tr className="bg-[var(--color-primary)] text-white">
                  <th className="px-6 py-3 text-left text-sm font-medium">{t.apartments.room}</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">{t.apartments.season}</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">{t.apartments.price}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allPrices.map((price) => (
                  <tr key={price.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{price.roomName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{price.season}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[var(--color-accent)]">
                      {price.price} {price.currency} / {t.apartments.perNight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Map */}
      <section className="section-padding bg-white">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">
          {t.apartments.location}
        </h2>
        {apartment.google_maps ? (
          <div className="aspect-video rounded-xl overflow-hidden shadow-md">
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
          <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            Map not configured
          </div>
        )}
        {apartment.address && (
          <p className="mt-4 flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            {apartment.address}, {apartment.city}
          </p>
        )}
      </section>

      {/* Contact */}
      <section className="section-padding">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">
              {t.apartments.contacts}
            </h2>
            <div className="space-y-4">
              {apartment.email && (
                <p className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                  <a href={`mailto:${apartment.email}`} className="hover:underline">
                    {apartment.email}
                  </a>
                </p>
              )}
              {apartment.phone && (
                <p className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                  <a href={`tel:${apartment.phone}`} className="hover:underline">
                    {apartment.phone}
                  </a>
                </p>
              )}
              {apartment.address && (
                <p className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                  {apartment.address}, {apartment.city}
                </p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">
              {t.apartments.inquiry}
            </h3>
            <p className="text-sm text-gray-600 mb-6">{t.apartments.inquiryDesc}</p>
            <ContactForm email={apartment.email} />
          </div>
        </div>
      </section>
    </div>
  );
}
