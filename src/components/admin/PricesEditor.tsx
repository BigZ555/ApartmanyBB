"use client";

import { useState } from "react";
import type { RoomWithPrices, Price } from "@/types/database";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface PricesEditorProps {
  rooms: RoomWithPrices[];
}

export default function PricesEditor({ rooms }: PricesEditorProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const [prices, setPrices] = useState(
    rooms.flatMap((room) =>
      room.prices.map((p) => ({ 
        ...p, 
        roomName: room.name_sk || room.name_hu || room.name || "Unnamed Room" 
      }))
    )
  );

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    room_id: rooms[0]?.id || "",
    price: "",
    currency: "EUR",
    season: "",
  });

  const handleAdd = async () => {
    if (!form.room_id || !form.price) return;
    const supabase = createClient();

    const { data } = await supabase
      .from("prices")
      .insert({
        room_id: form.room_id,
        price: form.price,
        currency: form.currency,
        season: form.season,
      })
      .select()
      .single();

    if (data) {
      const room = rooms.find((r) => r.id === form.room_id);
      const roomName = room?.name_sk || room?.name_hu || room?.name || "Unnamed Room";
      setPrices([...prices, { ...data, roomName }]);
    }

    setForm({ room_id: rooms[0]?.id || "", price: "", currency: "EUR", season: "" });
    setIsAdding(false);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this price?")) return;
    const supabase = createClient();
    await supabase.from("prices").delete().eq("id", id);
    setPrices(prices.filter((p) => p.id !== id));
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {prices.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  {t.admin.room}
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  {t.admin.season}
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  {t.admin.price}
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  {t.admin.currency}
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prices.map((price) => (
                <tr key={price.id}>
                  <td className="px-4 py-3 text-sm">{price.roomName}</td>
                  <td className="px-4 py-3 text-sm">{price.season}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{price.price}</td>
                  <td className="px-4 py-3 text-sm">{price.currency}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(price.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isAdding ? (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="label">{t.admin.room}</label>
            <select
              className="input-field"
              value={form.room_id}
              onChange={(e) => setForm({ ...form, room_id: e.target.value })}
            >
              {rooms.map((room) => {
                const roomName = room.name_sk || room.name_hu || room.name || "Unnamed Room";
                return (
                  <option key={room.id} value={room.id}>
                    {roomName}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">{t.admin.price}</label>
              <input
                className="input-field"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="label">{t.admin.currency}</label>
              <input
                className="input-field"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </div>
            <div>
              <label className="label">{t.admin.season}</label>
              <input
                className="input-field"
                value={form.season}
                onChange={(e) => setForm({ ...form, season: e.target.value })}
                placeholder="Summer, Winter..."
              />
            </div>
          </div>
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
          disabled={rooms.length === 0}
        >
          <Plus className="w-4 h-4" />
          {t.admin.add}
        </button>
      )}
    </div>
  );
}