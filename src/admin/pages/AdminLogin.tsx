import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe2, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('И-мэйл болон нууц үгээ оруулна уу.');
      return;
    }
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email.trim(), password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    navigate('/admin/dashboard');
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-navy-950 to-navy-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card p-8 sm:p-10">
          <div className="flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-700 text-gold-400">
              <Globe2 size={22} />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-navy-900">TourHub Mongolia</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Админ нэвтрэх</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label">И-мэйл</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tourhubmongolia.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Нууц үг</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="animate-spin" size={17} /> : <Lock size={16} />}
              {loading ? 'Нэвтэрч байна…' : 'Нэвтрэх'}
            </button>
          </form>

          <Link to="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-navy-400 hover:text-navy-700">
            <ArrowLeft size={14} /> Вэбсайт руу буцах
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
