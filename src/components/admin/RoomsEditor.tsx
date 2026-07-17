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

export default function RoomsEditor({ apartmentId, rooms: initialRooms }: RoomsEditorProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [rooms, setRooms] = useState(initialRooms);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", capacity: 2 });
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = async (roomId?: string) => {
    const supabase = createClient();

    if (roomId) {
      await supabase
        .from("rooms")
        .update({
          name: form.name,
          description: form.description,
          capacity: form.capacity,
        })
        .eq("id", roomId);
    } else if (apartmentId) {
      await supabase.from("rooms").insert({
        ...form,
        apartment_id: apartmentId,
      });
    }

    setEditing(null);
    setIsAdding(false);
    setForm({ name: "", description: "", capacity: 2 });
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
      name: room.name,
      description: room.description,
      capacity: room.capacity,
    });
    setIsAdding(false);
  };

  const RoomForm = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="label">{t.admin.name}</label>
        <input
          className="input-field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
      <div>
        <label className="label">{t.admin.description}</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
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
      {rooms.map((room) =>
        editing === room.id ? (
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
              <h3 className="font-bold text-[var(--color-primary)]">{room.name}</h3>
              <p className="text-sm text-gray-500">
                {t.admin.capacity}: {room.capacity}
              </p>
              <p className="text-sm text-gray-600 mt-1">{room.description}</p>
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
        )
      )}

      {isAdding ? (
        <RoomForm
          onSave={() => handleSave()}
          onCancel={() => {
            setIsAdding(false);
            setForm({ name: "", description: "", capacity: 2 });
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
