import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/States';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loading text="Эрх шалгаж байна…" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-navy-50 p-4">
        <div className="card max-w-md p-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-100 text-red-500">
            <ShieldAlert size={30} />
          </span>
          <h1 className="mt-4 font-display text-xl font-bold text-navy-900">Хандах эрх хүрэлцэхгүй</h1>
          <p className="mt-2 text-navy-500">
            Энэ хэсэгт зөвхөн админ эрхтэй хэрэглэгч нэвтэрнэ. profiles хүснэгтэд role='admin' эсэхээ шалгана уу.
          </p>
          <button onClick={signOut} className="btn-outline mt-5">Гарах</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-navy-50/60">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
