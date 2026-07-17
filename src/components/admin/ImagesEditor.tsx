"use client";

import { useState } from "react";
import type { Image, RoomWithPrices } from "@/types/database";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import ImagePreview from "next/image";

interface ImagesEditorProps {
  apartmentId?: string;
  images: Image[];
  rooms: RoomWithPrices[];
}

export default function ImagesEditor({
  apartmentId,
  images: initialImages,
  rooms,
}: ImagesEditorProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [form, setForm] = useState({
    url: "",
    category: "city" as Image["category"],
    room_id: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  const categories: Image["category"][] = ["city", "apartment", "room", "shared"];

  const handleAdd = async () => {
    if (!form.url || !apartmentId) return;
    const supabase = createClient();

    const { data } = await supabase
      .from("images")
      .insert({
        url: form.url,
        category: form.category,
        apartment_id: apartmentId,
        room_id: form.category === "room" && form.room_id ? form.room_id : null,
      })
      .select()
      .single();

    if (data) setImages([...images, data]);
    setForm({ url: "", category: "city", room_id: "" });
    setIsAdding(false);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    const supabase = createClient();
    await supabase.from("images").delete().eq("id", id);
    setImages(images.filter((img) => img.id !== id));
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-video relative bg-gray-100">
              <ImagePreview src={img.url} alt="" fill className="object-cover" sizes="300px" />
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase">
                {t.admin.categories[img.category as keyof typeof t.admin.categories] || img.category}
              </span>
              <button
                onClick={() => handleDelete(img.id)}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="label">{t.admin.imageUrl}</label>
            <input
              className="input-field"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
            />
            <p className="text-xs text-gray-500 mt-1">{t.admin.uploadHint}</p>
          </div>
          <div>
            <label className="label">{t.admin.category}</label>
            <select
              className="input-field"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as Image["category"] })
              }
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {t.admin.categories[cat]}
                </option>
              ))}
            </select>
          </div>
          {form.category === "room" && (
            <div>
              <label className="label">{t.admin.room}</label>
              <select
                className="input-field"
                value={form.room_id}
                onChange={(e) => setForm({ ...form, room_id: e.target.value })}
              >
                <option value="">--</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary text-sm">
              <Save className="w-4 h-4" />
              {t.admin.save}
            </button>
            <button onClick={() => setIsAdding(false)} className="btn-secondary text-sm">
              {t.admin.cancel}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="btn-secondary w-full"
          disabled={!apartmentId}
        >
          <Plus className="w-4 h-4" />
          {t.admin.add}
        </button>
      )}
    </div>
  );
}
