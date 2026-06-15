import { useRef, useState, type ChangeEvent } from 'react';
import { Upload, Loader2, X } from 'lucide-react';

/**
 * Image picker for admin forms.
 * Accepts either a pasted URL or an uploaded file.
 * Uploaded files are resized client-side and stored as a compressed
 * base64 data-URL inside the Firestore document (keeps the free plan,
 * no Cloud Storage needed). Max ~700KB after compression.
 */

async function resizeToDataUrl(file: File, maxSize = 900): Promise<string> {
  const rawUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error('read failed'));
    r.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error('decode failed'));
    i.src = rawUrl;
  });

  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  let quality = 0.75;
  let out = canvas.toDataURL('image/jpeg', quality);
  while (out.length > 700_000 && quality > 0.3) {
    quality -= 0.15;
    out = canvas.toDataURL('image/jpeg', quality);
  }
  return out;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}

export default function ImageField({ value, onChange, label = 'Зураг' }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const url = await resizeToDataUrl(file);
      if (url.length > 900_000) {
        setErr('Зураг хэт том байна. Өөр зураг сонгоно уу.');
      } else {
        onChange(url);
      }
    } catch {
      setErr('Зураг боловсруулахад алдаа гарлаа.');
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <input
          className="input flex-1"
          value={value.startsWith('data:') ? '(оруулсан зураг)' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… эсвэл файл оруулна уу"
          disabled={value.startsWith('data:')}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="btn-outline shrink-0 !px-4 !py-2.5 text-sm"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          Файл
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {err && <p className="mt-1.5 text-xs font-medium text-red-500">{err}</p>}
      {value && (
        <div className="relative mt-2 inline-block">
          <img src={value} alt="" className="h-20 w-32 rounded-lg border border-navy-100 object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white shadow"
            aria-label="Зураг арилгах"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
