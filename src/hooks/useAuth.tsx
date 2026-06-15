import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Firebase-ийн алдааны кодыг ойлгомжтой Монгол мессеж рүү буулгана.
function authErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'И-мэйл эсвэл нууц үг буруу байна.';
    case 'auth/invalid-email':
      return 'И-мэйл хаяг буруу форматтай байна.';
    case 'auth/user-disabled':
      return 'Энэ хэрэглэгчийн эрх идэвхгүй болсон байна.';
    case 'auth/too-many-requests':
      return 'Хэт олон удаа буруу оролдлоо. Түр хүлээгээд дахин оролдоно уу.';
    case 'auth/network-request-failed':
      return 'Сүлжээний алдаа. Интернэт холболтоо шалгана уу.';
    case 'auth/unauthorized-domain':
      return 'Энэ домэйн Firebase-д зөвшөөрөгдөөгүй байна (Authentication → Settings → Authorized domains).';
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      return 'Firebase тохиргоо дутуу/буруу байна (API key). GitHub Secrets-ээ шалгана уу.';
    default:
      return code
        ? `Нэвтрэхэд алдаа гарлаа (${code}).`
        : 'Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (e) {
      const code = (e as { code?: string })?.code ?? '';
      return { error: authErrorMessage(code) };
    }
  }

  async function signOut() {
    await fbSignOut(auth);
  }

  // Бүртгэл (sign-up) хаалттай тул нэвтэрсэн хэрэглэгч бүр админ.
  // Хэрэглэгчдийг зөвхөн Firebase Console → Authentication → Users дээр үүсгэнэ.
  return (
    <AuthContext.Provider value={{ user, isAdmin: !!user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
