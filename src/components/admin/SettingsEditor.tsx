"use client";

import { useState } from "react";
import type { Settings } from "@/types/database";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { Save, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsEditorProps {
  settings: Settings | null;
}

export default function SettingsEditor({ settings }: SettingsEditorProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({
    company_name: settings?.company_name || "B-Servis",
    contact_email: settings?.contact_email || "",
    phone: settings?.phone || "",
    map_url: settings?.map_url || "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSave = async () => {
    setStatus("saving");
    const supabase = createClient();

    if (settings?.id) {
      await supabase.from("settings").update(form).eq("id", settings.id);
    } else {
      await supabase.from("settings").insert(form);
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
          <label className="label">{t.admin.companyName}</label>
          <input
            className="input-field"
            value={form.company_name}
            onChange={(e) => update("company_name", e.target.value)}
          />
        </div>
        <div>
          <label className="label">{t.admin.contactEmail}</label>
          <input
            type="email"
            className="input-field"
            value={form.contact_email}
            onChange={(e) => update("contact_email", e.target.value)}
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
          <label className="label">{t.admin.mapUrl}</label>
          <input
            className="input-field"
            value={form.map_url}
            onChange={(e) => update("map_url", e.target.value)}
          />
        </div>
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
