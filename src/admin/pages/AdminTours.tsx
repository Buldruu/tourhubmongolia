import { useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import EntityModal from '../EntityModal';
import ImageField from '../ImageField';
import { Loading, Empty, ErrorState } from '../../components/States';
import {
  deleteDestination as apiDeleteDestination,
  deleteTour as apiDeleteTour,
  getDestinations,
  getTours,
  saveDestination as apiSaveDestination,
  saveTour as apiSaveTour
} from '../../lib/api';
import { useQuery } from '../../hooks/useQuery';
import { formatPrice, TYPE_LABELS } from '../../utils/format';
import type { Destination, Tour } from '../../types';

type Tab = 'tours' | 'destinations';

interface TourForm {
  id?: string;
  destination_id: string;
  title: string;
  type: 'domestic' | 'international';
  description: string;
  duration: string;
  price_from: number;
  image_url: string;
  is_featured: boolean;
}

interface DestForm {
  id?: string;
  name: string;
  country: string;
  type: 'domestic' | 'international';
  description: string;
  image_url: string;
  is_featured: boolean;
}

const emptyTour: TourForm = {
  destination_id: '',
  title: '',
  type: 'domestic',
  description: '',
  duration: '',
  price_from: 0,
  image_url: '',
  is_featured: false
};

const emptyDest: DestForm = {
  name: '',
  country: 'Монгол',
  type: 'domestic',
  description: '',
  image_url: '',
  is_featured: false
};

export default function AdminTours() {
  const [tab, setTab] = useState<Tab>('tours');
  const [tourForm, setTourForm] = useState<TourForm | null>(null);
  const [destForm, setDestForm] = useState<DestForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const tours = useQuery<Tour[]>(() => getTours(), []);
  const destinations = useQuery<Destination[]>(() => getDestinations(), []);

  async function saveTour() {
    if (!tourForm) return;
    if (!tourForm.title.trim() || !tourForm.destination_id) {
      setFormError('Нэр болон чиглэлийг заавал сонгоно уу.');
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = {
      destination_id: tourForm.destination_id,
      title: tourForm.title.trim(),
      type: tourForm.type,
      description: tourForm.description || null,
      duration: tourForm.duration || null,
      price_from: tourForm.price_from,
      image_url: tourForm.image_url || null,
      is_featured: tourForm.is_featured
    };
    const { error } = await apiSaveTour(payload, tourForm.id);
    setSaving(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setTourForm(null);
    tours.refetch();
  }

  async function deleteTour(id: string) {
    if (!confirm('Энэ аяллыг устгах уу?')) return;
    await apiDeleteTour(id);
    tours.refetch();
  }

  async function saveDest() {
    if (!destForm) return;
    if (!destForm.name.trim() || !destForm.country.trim()) {
      setFormError('Нэр болон улсыг заавал бөглөнө үү.');
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = {
      name: destForm.name.trim(),
      country: destForm.country.trim(),
      type: destForm.type,
      description: destForm.description || null,
      image_url: destForm.image_url || null,
      is_featured: destForm.is_featured
    };
    const { error } = await apiSaveDestination(payload, destForm.id);
    setSaving(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setDestForm(null);
    destinations.refetch();
  }

  async function deleteDest(id: string) {
    if (!confirm('Энэ чиглэлийг устгахад холбоотой буудал, аялал нь мөн устана. Үргэлжлүүлэх үү?')) return;
    await apiDeleteDestination(id);
    destinations.refetch();
    tours.refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Аялал ба чиглэл</h1>
          <p className="mt-1 text-navy-500">Аяллын багц болон чиглэлүүдийг удирдах</p>
        </div>
        <button
          onClick={() => {
            setFormError(null);
            if (tab === 'tours') setTourForm({ ...emptyTour });
            else setDestForm({ ...emptyDest });
          }}
          className="btn-primary !px-4 !py-2.5 text-sm"
        >
          <Plus size={16} /> {tab === 'tours' ? 'Аялал нэмэх' : 'Чиглэл нэмэх'}
        </button>
      </div>

      <div className="flex rounded-xl border border-navy-200 bg-white p-1 sm:w-fit">
        {(
          [
            ['tours', 'Аяллууд'],
            ['destinations', 'Чиглэлүүд']
          ] as [Tab, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`flex-1 rounded-lg px-6 py-2 text-sm font-semibold transition sm:flex-none ${
              tab === value ? 'bg-navy-700 text-white' : 'text-navy-600 hover:bg-navy-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'tours' ? (
        tours.loading ? (
          <Loading />
        ) : tours.error ? (
          <ErrorState text={tours.error} onRetry={tours.refetch} />
        ) : (tours.data ?? []).length === 0 ? (
          <Empty text="Аялал бүртгэгдээгүй байна." />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-100 bg-navy-50/60 text-xs uppercase tracking-wide text-navy-500">
                  <th className="px-4 py-3 font-semibold">Аялал</th>
                  <th className="px-4 py-3 font-semibold">Чиглэл</th>
                  <th className="px-4 py-3 font-semibold">Төрөл</th>
                  <th className="px-4 py-3 font-semibold">Хугацаа</th>
                  <th className="px-4 py-3 font-semibold">Үнэ</th>
                  <th className="px-4 py-3 font-semibold">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {(tours.data ?? []).map((t) => (
                  <tr key={t.id} className="border-b border-navy-50 hover:bg-navy-50/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {t.image_url && (
                          <img src={t.image_url} alt="" className="h-10 w-14 rounded-lg object-cover" />
                        )}
                        <span className="font-semibold text-navy-900">
                          {t.title}
                          {t.is_featured && <Star size={12} className="ml-1 inline fill-gold-400 text-gold-400" />}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-navy-600">{t.destinations?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-navy-600">{TYPE_LABELS[t.type]}</td>
                    <td className="px-4 py-3 text-navy-600">{t.duration ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold text-navy-800">{formatPrice(t.price_from)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setFormError(null);
                            setTourForm({
                              id: t.id,
                              destination_id: t.destination_id ?? '',
                              title: t.title,
                              type: t.type,
                              description: t.description ?? '',
                              duration: t.duration ?? '',
                              price_from: t.price_from,
                              image_url: t.image_url ?? '',
                              is_featured: t.is_featured
                            });
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-navy-50 text-navy-600 hover:bg-navy-100"
                          aria-label="Засах"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteTour(t.id)}
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
        )
      ) : destinations.loading ? (
        <Loading />
      ) : (destinations.data ?? []).length === 0 ? (
        <Empty text="Чиглэл бүртгэгдээгүй байна." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(destinations.data ?? []).map((d) => (
            <div key={d.id} className="card">
              <div className="relative h-32">
                <img src={d.image_url ?? ''} alt={d.name} className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-navy-800">
                  {TYPE_LABELS[d.type]}
                </span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-bold text-navy-900">
                    {d.name}
                    {d.is_featured && <Star size={12} className="ml-1 inline fill-gold-400 text-gold-400" />}
                  </p>
                  <p className="text-xs text-navy-400">{d.country}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormError(null);
                      setDestForm({
                        id: d.id,
                        name: d.name,
                        country: d.country,
                        type: d.type,
                        description: d.description ?? '',
                        image_url: d.image_url ?? '',
                        is_featured: d.is_featured
                      });
                    }}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-navy-50 text-navy-600 hover:bg-navy-100"
                    aria-label="Засах"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => deleteDest(d.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                    aria-label="Устгах"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tour modal */}
      <EntityModal
        open={!!tourForm}
        title={tourForm?.id ? 'Аялал засах' : 'Шинэ аялал'}
        onClose={() => setTourForm(null)}
      >
        {tourForm && (
          <div className="space-y-4">
            <div>
              <label className="label">Аяллын нэр *</label>
              <input className="input" value={tourForm.title} onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Чиглэл *</label>
                <select
                  className="input"
                  value={tourForm.destination_id}
                  onChange={(e) => {
                    const d = (destinations.data ?? []).find((x) => x.id === e.target.value);
                    setTourForm({
                      ...tourForm,
                      destination_id: e.target.value,
                      type: d?.type ?? tourForm.type
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
                <label className="label">Хугацаа</label>
                <input className="input" value={tourForm.duration} onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })} placeholder="3 өдөр / 2 шөнө" />
              </div>
              <div>
                <label className="label">Эхлэх үнэ (₮)</label>
                <input type="number" min={0} className="input" value={tourForm.price_from} onChange={(e) => setTourForm({ ...tourForm, price_from: Number(e.target.value) })} />
              </div>
            </div>
            <ImageField value={tourForm.image_url} onChange={(v) => setTourForm({ ...tourForm, image_url: v })} />
            <div>
              <label className="label">Тайлбар</label>
              <textarea className="input min-h-[80px]" value={tourForm.description} onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-navy-700">
              <input type="checkbox" checked={tourForm.is_featured} onChange={(e) => setTourForm({ ...tourForm, is_featured: e.target.checked })} className="h-4 w-4 rounded border-navy-300" />
              Нүүр хуудсанд онцлох
            </label>
            {formError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</p>}
            <button onClick={saveTour} disabled={saving} className="btn-primary w-full">
              {saving ? 'Хадгалж байна…' : 'Хадгалах'}
            </button>
          </div>
        )}
      </EntityModal>

      {/* Destination modal */}
      <EntityModal
        open={!!destForm}
        title={destForm?.id ? 'Чиглэл засах' : 'Шинэ чиглэл'}
        onClose={() => setDestForm(null)}
      >
        {destForm && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Нэр *</label>
                <input className="input" value={destForm.name} onChange={(e) => setDestForm({ ...destForm, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Улс *</label>
                <input className="input" value={destForm.country} onChange={(e) => setDestForm({ ...destForm, country: e.target.value })} />
              </div>
              <div>
                <label className="label">Төрөл</label>
                <select className="input" value={destForm.type} onChange={(e) => setDestForm({ ...destForm, type: e.target.value as 'domestic' | 'international' })}>
                  <option value="domestic">Дотоод</option>
                  <option value="international">Гадаад</option>
                </select>
              </div>
            </div>
            <ImageField value={destForm.image_url} onChange={(v) => setDestForm({ ...destForm, image_url: v })} />
            <div>
              <label className="label">Тайлбар</label>
              <textarea className="input min-h-[80px]" value={destForm.description} onChange={(e) => setDestForm({ ...destForm, description: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-navy-700">
              <input type="checkbox" checked={destForm.is_featured} onChange={(e) => setDestForm({ ...destForm, is_featured: e.target.checked })} className="h-4 w-4 rounded border-navy-300" />
              Нүүр хуудсанд онцлох
            </label>
            {formError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</p>}
            <button onClick={saveDest} disabled={saving} className="btn-primary w-full">
              {saving ? 'Хадгалж байна…' : 'Хадгалах'}
            </button>
          </div>
        )}
      </EntityModal>
    </div>
  );
}
