import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../lib/i18n';

const faqs = [
  {
    q: {
      mn: 'Захиалга өгсний дараа юу болох вэ?',
      en: 'What happens after I send a booking request?'
    },
    a: {
      mn: 'Таны хүсэлт манай системд бүртгэгдэж, зөвлөх ажлын цагаар 1-2 цагийн дотор таны утас руу залгаж, аяллын дэлгэрэнгүй мэдээлэл, үнийн саналыг танилцуулна.',
      en: 'Your request is registered in our system and a consultant will call you within 1–2 hours during business hours with full trip details and a price quote.'
    }
  },
  {
    q: { mn: 'Төлбөрөө хэрхэн төлөх вэ?', en: 'How do I pay?' },
    a: {
      mn: 'Вэбсайтаар захиалга өгөхөд урьдчилгаа төлбөр шаардлагагүй. Зөвлөхтэй ярилцаж захиалгаа баталгаажуулсны дараа дансаар эсвэл оффис дээр төлбөрөө төлөх боломжтой.',
      en: 'No prepayment is required when booking on the website. After confirming with a consultant, you can pay by bank transfer or at our office.'
    }
  },
  {
    q: { mn: 'Гадаад аялалд виз хэрэгтэй юу?', en: 'Do I need a visa for international trips?' },
    a: {
      mn: 'Улс бүрийн визийн нөхцөл өөр. Солонгос, Япон зэрэг улсад виз шаардлагатай бол манай зөвлөхүүд визийн материал бүрдүүлэхэд тань туслана.',
      en: 'Visa requirements vary by country. Where a visa is needed (e.g., Korea or Japan), our consultants will help you prepare the documents.'
    }
  },
  {
    q: { mn: 'Захиалгаа цуцалж болох уу?', en: 'Can I cancel my booking?' },
    a: {
      mn: 'Болно. Баталгаажуулахаас өмнө ямар ч төлбөргүйгээр цуцлах боломжтой. Баталгаажсаны дараах цуцлалтын нөхцөлийг зөвлөх тань танилцуулна.',
      en: 'Yes. Before confirmation you can cancel free of charge. Your consultant will explain the cancellation terms that apply after confirmation.'
    }
  },
  {
    q: { mn: 'Нислэгийн тийзийг шууд худалдаж авч болох уу?', en: 'Can I buy flight tickets directly?' },
    a: {
      mn: 'Одоогоор манай систем нислэгийн хүсэлт хүлээн авч, зөвлөх тантай холбогдож тийзийг баталгаажуулдаг. Ингэснээр танд хамгийн тохиромжтой үнэ, цагийн сонголтыг олж өгдөг.',
      en: 'Currently we take flight requests and a consultant confirms the ticket with you — this lets us find the best price and schedule for you.'
    }
  },
  {
    q: { mn: 'Хэдэн хүнтэй бүлгээр аялж болох вэ?', en: 'How large can a group be?' },
    a: {
      mn: 'Ганцаараа ч, 50 хүртэлх хүнтэй бүлгээр ч аялах боломжтой. Бүлгийн аялалд тусгай хөнгөлөлт үйлчилнэ — захиалгын тусгай хүсэлт хэсэгт бичээрэй.',
      en: 'You can travel solo or in groups of up to 50. Group discounts apply — mention it in the special request field.'
    }
  },
  {
    q: { mn: 'Дотоод аялалд юу багтдаг вэ?', en: 'What is included in domestic tours?' },
    a: {
      mn: 'Ихэнх дотоод аялалд унаа, хөтөч, байр, заасан хоол багтана. Аялал бүрийн тайлбарт багтсан үйлчилгээг дэлгэрэнгүй бичсэн байгаа.',
      en: 'Most domestic tours include transport, a guide, accommodation, and listed meals. Each tour description details what is included.'
    }
  }
];

export default function FAQ() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="container-x max-w-3xl py-14">
      <h1 className="section-title text-center">{t('faq.title')}</h1>
      <p className="mt-3 text-center text-navy-500">
        {t('faq.sub1')}
        <Link to="/contact" className="font-semibold text-sky-500 hover:underline">{t('faq.sub2')}</Link>.
      </p>

      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="card"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-display font-bold text-navy-900">{f.q[lang]}</span>
              <motion.span animate={{ rotate: open === i ? 180 : 0 }} className="shrink-0 text-navy-400">
                <ChevronDown size={20} />
              </motion.span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="border-t border-navy-50 p-5 leading-relaxed text-navy-600">{f.a[lang]}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
