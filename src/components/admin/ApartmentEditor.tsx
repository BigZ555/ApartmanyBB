"use client";

import { useState } from "react";
import type { ApartmentFull } from "@/types/database";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { Save, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApartmentEditorProps {
  apartment: ApartmentFull | null;
}

export default function ApartmentEditor({ apartment }: ApartmentEditorProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({
    name: apartment?.name || "BB Apartmány",
    city: apartment?.city || "",
    address: apartment?.address || "",
    description: apartment?.description || "",
    google_maps: apartment?.google_maps || "",
    email: apartment?.email || "",
    phone: apartment?.phone || "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSave = async () => {
    setStatus("saving");
    const supabase = createClient();

    if (apartment?.id) {
      await supabase.from("apartments").update(form).eq("id", apartment.id);
    } else {
      await supabase.from("apartments").insert(form);
    }

    setStatus("saved");
    router.refresh();
    setTimeout(() => setStatus("idle"), 2000);
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">{t.admin.name}</label>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <label className="label">{t.admin.city}</label>
          <input
            className="input-field"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </div>
        <div>
          <label className="label">{t.admin.address}</label>
          <input
            className="input-field"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
        </div>
        <div>
          <label className="label">{t.admin.phone}</label>
          <input
            className="input-field"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div>
          <label className="label">{t.admin.contactEmail}</label>
          <input
            type="email"
            className="input-field"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <label className="label">{t.admin.googleMaps}</label>
          <input
            className="input-field"
            value={form.google_maps}
            onChange={(e) => update("google_maps", e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
        </div>
      </div>
      <div>
        <label className="label">{t.admin.description}</label>
        <textarea
          className="input-field resize-none"
          rows={6}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <button onClick={handleSave} disabled={status === "saving"} className="btn-primary">
        {status === "saved" ? (
          <>
            <CheckCircle className="w-4 h-4" />
            {t.admin.saved}
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {status === "saving" ? t.admin.saving : t.admin.save}
          </>
        )}
      </button>
    </div>
  );
}
