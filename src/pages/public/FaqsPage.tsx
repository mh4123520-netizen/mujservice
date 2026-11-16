import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FadeUp } from '../../components/MotionReveal.tsx';
import type { FaqItem } from '../../types/index.ts';
import type { PublicPageProps } from './HomePage.tsx';

export function FaqsPage({ data, onOpenBooking }: PublicPageProps) {
  const [openId, setOpenId] = useState<number | null>(data.faqs[0]?.id ?? null);
  const categories = ['All', ...Array.from(new Set(data.faqs.map((f) => f.category)))];
  const [selectedCat, setSelectedCat] = useState('All');

  const items: FaqItem[] =
    selectedCat === 'All' ? data.faqs : data.faqs.filter((f) => f.category === selectedCat);

  return (
    <div className="px-3 sm:px-6 py-8 space-y-10 bg-[#fbfbfd]">
      <FadeUp>
        <section className="max-w-4xl mx-auto bg-black text-white rounded-[32px] p-8 sm:p-12">
          <div className="text-xs font-medium text-sky-400 mb-2">Support &amp; Technical Answers</div>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-white/70 mt-3 leading-relaxed">
            Clear answers on AC installation standards, gas charging, commercial refrigeration, and warranties across Khanewal &amp; Multan.
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      </FadeUp>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-3">
          {items.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="bg-[#f5f5f7] rounded-[24px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-black/[0.02] transition-colors"
                >
                  <div>
                    <div className="text-xs font-medium text-[#0071e3] mb-0.5">{faq.category}</div>
                    <div className="text-base font-semibold text-[#1d1d1f]">{faq.question}</div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#6e6e73] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-2 text-sm text-[#424245] leading-relaxed border-t border-black/[0.06]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <FadeUp>
          <div className="p-7 sm:p-8 bg-[#f5f5f7] rounded-[28px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-[#1d1d1f]">Still need technical advice?</h2>
              <p className="text-xs text-[#6e6e73] mt-1">
                Call {data.settings.phone} or book an on-site diagnostic visit.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenBooking()}
              className="px-6 py-2.5 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Book Technician Visit
            </button>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
