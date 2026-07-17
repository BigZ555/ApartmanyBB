"use client";

import { useState } from "react";
import type { ApartmentFull, Settings } from "@/types/database";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ApartmentEditor from "@/components/admin/ApartmentEditor";
import RoomsEditor from "@/components/admin/RoomsEditor";
import ImagesEditor from "@/components/admin/ImagesEditor";
import PricesEditor from "@/components/admin/PricesEditor";
import SettingsEditor from "@/components/admin/SettingsEditor";
import {
  Building,
  DoorOpen,
  Image as ImageIcon,
  DollarSign,
  Settings as SettingsIcon,
} from "lucide-react";

type Tab = "apartment" | "rooms" | "images" | "prices" | "settings";

interface AdminDashboardProps {
  apartment: ApartmentFull | null;
  settings: Settings | null;
}

export default function AdminDashboard({ apartment, settings }: AdminDashboardProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("apartment");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "apartment", label: t.admin.apartment, icon: <Building className="w-4 h-4" /> },
    { id: "rooms", label: t.admin.rooms, icon: <DoorOpen className="w-4 h-4" /> },
    { id: "images", label: t.admin.images, icon: <ImageIcon className="w-4 h-4" /> },
    { id: "prices", label: t.admin.prices, icon: <DollarSign className="w-4 h-4" /> },
    { id: "settings", label: t.admin.settings, icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="section-padding">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-8">
        {t.admin.dashboard}
      </h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card p-6">
        {activeTab === "apartment" && <ApartmentEditor apartment={apartment} />}
        {activeTab === "rooms" && (
          <RoomsEditor apartmentId={apartment?.id} rooms={apartment?.rooms || []} />
        )}
        {activeTab === "images" && (
          <ImagesEditor
            apartmentId={apartment?.id}
            images={apartment?.images || []}
            rooms={apartment?.rooms || []}
          />
        )}
        {activeTab === "prices" && (
          <PricesEditor rooms={apartment?.rooms || []} />
        )}
        {activeTab === "settings" && <SettingsEditor settings={settings} />}
      </div>
    </div>
  );
}
