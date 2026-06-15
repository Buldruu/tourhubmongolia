import { useState } from 'react';
import { Trash2, Database, KeyRound, Globe2, BellOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { isFirebaseConfigured } from '../../lib/firebase';
import { clearNotifications as apiClearNotifications } from '../../lib/api';

export default function AdminSettings() {
  const { user } = useAuth();
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function clearNotifications() {
    if (!confirm('Бүх мэдэгдлийг устгах уу?')) return;
    setClearing(true);
    const { error } = await apiClearNotifications();
    setClearing(false);
    setMessage(error ? 'Алдаа: ' + error.message : 'Бүх мэдэгдэл устгагдлаа.');
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900">Тохиргоо</h1>
        <p className="mt-1 text-navy-500">Систем болон админ бүртгэлийн мэдээлэл</p>
      </div>

      <div className="card divide-y divide-navy-50">
        <div className="flex items-center gap-4 p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
            <KeyRound size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-navy-400">Нэвтэрсэн админ</p>
            <p className="font-bold text-navy-900">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
            <Database size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-navy-400">Firebase холболт</p>
            <p className={`font-bold ${isFirebaseConfigured ? 'text-green-600' : 'text-red-500'}`}>
              {isFirebaseConfigured ? 'Холбогдсон' : 'Тохируулагдаагүй (.env шалгана уу)'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
            <Globe2 size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-navy-400">Вэбсайт</p>
            <p className="font-bold text-navy-900">tourhubmongolia.com</p>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500">
            <BellOff size={20} />
          </span>
          <div className="flex-1">
            <p className="font-bold text-navy-900">Мэдэгдлийн түүх цэвэрлэх</p>
            <p className="text-sm text-navy-500">Бүх админ мэдэгдлийг бүрмөсөн устгана.</p>
          </div>
          <button
            onClick={clearNotifications}
            disabled={clearing}
            className="btn-outline !border-red-200 !px-4 !py-2 text-sm !text-red-500 hover:!bg-red-50"
          >
            <Trash2 size={14} /> Цэвэрлэх
          </button>
        </div>
        {message && <p className="mt-3 text-sm font-semibold text-navy-600">{message}</p>}
      </div>

      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sm leading-relaxed text-navy-700">
        <p className="font-bold">Шинэ админ нэмэх заавар:</p>
        <p className="mt-1">
          Firebase Console → <b>Authentication → Users → Add user</b> дээр и-мэйл, нууц үгтэй хэрэглэгч
          үүсгэхэд л хангалттай — нэвтэрсэн хэрэглэгч бүр админ эрхтэй. Вэбээс бүртгүүлэх боломжгүй тул{' '}
          <b>Authentication → Settings → User actions</b> дээр sign-up хаалттай эсэхээ шалгаарай.
        </p>
      </div>
    </div>
  );
}
