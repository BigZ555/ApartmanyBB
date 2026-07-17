"use client";

import { useState } from "react";
import type { RoomWithPrices } from "@/types/database";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface RoomsEditorProps {
  apartmentId?: string;
  rooms: RoomWithPrices[];
}

interface RoomFormData {
  name_sk: string;
  name_hu: string;
  description_sk: string;
  description_hu: string;
  capacity: number;
}

export default function RoomsEditor({ apartmentId, rooms: initialRooms }: RoomsEditorProps) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [rooms, setRooms] = useState(initialRooms);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<RoomFormData>({
    name_sk: "",
    name_hu: "",
    description_sk: "",
    description_hu: "",
    capacity: 2,
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = async (roomId?: string) => {
    const supabase = createClient();

    const updateData = {
      name_sk: form.name_sk,
      name_hu: form.name_hu,
      description_sk: form.description_sk,
      description_hu: form.description_hu,
      capacity: form.capacity,
    };

    if (roomId) {
      await supabase
        .from("rooms")
        .update(updateData)
        .eq("id", roomId);
    } else if (apartmentId) {
      await supabase.from("rooms").insert({
        ...updateData,
        apartment_id: apartmentId,
      });
    }

    setEditing(null);
    setIsAdding(false);
    setForm({
      name_sk: "",
      name_hu: "",
      description_sk: "",
      description_hu: "",
      capacity: 2,
    });
    router.refresh();
    window.location.reload();
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm("Delete this room?")) return;
    const supabase = createClient();
    await supabase.from("rooms").delete().eq("id", roomId);
    setRooms(rooms.filter((r) => r.id !== roomId));
    router.refresh();
  };

  const startEdit = (room: RoomWithPrices) => {
    setEditing(room.id);
    setForm({
      name_sk: room.name_sk || "",
      name_hu: room.name_hu || "",
      description_sk: room.description_sk || "",
      description_hu: room.description_hu || "",
      capacity: room.capacity,
    });
    setIsAdding(false);
  };

  const RoomForm = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Názov (Slovak)</label>
          <input
            className="input-field"
            value={form.name_sk}
            onChange={(e) => setForm({ ...form, name_sk: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Név (Hungarian)</label>
          <input
            className="input-field"
            value={form.name_hu}
            onChange={(e) => setForm({ ...form, name_hu: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="label">{t.admin.capacity}</label>
        <input
          type="number"
          min={1}
          className="input-field"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Popis (Slovak)</label>
          <textarea
            className="input-field resize-none"
            rows={3}
            value={form.description_sk}
            onChange={(e) => setForm({ ...form, description_sk: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Leírás (Hungarian)</label>
          <textarea
            className="input-field resize-none"
            rows={3}
            value={form.description_hu}
            onChange={(e) => setForm({ ...form, description_hu: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onSave} className="btn-primary text-sm">
          <Save className="w-4 h-4" />
          {t.admin.save}
        </button>
        <button onClick={onCancel} className="btn-secondary text-sm">
          {t.admin.cancel}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {rooms.map((room) => {
        const roomName = locale === "sk" ? room.name_sk : room.name_hu;
        const roomDesc = locale === "sk" ? room.description_sk : room.description_hu;

        return editing === room.id ? (
          <RoomForm
            key={room.id}
            onSave={() => handleSave(room.id)}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <div
            key={room.id}
            className="flex items-start justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div>
              <h3 className="font-bold text-[var(--color-primary)]">{roomName || "Unnamed Room"}</h3>
              <p className="text-sm text-gray-500">
                {t.admin.capacity}: {room.capacity}
              </p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{roomDesc}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(room)}
                className="p-2 text-gray-500 hover:text-[var(--color-primary)]"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(room.id)}
                className="p-2 text-gray-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}

      {isAdding ? (
        <RoomForm
          onSave={() => handleSave()}
          onCancel={() => {
            setIsAdding(false);
            setForm({
              name_sk: "",
              name_hu: "",
              description_sk: "",
              description_hu: "",
              capacity: 2,
            });
          }}
        />
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