import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';

export type Lang = 'mn' | 'en';

type Entry = { mn: string; en: string };

const dict: Record<string, Entry> = {
  // ---- nav ----
  'nav.home': { mn: 'Нүүр', en: 'Home' },
  'nav.tours': { mn: 'Аялал', en: 'Tours' },
  'nav.domesticTours': { mn: 'Дотоод аялал', en: 'Domestic tours' },
  'nav.intlTours': { mn: 'Гадаад аялал', en: 'International tours' },
  'nav.avia': { mn: 'Авиа сервис', en: 'Avia service' },
  'nav.destinations': { mn: 'Чиглэлүүд', en: 'Destinations' },
  'nav.hotels': { mn: 'Зочид буудал', en: 'Hotels' },
  'nav.flights': { mn: 'Нислэг', en: 'Flights' },
  'nav.about': { mn: 'Бидний тухай', en: 'About' },
  'nav.contact': { mn: 'Холбоо барих', en: 'Contact' },
  'nav.book': { mn: 'Захиалга өгөх', en: 'Book now' },

  // ---- common ----
  'common.all': { mn: 'Бүгд', en: 'All' },
  'common.domestic': { mn: 'Дотоод', en: 'Domestic' },
  'common.international': { mn: 'Гадаад', en: 'International' },
  'common.featured': { mn: 'Онцлох', en: 'Featured' },
  'common.priceFrom': { mn: 'Эхлэх үнэ', en: 'From' },
  'common.perNight': { mn: 'Хоног / эхлэх үнэ', en: 'Per night / from' },
  'common.book': { mn: 'Захиалах', en: 'Book' },
  'common.select': { mn: 'Сонгох', en: 'Select' },
  'common.selected': { mn: 'Сонгогдсон ✓', en: 'Selected ✓' },
  'common.details': { mn: 'Дэлгэрэнгүй', en: 'Details' },
  'common.viewAll': { mn: 'Бүгдийг харах', en: 'View all' },
  'common.loading': { mn: 'Уншиж байна…', en: 'Loading…' },
  'common.empty': { mn: 'Одоогоор мэдээлэл алга байна.', en: 'No data available yet.' },
  'common.error': { mn: 'Алдаа гарлаа. Дахин оролдоно уу.', en: 'Something went wrong. Please try again.' },
  'common.retry': { mn: 'Дахин оролдох', en: 'Try again' },
  'common.back': { mn: 'Буцах', en: 'Back' },
  'common.continue': { mn: 'Үргэлжлүүлэх', en: 'Continue' },
  'common.send': { mn: 'Илгээх', en: 'Send' },
  'common.sending': { mn: 'Илгээж байна…', en: 'Sending…' },
  'common.name': { mn: 'Овог нэр', en: 'Full name' },
  'common.phone': { mn: 'Утасны дугаар', en: 'Phone number' },
  'common.email': { mn: 'И-мэйл', en: 'Email' },
  'common.namePlaceholder': { mn: 'Таны нэр', en: 'Your name' },
  'common.requiredFields': { mn: 'Шаардлагатай талбаруудыг бөглөнө үү.', en: 'Please fill in the required fields.' },

  // ---- search ----
  'search.placeholder': { mn: 'Хайх…', en: 'Search…' },
  'search.tours': { mn: 'Аялал, чиглэл хайх…', en: 'Search tours, destinations…' },
  'search.destinations': { mn: 'Чиглэл, улс хайх…', en: 'Search destinations, countries…' },
  'search.hotels': { mn: 'Буудал, хот хайх…', en: 'Search hotels, cities…' },

  // ---- home ----
  'home.badge': { mn: 'tourhubmongolia.com', en: 'tourhubmongolia.com' },
  'home.heroTitle1': { mn: 'Монголчуудад зориулсан', en: 'Mongolia’s all-in-one' },
  'home.heroTitle2': { mn: 'аяллын нэгдсэн платформ', en: 'travel booking platform' },
  'home.heroSub': {
    mn: 'Дотоод болон гадаад аялал, зочид буудал, нислэгийн хүсэлтээ нэг дороос захиалаарай.',
    en: 'Book domestic and international tours, hotels, and flight requests — all in one place.'
  },
  'home.searchTours': { mn: 'Аялал хайх', en: 'Find tours' },
  'home.bookFlight': { mn: 'Нислэг захиалах', en: 'Book a flight' },
  'home.statTravelers': { mn: 'Аялагч', en: 'Travelers' },
  'home.statDestinations': { mn: 'Чиглэл', en: 'Destinations' },
  'home.statRating': { mn: 'Үнэлгээ', en: 'Rating' },
  'home.featuredDomestic': { mn: 'Онцлох дотоод аялал', en: 'Featured domestic tours' },
  'home.featuredDomesticSub': { mn: 'Эх орныхоо үзэсгэлэнт газруудаар аялаарай', en: 'Explore the most beautiful places in Mongolia' },
  'home.featuredIntl': { mn: 'Онцлох гадаад аялал', en: 'Featured international tours' },
  'home.featuredIntlSub': { mn: 'Дэлхийгээр аялах мөрөөдлөө биелүүлээрэй', en: 'Make your dream of traveling the world come true' },
  'home.popularDest': { mn: 'Алдартай чиглэлүүд', en: 'Popular destinations' },
  'home.popularDestSub': { mn: 'Хамгийн их захиалагддаг газрууд', en: 'The most booked places' },
  'home.viewAllDest': { mn: 'Бүх чиглэлийг харах', en: 'View all destinations' },
  'home.whyTitle': { mn: 'Яагаад TourHub Mongolia гэж?', en: 'Why TourHub Mongolia?' },
  'home.trustTitle': { mn: 'Аялагчид бидэнд итгэдэг', en: 'Travelers trust us' },
  'home.ctaTitle': { mn: 'Дараагийн аяллаа өнөөдөр төлөвлөөрэй', en: 'Plan your next trip today' },
  'home.ctaSub': {
    mn: 'Захиалгын хүсэлт илгээхэд хэдхэн минут. Манай зөвлөх тантай холбогдож бүх зүйлийг зохион байгуулна.',
    en: 'Sending a booking request takes just minutes. Our consultant will contact you and arrange everything.'
  },

  // ---- tours / destinations / hotels pages ----
  'tours.title.all': { mn: 'Бүх аялал', en: 'All tours' },
  'tours.title.domestic': { mn: 'Дотоод аялал', en: 'Domestic tours' },
  'tours.title.international': { mn: 'Гадаад аялал', en: 'International tours' },
  'tours.sub': { mn: 'Танд тохирох аяллаа сонгоод захиалгын хүсэлт илгээгээрэй.', en: 'Choose the tour that suits you and send a booking request.' },
  'tours.notFound': { mn: 'Хайлтад тохирох аялал олдсонгүй.', en: 'No tours match your search.' },
  'dest.title': { mn: 'Аяллын чиглэлүүд', en: 'Travel destinations' },
  'dest.sub': { mn: 'Чиглэлээ сонгоход тухайн газрын зочид буудал, аяллын мэдээлэл харагдана.', en: 'Pick a destination to see its hotels and tours.' },
  'dest.notFound': { mn: 'Хайлтад тохирох чиглэл олдсонгүй.', en: 'No destinations match your search.' },
  'dest.relatedHotels': { mn: 'Холбоотой зочид буудлууд', en: 'Connected hotels' },
  'dest.relatedTours': { mn: 'Энэ чиглэлийн аяллууд', en: 'Tours in this destination' },
  'dest.noHotels': { mn: 'Энэ чиглэлд бүртгэлтэй буудал алга байна.', en: 'No hotels registered for this destination yet.' },
  'dest.noTours': { mn: 'Энэ чиглэлд аялал бүртгэгдээгүй байна.', en: 'No tours registered for this destination yet.' },
  'dest.readyTitle': { mn: ' руу аялахад бэлэн үү?', en: ' — ready to go?' },
  'dest.readySub': { mn: 'Захиалгын хүсэлт илгээгээд зөвлөхтэй холбогдоорой.', en: 'Send a booking request and our consultant will reach out.' },
  'dest.startBooking': { mn: 'Захиалга эхлүүлэх', en: 'Start booking' },
  'dest.notFoundDetail': { mn: 'Чиглэлийн мэдээлэл олдсонгүй.', en: 'Destination not found.' },
  'hotels.title': { mn: 'Зочид буудлууд', en: 'Hotels' },
  'hotels.sub': { mn: 'Гэрээт түнш зочид буудал, амралтын газрууд.', en: 'Our partner hotels and resorts.' },
  'hotels.notFound': { mn: 'Хайлтад тохирох буудал олдсонгүй.', en: 'No hotels match your search.' },
  'hotel.intro': { mn: 'Танилцуулга', en: 'Overview' },
  'hotel.relatedDest': { mn: 'Холбоотой чиглэл', en: 'Connected destination' },
  'hotel.bookThis': { mn: 'Энэ буудлыг захиалах', en: 'Book this hotel' },
  'hotel.noCharge': { mn: 'Захиалгын хүсэлт илгээснээр төлбөр шууд төлөгдөхгүй.', en: 'Sending a request does not charge you anything.' },
  'hotel.stars': { mn: 'од', en: 'stars' },
  'hotel.notFoundDetail': { mn: 'Буудлын мэдээлэл олдсонгүй.', en: 'Hotel not found.' },

  // ---- booking ----
  'booking.title': { mn: 'Захиалгын хүсэлт', en: 'Booking request' },
  'booking.flow': { mn: 'Чиглэл → Буудал → Огноо → Мэдээлэл → Баталгаажуулах', en: 'Destination → Hotel → Date → Details → Confirm' },
  'booking.step.dest': { mn: 'Чиглэл', en: 'Destination' },
  'booking.step.hotel': { mn: 'Буудал', en: 'Hotel' },
  'booking.step.date': { mn: 'Огноо', en: 'Date' },
  'booking.step.info': { mn: 'Мэдээлэл', en: 'Details' },
  'booking.step.confirm': { mn: 'Баталгаажуулах', en: 'Confirm' },
  'booking.domesticDest': { mn: 'Дотоод чиглэл', en: 'Domestic destinations' },
  'booking.intlDest': { mn: 'Гадаад чиглэл', en: 'International destinations' },
  'booking.connectedHotels': { mn: '— холбоотой буудлууд', en: '— connected hotels' },
  'booking.hotelOptional': { mn: 'Буудлаа сонгох эсвэл буудалгүйгээр үргэлжлүүлж болно.', en: 'Pick a hotel, or continue without one.' },
  'booking.noHotelsContinue': { mn: 'Энэ чиглэлд бүртгэлтэй буудал алга. Шууд үргэлжлүүлнэ үү.', en: 'No hotels for this destination — just continue.' },
  'booking.pickDate': { mn: 'Аялах огноогоо сонгоно уу', en: 'Pick your travel date' },
  'booking.customerInfo': { mn: 'Захиалагчийн мэдээлэл', en: 'Your details' },
  'booking.travelers': { mn: 'Зорчигчдын тоо', en: 'Number of travelers' },
  'booking.specialRequest': { mn: 'Тусгай хүсэлт', en: 'Special request' },
  'booking.specialPlaceholder': { mn: 'Хоолны дэглэм, хүүхэдтэй аялах гэх мэт…', en: 'Dietary needs, traveling with children, etc…' },
  'booking.review': { mn: 'Захиалгаа шалгана уу', en: 'Review your booking' },
  'booking.destLabel': { mn: 'Чиглэл', en: 'Destination' },
  'booking.hotelLabel': { mn: 'Зочид буудал', en: 'Hotel' },
  'booking.dateLabel': { mn: 'Аялах огноо', en: 'Travel date' },
  'booking.customerLabel': { mn: 'Захиалагч', en: 'Customer' },
  'booking.travelersLabel': { mn: 'Зорчигчид', en: 'Travelers' },
  'booking.notSelected': { mn: 'Сонгоогүй', en: 'Not selected' },
  'booking.people': { mn: 'хүн', en: 'people' },
  'booking.submit': { mn: 'Хүсэлт илгээх', en: 'Submit request' },
  'booking.successTitle': { mn: 'Амжилттай илгээгдлээ!', en: 'Request sent successfully!' },
  'booking.successMsg': {
    mn: 'Таны захиалгын хүсэлт амжилттай илгээгдлээ. Манай зөвлөх удахгүй холбогдох болно.',
    en: 'Your booking request has been sent. Our consultant will contact you shortly.'
  },
  'booking.goHome': { mn: 'Нүүр хуудас', en: 'Home page' },
  'booking.moreTours': { mn: 'Өөр аялал үзэх', en: 'Browse more tours' },
  'booking.noChargeNote': {
    mn: 'Захиалгын хүсэлт илгээснээр төлбөр төлөгдөхгүй — зөвлөх тантай холбогдож баталгаажуулна.',
    en: 'No payment is taken when you send a request — our consultant will confirm with you first.'
  },
  'booking.errDest': { mn: 'Чиглэлээ сонгоно уу.', en: 'Please select a destination.' },
  'booking.errDate': { mn: 'Аялах огноогоо сонгоно уу.', en: 'Please pick a travel date.' },
  'booking.errInfo': { mn: 'Нэр болон утасны дугаараа заавал бөглөнө үү.', en: 'Name and phone number are required.' },
  'booking.errTravelers': { mn: 'Зорчигчдын тоо 1-ээс багагүй байна.', en: 'At least 1 traveler is required.' },
  'booking.errSubmit': { mn: 'Захиалга илгээхэд алдаа гарлаа: ', en: 'Failed to send the booking: ' },

  // ---- flights ----
  'flights.title': { mn: 'Нислэгийн тийзний хүсэлт', en: 'Flight ticket request' },
  'flights.sub': {
    mn: 'Хүсэлтээ илгээснээр манай зөвлөх хамгийн тохиромжтой нислэг, үнийн саналыг тань руу илгээнэ.',
    en: 'Send a request and our consultant will find the best flights and prices for you.'
  },
  'flights.roundTrip': { mn: 'Хоёр талын', en: 'Round trip' },
  'flights.oneWay': { mn: 'Нэг талын', en: 'One way' },
  'flights.from': { mn: 'Хаанаас нисэх', en: 'From' },
  'flights.to': { mn: 'Хаашаа нисэх', en: 'To' },
  'flights.toPlaceholder': { mn: 'Сөүл, Токио, Бангкок…', en: 'Seoul, Tokyo, Bangkok…' },
  'flights.departDate': { mn: 'Ниcэх огноо', en: 'Departure date' },
  'flights.returnDate': { mn: 'Буцах огноо', en: 'Return date' },
  'flights.passengers': { mn: 'Зорчигчдын тоо', en: 'Passengers' },
  'flights.note': { mn: 'Нэмэлт тэмдэглэл', en: 'Additional note' },
  'flights.notePlaceholder': { mn: 'Бизнес ангилал, хүүхэдтэй зорчих гэх мэт…', en: 'Business class, traveling with children, etc…' },
  'flights.submit': { mn: 'Нислэгийн хүсэлт илгээх', en: 'Send flight request' },
  'flights.mvpNote': {
    mn: 'Энэ нь нислэгийн хүсэлтийн систем бөгөөд манай зөвлөх тантай холбогдож үнийн санал өгнө.',
    en: 'This is a flight request system — our consultant will contact you with a quote.'
  },
  'flights.successTitle': { mn: 'Таны нислэгийн хүсэлт амжилттай илгээгдлээ!', en: 'Your flight request has been sent!' },
  'flights.successMsg': {
    mn: 'Манай зөвлөх таны өгсөн утасны дугаараар удахгүй холбогдож, нислэгийн үнэ, сонголтыг танилцуулах болно.',
    en: 'Our consultant will call you shortly with flight options and prices.'
  },
  'flights.newRequest': { mn: 'Шинэ хүсэлт илгээх', en: 'Send a new request' },
  'flights.errReturn': { mn: 'Хоёр талын нислэгт буцах огноог оруулна уу.', en: 'Return date is required for round trips.' },
  'flights.errSubmit': { mn: 'Хүсэлт илгээхэд алдаа гарлаа: ', en: 'Failed to send the request: ' },
  'flights.fastTitle': { mn: 'Хурдан хариу', en: 'Fast response' },
  'flights.fastDesc': { mn: 'Ажлын цагаар 1-2 цагийн дотор зөвлөх тантай холбогдоно.', en: 'A consultant will contact you within 1–2 hours during business hours.' },
  'flights.confirmedTitle': { mn: 'Баталгаатай тийз', en: 'Guaranteed tickets' },
  'flights.confirmedDesc': { mn: 'Албан ёсны агентлагаар дамжуулан тийзийг баталгаажуулна.', en: 'Tickets are confirmed through an official agency.' },
  'flights.adviceTitle': { mn: 'Утсаар зөвлөгөө', en: 'Phone consultation' },
  'flights.adviceDesc': { mn: 'Нислэгийн сонголт, дамжин нислэг, ачааны мэдээллийг монгол хэлээр тайлбарлана.', en: 'We explain flight options, layovers, and baggage rules clearly.' },

  // ---- contact ----
  'contact.title': { mn: 'Холбоо барих', en: 'Contact us' },
  'contact.sub': {
    mn: 'Аяллын талаар асуух зүйл байна уу? Бидэнтэй доорх сувгуудаар холбогдоорой — бид таны асуултад хурдан хариулахдаа таатай байх болно.',
    en: 'Have a question about a trip? Reach us through any of the channels below — we are happy to help.'
  },
  'contact.phone': { mn: 'Утас', en: 'Phone' },
  'contact.address': { mn: 'Хаяг', en: 'Address' },
  'contact.addressValue': {
    mn: 'Улаанбаатар хот, Баянзүрх дүүрэг, 26-р хороо, Paradise Plaza, 1404 тоот',
    en: 'Paradise Plaza, Suite 1404, 26th khoroo, Bayanzurkh district, Ulaanbaatar'
  },
  'contact.hours': { mn: 'Ажлын цаг', en: 'Working hours' },
  'contact.hoursValue': { mn: 'Даваа–Баасан 10:00–18:00', en: 'Mon–Fri 10:00–18:00' },
  'contact.formTitle': { mn: 'Зурвас илгээх', en: 'Send a message' },
  'contact.message': { mn: 'Зурвас', en: 'Message' },
  'contact.messagePlaceholder': { mn: 'Асуулт, хүсэлтээ бичнэ үү…', en: 'Write your question or request…' },
  'contact.err': { mn: 'Нэр, утас, зурвас талбаруудыг бөглөнө үү.', en: 'Please fill in name, phone, and message.' },
  'contact.thanks': { mn: 'Баярлалаа!', en: 'Thank you!' },
  'contact.mailOpened': { mn: 'И-мэйл программ тань нээгдсэн — зурвасаа илгээнэ үү.', en: 'Your email app has opened — please send the message.' },
  'contact.newMessage': { mn: 'Шинэ зурвас бичих', en: 'Write a new message' },

  // ---- about ----
  'about.title': { mn: 'Бидний тухай', en: 'About us' },
  'about.sub': {
    mn: 'TourHub Mongolia — Монголчуудын аяллын бүх хэрэгцээг нэг дороос шийдэх зорилготой аяллын нэгдсэн платформ.',
    en: 'TourHub Mongolia — an all-in-one travel platform built to cover every travel need of Mongolians.'
  },
  'about.whyTitle': { mn: 'Яагаад бид энэ платформыг бүтээсэн бэ?', en: 'Why did we build this platform?' },
  'about.contactUs': { mn: 'Бидэнтэй холбогдох', en: 'Contact us' },
  'about.destCount': { mn: '50+ чиглэл', en: '50+ destinations' },
  'about.destTypes': { mn: 'Дотоод ба гадаад', en: 'Domestic & international' },

  // ---- faq ----
  'faq.title': { mn: 'Түгээмэл асуулт, хариулт', en: 'Frequently asked questions' },
  'faq.sub1': { mn: 'Хэрэв таны асуултын хариулт эндээс олдохгүй бол ', en: 'If you can’t find your answer here, ' },
  'faq.sub2': { mn: 'бидэнтэй холбогдоорой', en: 'contact us' },

  // ---- avia service ----
  'avia.title': { mn: 'Авиа сервис', en: 'Avia service' },
  'avia.message': {
    mn: 'Мэдээлэл авах бол бидэнтэй холбогдоно уу.',
    en: 'For more information, please contact us.'
  },
  'avia.contact': { mn: 'Бидэнтэй холбогдох', en: 'Contact us' },

  // ---- 404 ----
  'nf.message': { mn: 'Уучлаарай, ийм хуудас олдсонгүй.', en: 'Sorry, this page could not be found.' },
  'nf.goHome': { mn: 'Нүүр хуудас руу буцах', en: 'Back to home' },

  // ---- footer ----
  'footer.desc': {
    mn: 'Монголчуудад зориулсан аяллын нэгдсэн платформ. Дотоод болон гадаад аялал, зочид буудал, нислэгийн захиалгыг нэг дороос.',
    en: 'Mongolia’s all-in-one travel platform. Domestic and international tours, hotels, and flight bookings in one place.'
  },
  'footer.tours': { mn: 'Аялал', en: 'Tours' },
  'footer.domestic': { mn: 'Дотоод аялал', en: 'Domestic tours' },
  'footer.international': { mn: 'Гадаад аялал', en: 'International tours' },
  'footer.flightBooking': { mn: 'Нислэгийн захиалга', en: 'Flight booking' },
  'footer.company': { mn: 'Компани', en: 'Company' },
  'footer.faq': { mn: 'Түгээмэл асуулт', en: 'FAQ' },
  'footer.book': { mn: 'Захиалга өгөх', en: 'Book now' },
  'footer.contact': { mn: 'Холбоо барих', en: 'Contact' },
  'footer.rights': { mn: 'Бүх эрх хуулиар хамгаалагдсан.', en: 'All rights reserved.' },
  'footer.admin': { mn: 'Админ', en: 'Admin' }
};

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('tourhub-lang');
    return saved === 'en' ? 'en' : 'mn';
  });

  useEffect(() => {
    localStorage.setItem('tourhub-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  function t(key: string): string {
    return dict[key]?.[lang] ?? key;
  }

  return (
    <I18nContext.Provider value={{ lang, setLang: setLangState, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
