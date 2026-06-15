# TourHub Mongolia 🌍

**tourhubmongolia.com** — Монголчуудад зориулсан аяллын нэгдсэн платформ.

Дотоод болон гадаад аялал, зочид буудал, нислэгийн хүсэлтийг нэг дороос захиалах боломжтой, Firebase-д суурилсан, админ удирдлагатай бүрэн ажиллагаатай MVP вэбсайт.

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS (custom navy / sky / gold theme)
- **Animations:** Framer Motion
- **Routing:** React Router v6 (SPA)
- **Backend:** Firebase (Firestore, Authentication, Security Rules)
- **Deploy:** GitHub Pages эсвэл Vercel

## Features

- Олон хуудастай бүтэц: нүүр, аялал (дотоод/гадаад), чиглэлүүд, чиглэлийн дэлгэрэнгүй, буудлууд, буудлын дэлгэрэнгүй, захиалга, нислэг, тухай, холбоо барих, FAQ
- 5 алхамт захиалгын урсгал: Чиглэл → Буудал → Огноо → Мэдээлэл → Баталгаажуулах
- Чиглэл сонгоход зөвхөн тухайн чиглэлийн буудлууд харагдана
- Нислэгийн тийзний хүсэлтийн систем (бодит тийзний API биш — хүсэлт хүлээн авах MVP)
- Хамгаалагдсан админ самбар: статистик, захиалгын төлөв удирдлага, аялал/чиглэл/буудлын CRUD, нислэгийн хүсэлт, мэдэгдэл, тохиргоо
- Шинэ захиалга бүрт автомат админ мэдэгдэл
- Бүрэн responsive (утас, таблет, компьютер)

## 1. Суулгах

```bash
git clone <repo-url>
cd tourhub-mongolia
npm install
```

## 2. Firebase тохируулах

1. [console.firebase.google.com](https://console.firebase.google.com) дээр шинэ project үүсгэнэ.
2. **Build → Firestore Database → Create database** — эхлээд **Test mode**-оор үүсгэнэ (дараа нь rules-ээ тавина).
3. **Build → Authentication → Get started → Sign-in method** дээр **Email/Password**-ыг идэвхжүүлнэ.
4. **Project Settings (⚙) → General → Your apps → Web app (</> icon)** — апп бүртгээд гарч ирэх config утгуудыг хуулна.

## 3. Орчны хувьсагч (.env)

```bash
cp .env.example .env
```

`.env` файлд Firebase config утгуудаа тавина:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxx
```

## 4. Жишээ өгөгдөл оруулах (seed)

Firestore нь test mode-д байх үед:

```bash
npm run seed
```

→ 8 чиглэл, 16 буудал, 8 аялал автоматаар үүснэ.

## 5. Аюулгүй байдлын rules тавих

Firebase Console → **Firestore Database → Rules** хэсэгт энэ repo-гийн **`firestore.rules`** файлын агуулгыг хуулж **Publish** дарна. Үүний дараа:

- нийтийн хэрэглэгч: каталог унших + захиалга/нислэгийн хүсэлт үүсгэх л боломжтой
- захиалга унших, удирдах, каталог засах — зөвхөн админ

## 6. Админ нэвтрэлт тохируулах

1. Firebase Console → **Authentication → Users → Add user** — и-мэйл, нууц үгтэй хэрэглэгч үүсгэнэ.
2. Үүссэн хэрэглэгчийн **UID**-г хуулна.
3. **Firestore Database → Data** дээр `profiles` collection үүсгэж (эсвэл нээж), **Document ID = тэр UID** байхаар шинэ документ үүсгэнэ. Талбарууд:
   - `email` (string) = админы и-мэйл
   - `role` (string) = `admin`
   - `created_at` (string) = өнөөдрийн огноо
4. Сайтын `/admin/login` хуудсаар нэвтэрнэ.

## 7. Локал ажиллуулах

```bash
npm run dev
```

→ http://localhost:5173

## 8. Deploy хийх

Дэлгэрэнгүй: [`deployment-guide.md`](./deployment-guide.md)

**GitHub Pages:** repo Settings → Pages → Source: GitHub Actions. Settings → Secrets → Actions дээр зургаан `VITE_FIREBASE_*` secret нэмнэ. `vite.config.ts` дээр `base: '/<repo-нэр>/'` тохируулна. `main` руу push хийхэд автоматаар deploy хийнэ.

**Vercel:** repo-гоо import хийгээд Environment Variables хэсэгт мөн зургаан хувьсагчаа нэмээд deploy хийнэ (custom domain-д илүү тохиромжтой).

## Файлын бүтэц

```
src/
  components/   # Navbar, Footer, HeroGlobe, карт компонентууд, BookingStepper…
  pages/        # Нийтийн хуудсууд (Home, Tours, Booking, Flights…)
  admin/        # Админ layout, sidebar, topbar, хуудсууд
  hooks/        # useAuth (Firebase Auth), useQuery
  lib/          # firebase.ts (init), api.ts (бүх Firestore үйлдлүүд)
  types/        # TypeScript интерфэйсүүд
  utils/        # Формат, орчуулгын туслахууд
  styles/       # Tailwind суурь стиль
firestore.rules           # Firestore аюулгүй байдлын дүрэм
scripts/seed-firestore.mjs # Жишээ өгөгдөл оруулагч
.env.example              # Орчны хувьсагчийн загвар
```

## Аюулгүй байдал

- Firebase web config (apiKey г.м.) нь нууц биш — аюулгүй байдлыг **Firestore Rules** хангана.
- Нийтийн хэрэглэгч зөвхөн каталог уншиж, захиалгын хүсэлт үүсгэж чадна.
- `/admin/*` хуудсууд нэвтрээгүй болон админ биш хэрэглэгчээс хамгаалагдсан (auth guard + rules давхар).
- Жинхэнэ нууц утгуудыг `.env`-д хадгална — энэ файл git-д орохгүй.

## Ирээдүйд: бодит нислэгийн API холбох

Одоогийн `/flights` хуудас хүсэлт хүлээн авах систем. Бодит тийзний хайлт нэмэхдээ:

1. **Amadeus Self-Service API** эсвэл **Duffel API** бүртгэл үүсгэж API key авна.
2. API key-г нуухын тулд **Firebase Cloud Functions** (Blaze төлөвлөгөө шаардана) дээр proxy function бичнэ.
3. `FlightRequestForm`-д "Нислэг хайх" товч нэмж function-ийг дуудаж үр дүнг жагсаана.
4. Тийз баталгаажуулалтыг эхний шатанд зөвлөхөөр, дараа нь booking API-аар автоматжуулж болно.

---

© 2026 TourHub Mongolia
