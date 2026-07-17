"use client";

import { useState, useEffect } from "react";
import type { Apartment } from "@/types/database";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { Save } from "lucide-react";

interface ApartmentEditorProps {
  apartment: Apartment | null;
}

export default function ApartmentEditor({ apartment }: ApartmentEditorProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
  name: apartment?.name || "BB Apartmány",
  city: apartment?.city || "",
  address: apartment?.address || "",
  description: apartment?.description || "",
  google_maps: apartment?.google_maps || "",
  email: apartment?.email || "",
  phone: apartment?.phone || "",
  // Bilingual fields
  about_city_sk: apartment?.about_city_sk || "",
  about_city_hu: apartment?.about_city_hu || "",
  about_apartments_sk: apartment?.about_apartments_sk || "",
  about_apartments_hu: apartment?.about_apartments_hu || "",
});

  useEffect(() => {
    if (apartment) {
      setData({
        name: apartment.name || "",
        city: apartment.city || "",
        address: apartment.address || "",
        about_city_sk: apartment.about_city_sk || "",
        about_city_hu: apartment.about_city_hu || "",
        about_apartments_sk: apartment.about_apartments_sk || "",
        about_apartments_hu: apartment.about_apartments_hu || "",
        google_maps: apartment.google_maps || "",
        email: apartment.email || "",
        phone: apartment.phone || "",
      });
    }
  }, [apartment]);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    await supabase
      .from("apartments")
      .update({
        name: data.name,
        city: data.city,
        address: data.address,
        about_city_sk: data.about_city_sk,
        about_city_hu: data.about_city_hu,
        about_apartments_sk: data.about_apartments_sk,
        about_apartments_hu: data.about_apartments_hu,
        google_maps: data.google_maps,
        email: data.email,
        phone: data.phone,
      })
      .eq("id", apartment?.id);

    setSaving(false);
    alert("Saved successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Name</label>
          <input className="input-field" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />
        </div>
        <div>
          <label className="label">City</label>
          <input className="input-field" value={data.city} onChange={(e) => setData({...data, city: e.target.value})} />
        </div>
      </div>

      <div>
        <label className="label">Address</label>
        <input className="input-field" value={data.address} onChange={(e) => setData({...data, address: e.target.value})} />
      </div>

      {/* About City */}
      <div className="border-t pt-6">
        <h3 className="font-semibold text-lg mb-4">About City (About City Section)</h3>
        <div className="space-y-4">
          <div>
            <label className="label">About City - Slovak</label>
            <textarea 
              className="input-field resize-none" 
              rows={5}
              value={data.about_city_sk}
              onChange={(e) => setData({...data, about_city_sk: e.target.value})}
            />
          </div>
          <div>
            <label className="label">About City - Hungarian</label>
            <textarea 
              className="input-field resize-none" 
              rows={5}
              value={data.about_city_hu}
              onChange={(e) => setData({...data, about_city_hu: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* About Apartments */}
      <div className="border-t pt-6">
        <h3 className="font-semibold text-lg mb-4">About Apartments (Main Description)</h3>
        <div className="space-y-4">
          <div>
            <label className="label">About Apartments - Slovak</label>
            <textarea 
              className="input-field resize-none" 
              rows={5}
              value={data.about_apartments_sk}
              onChange={(e) => setData({...data, about_apartments_sk: e.target.value})}
            />
          </div>
          <div>
            <label className="label">About Apartments - Hungarian</label>
            <textarea 
              className="input-field resize-none" 
              rows={5}
              value={data.about_apartments_hu}
              onChange={(e) => setData({...data, about_apartments_hu: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Other fields */}
      <div className="border-t pt-6">
        <label className="label">Google Maps Embed URL</label>
        <input className="input-field" value={data.google_maps} onChange={(e) => setData({...data, google_maps: e.target.value})} />
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}