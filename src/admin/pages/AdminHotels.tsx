import { useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import EntityModal from '../EntityModal';
import ImageField from '../ImageField';
import { Loading, Empty, ErrorState } from '../../components/States';
import {
  deleteHotel as apiDeleteHotel,
  getDestinations,
  getHotels,
  saveHotel as apiSaveHotel
} from '../../lib/api';
import { useQuery } from '../../hooks/useQuery';
import { formatPrice } from '../../utils/format';
import type { Destination, Hotel } from '../../types';

interface HotelForm {
  id?: string;
  destination_id: string;
  name: string;
  city: string;
  country: string;
  rating: number;
  price_from: number;
  description: string;
  image_url: string;
}

const empty: HotelForm = {
  destination_id: '',
  name: '',
  city: '',
  country: '',
  rating: 4,
  price_from: 0,
  description: '',
  image_url: ''
};

export default function AdminHotels() {
  const [form, setForm] = useState<HotelForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const hotels = useQuery<Hotel[]>(() => getHotels(), []);
  const destinations = useQuery<Destination[]>(() => getDestinations(), []);

  async function save() {
    if (!form) return;
    if (!form.name.trim() || !form.destination_id) {
      setFormError('Нэр болон чиглэлийг заавал бөглөнө үү.');
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = {
      destination_id: form.destination_id,
      name: form.name.trim(),
      city: form.city || null,
      country: form.country || null,
      rating: form.rating,
      price_from: form.price_from,
      description: form.description || null,
      image_url: form.image_url || null
    };
    const { error } = await apiSaveHotel(payload, form.id);
    setSaving(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setForm(null);
    hotels.refetch();
  }

  async function remove(id: string) {
    if (!confirm('Энэ буудлыг устгах уу?')) return;
    await apiDeleteHotel(id);
    hotels.refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Зочид буудал</h1>
          <p className="mt-1 text-navy-500">Гэрээт буудлуудыг удирдах</p>
        </div>
        <button
          onClick={() => {
            setFormError(null);
            setForm({ ...empty });
          }}
          className="btn-primary !px-4 !py-2.5 text-sm"
        >
          <Plus size={16} /> Буудал нэмэх
        </button>
      </div>

      {hotels.loading ? (
        <Loading />
      ) : hotels.error ? (
        <ErrorState text={hotels.error} onRetry={hotels.refetch} />
      ) : (hotels.data ?? []).length === 0 ? (
        <Empty text="Буудал бүртгэгдээгүй байна." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50/60 text-xs uppercase tracking-wide text-navy-500">
                <th className="px-4 py-3 font-semibold">Буудал</th>
                <th className="px-4 py-3 font-semibold">Хот / Улс</th>
                <th className="px-4 py-3 font-semibold">Чиглэл</th>
                <th className="px-4 py-3 font-semibold">Үнэлгээ</th>
                <th className="px-4 py-3 font-semibold">Эхлэх үнэ</th>
                <th className="px-4 py-3 font-semibold">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {(hotels.data ?? []).map((h) => (
                <tr key={h.id} className="border-b border-navy-50 hover:bg-navy-50/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {h.image_url && <img src={h.image_url} alt="" className="h-10 w-14 rounded-lg object-cover" />}
                      <span className="font-semibold text-navy-900">{h.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-navy-600">
                    {[h.city, h.country].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-navy-600">{h.destinations?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-navy-800">
                      <Star size={13} className="fill-gold-400 text-gold-400" /> {h.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy-800">{formatPrice(h.price_from)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFormError(null);
                          setForm({
                            id: h.id,
                            destination_id: h.destination_id ?? '',
                            name: h.name,
                            city: h.city ?? '',
                            country: h.country ?? '',
                            rating: h.rating,
                            price_from: h.price_from,
                            description: h.description ?? '',
                            image_url: h.image_url ?? ''
                          });
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-navy-50 text-navy-600 hover:bg-navy-100"
                        aria-label="Засах"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => remove(h.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                        aria-label="Устгах"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EntityModal open={!!form} title={form?.id ? 'Буудал засах' : 'Шинэ буудал'} onClose={() => setForm(null)}>
        {form && (
          <div className="space-y-4">
            <div>
              <label className="label">Буудлын нэр *</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Чиглэл *</label>
                <select
                  className="input"
                  value={form.destination_id}
                  onChange={(e) => {
                    const d = (destinations.data ?? []).find((x) => x.id === e.target.value);
                    setForm({
                      ...form,
                      destination_id: e.target.value,
                      country: form.country || (d?.country ?? '')
                    });
                  }}
                >
                  <option value="">— Сонгох —</option>
                  {(destinations.data ?? []).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.country})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Хот</label>
                <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <label className="label">Улс</label>
                <input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <div>
                <label className="label">Үнэлгээ (1–5)</label>
                <input type="number" min={1} max={5} step={0.1} className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
              </div>
              <div>
                <label className="label">Эхлэх үнэ (₮)</label>
                <input type="number" min={0} className="input" value={form.price_from} onChange={(e) => setForm({ ...form, price_from: Number(e.target.value) })} />
              </div>
            </div>
            <ImageField value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
            <div>
              <label className="label">Тайлбар</label>
              <textarea className="input min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            {formError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</p>}
            <button onClick={save} disabled={saving} className="btn-primary w-full">
              {saving ? 'Хадгалж байна…' : 'Хадгалах'}
            </button>
          </div>
        )}
      </EntityModal>
    </div>
  );
}
