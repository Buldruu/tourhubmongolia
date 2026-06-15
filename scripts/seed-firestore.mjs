/**
 * TourHub Mongolia — Firestore seed script
 *
 * Run AFTER creating your Firebase project and BEFORE locking down rules,
 * or while signed in as admin (see README).
 *
 *   npm run seed          (uses .env via node --env-file)
 *
 * Requires VITE_FIREBASE_* variables in .env.
 * If FIREBASE_ADMIN_EMAIL / FIREBASE_ADMIN_PASSWORD are set, the script
 * signs in first (needed when firestore.rules are already applied).
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
});

const db = getFirestore(app);

if (process.env.FIREBASE_ADMIN_EMAIL && process.env.FIREBASE_ADMIN_PASSWORD) {
  await signInWithEmailAndPassword(
    getAuth(app),
    process.env.FIREBASE_ADMIN_EMAIL,
    process.env.FIREBASE_ADMIN_PASSWORD
  );
  console.log('Signed in as admin:', process.env.FIREBASE_ADMIN_EMAIL);
}

const now = () => new Date().toISOString();

const existing = await getDocs(collection(db, 'destinations'));
if (!existing.empty) {
  console.log(`destinations collection already has ${existing.size} docs — aborting to avoid duplicates.`);
  process.exit(0);
}

const destinations = [
  ['Хөвсгөл', 'Монгол', 'domestic', 'Хөвсгөл нуур — "Монголын цэнхэр сувд". Цэвэр тунгалаг ус, тайга, цаатан ард түмний өлгий нутаг.', 'https://images.unsplash.com/photo-1602207072074-bd868f0bd1f0?w=1200&q=80', true],
  ['Говь', 'Монгол', 'domestic', 'Өмнөговь — Хонгорын элс, Ёлын ам, Баянзаг. Дэлхийд алдартай говь нутгийн гайхамшиг.', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80', true],
  ['Тэрэлж', 'Монгол', 'domestic', 'Горхи-Тэрэлжийн байгалийн цогцолборт газар. Мэлхий хад, Арьяабал хийд, гэр буудал.', 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1200&q=80', true],
  ['Архангай', 'Монгол', 'domestic', 'Тэрхийн Цагаан нуур, Хорго галт уул, Тайхар чулуу — байгалийн үзэсгэлэнт нутаг.', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80', false],
  ['Сөүл', 'Солонгос', 'international', 'Солонгос — шопинг, гоо сайхан, эмчилгээ, K-culture аялал. Монголчуудын хамгийн их сонирхдог чиглэл.', 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&q=80', true],
  ['Токио', 'Япон', 'international', 'Япон — сакура, технологи, соёл. Токио, Осака, Киото хотуудаар аялах боломж.', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80', true],
  ['Бангкок', 'Тайланд', 'international', 'Тайланд — далайн эрэг, халуун орны амралт. Бангкок, Паттайя, Пукет.', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80', true],
  ['Истанбул', 'Турк', 'international', 'Турк — Истанбул, Каппадокия, эртний түүх соёлын аялал.', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80', false]
];

const destIds = {};
for (const [name, country, type, description, image_url, is_featured] of destinations) {
  const ref = await addDoc(collection(db, 'destinations'), {
    name, country, type, description, image_url, is_featured, created_at: now()
  });
  destIds[name] = ref.id;
  console.log('destination:', name);
}

const hotels = [
  ['Хөвсгөл', 'Тойлогт Эко Кемп', 'Хатгал', 'Монгол', 4.5, 180000, 'Нуурын эрэг дээрх тохилог гэр кемп, сауна, завины аялалтай.', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80'],
  ['Хөвсгөл', 'Хөвсгөл Лэйк Ресорт', 'Хатгал', 'Монгол', 4.8, 350000, 'Нуурын хөвөөн дэх тансаг зэрэглэлийн амралтын газар.', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80'],
  ['Говь', 'Гурван Сайхан Лодж', 'Даланзадгад', 'Монгол', 4.4, 220000, 'Говийн зэрэглээт уулсын дунд орших тав тухтай лодж.', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80'],
  ['Говь', 'Гоби Номад Кемп', 'Хонгорын элс', 'Монгол', 4.6, 280000, 'Хонгорын элсний дэргэдэх тансаг гэр кемп.', 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200&q=80'],
  ['Тэрэлж', 'Тэрэлж Хотел & Спа', 'Тэрэлж', 'Монгол', 4.9, 450000, '5 одтой зочид буудал — спа, усан сан, ресторан.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80'],
  ['Тэрэлж', 'Аясын Гэр Кемп', 'Тэрэлж', 'Монгол', 4.2, 120000, 'Гэр бүлийн амралтад тохиромжтой уламжлалт гэр буудал.', 'https://images.unsplash.com/photo-1517823382935-51bfcb0ec6bc?w=1200&q=80'],
  ['Архангай', 'Тэрх Цагаан Ресорт', 'Тариат', 'Монгол', 4.3, 160000, 'Тэрхийн Цагаан нуурын эрэг дэх амралтын газар.', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&q=80'],
  ['Архангай', 'Хорго Эко Лодж', 'Тариат', 'Монгол', 4.1, 140000, 'Хорго галт уулын ойролцоох эко лодж.', 'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=1200&q=80'],
  ['Сөүл', 'Lotte Hotel Seoul', 'Сөүл', 'Солонгос', 4.8, 550000, 'Мёндон дүүрэгт орших 5 одтой зочид буудал.', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80'],
  ['Сөүл', 'Hotel Skypark Myeongdong', 'Сөүл', 'Солонгос', 4.3, 280000, 'Шопинг бүсийн төвд, монгол жуулчдад түгээмэл сонголт.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80'],
  ['Токио', 'Shinjuku Granbell Hotel', 'Токио', 'Япон', 4.5, 480000, 'Шинжүкү дүүргийн төвд орших орчин үеийн буудал.', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80'],
  ['Токио', 'Asakusa View Hotel', 'Токио', 'Япон', 4.4, 380000, 'Асакуса сүмийн дэргэд, уламжлалт японы уур амьсгалтай.', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80'],
  ['Бангкок', 'Centara Grand Bangkok', 'Бангкок', 'Тайланд', 4.7, 320000, 'Хотын төвд орших тансаг зэрэглэлийн буудал, дээвэр дээрх усан сантай.', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80'],
  ['Бангкок', 'Pattaya Sea View Resort', 'Паттайя', 'Тайланд', 4.2, 180000, 'Далайн эргийн амралтын цогцолбор.', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80'],
  ['Истанбул', 'Sultanahmet Palace Hotel', 'Истанбул', 'Турк', 4.6, 350000, 'Хуучин хотын төвд, Хаги София руу алхах зайтай.', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80'],
  ['Истанбул', 'Cappadocia Cave Suites', 'Каппадокия', 'Турк', 4.9, 420000, 'Агуйн өвөрмөц өрөөнүүд, агаарын бөмбөлөгний аялалтай.', 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=1200&q=80']
];

for (const [dest, name, city, country, rating, price_from, description, image_url] of hotels) {
  await addDoc(collection(db, 'hotels'), {
    destination_id: destIds[dest], name, city, country, rating, price_from, description, image_url, created_at: now()
  });
  console.log('hotel:', name);
}

const tours = [
  ['Хөвсгөл', 'Хөвсгөл нуурын аялал', 'domestic', 'Хатгал тосгон, нуурын эргийн аялал, морин аялал, завиар зугаалах 4 өдрийн хөтөлбөр.', '4 өдөр / 3 шөнө', 650000, 'https://images.unsplash.com/photo-1602207072074-bd868f0bd1f0?w=1200&q=80', true],
  ['Говь', 'Говийн гайхамшиг 5 өдөр', 'domestic', 'Ёлын ам, Хонгорын элс, Баянзаг, тэмээн аялал — говийн сонгодог маршрут.', '5 өдөр / 4 шөнө', 850000, 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80', true],
  ['Тэрэлж', 'Тэрэлж амралтын аялал', 'domestic', 'Мэлхий хад, Арьяабал хийд, морин аялал — амралтын өдрийн богино аялал.', '2 өдөр / 1 шөнө', 250000, 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1200&q=80', true],
  ['Архангай', 'Тэрхийн Цагаан нуур аялал', 'domestic', 'Хорго галт уул, Тэрхийн Цагаан нуур, Тайхар чулуу үзэх 3 өдрийн аялал.', '3 өдөр / 2 шөнө', 450000, 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80', false],
  ['Сөүл', 'Солонгос шопинг тур', 'international', 'Сөүл хотын шопинг, гоо сайхан, Нами арал, Эверланд — 5 өдрийн багц аялал.', '5 өдөр / 4 шөнө', 2500000, 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&q=80', true],
  ['Токио', 'Япон сакура аялал', 'international', 'Токио, Фүжи уул, Киото — сакура цэцэглэлтийн үеийн тусгай хөтөлбөр.', '7 өдөр / 6 шөнө', 4500000, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80', true],
  ['Бангкок', 'Тайланд далайн амралт', 'international', 'Бангкок + Паттайя — далайн эрэг, арлын аялал, тайчуудын хоол.', '6 өдөр / 5 шөнө', 2800000, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80', true],
  ['Истанбул', 'Турк түүх соёлын аялал', 'international', 'Истанбул, Каппадокия — агаарын бөмбөлөг, эртний түүхийн өв.', '8 өдөр / 7 шөнө', 5200000, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80', false]
];

for (const [dest, title, type, description, duration, price_from, image_url, is_featured] of tours) {
  await addDoc(collection(db, 'tours'), {
    destination_id: destIds[dest], title, type, description, duration, price_from, image_url, is_featured, created_at: now()
  });
  console.log('tour:', title);
}

console.log('\n✅ Seed done: 8 destinations, 16 hotels, 8 tours.');
process.exit(0);
