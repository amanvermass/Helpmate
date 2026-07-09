"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/utils/mockData";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto font-sans relative">
      <div className="text-center mb-16">
        <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest mb-4 block">
          Clear Information
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
          Everything you need to know about our luxury booking guidelines and services.
        </p>
      </div>

      <div className="divide-y divide-slate-200/60 dark:divide-slate-800 border-t border-b border-slate-200/60 dark:border-slate-800">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;

          return (
            <div
              key={idx}
              className="transition-colors"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full flex items-center justify-between py-5 text-left focus:outline-none cursor-pointer group"
              >
                <span className="text-[13px] sm:text-sm font-bold text-foreground group-hover:text-accent-lux transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-accent-lux transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="pb-5 pt-1 text-slate-500 dark:text-slate-450 text-[12px] sm:text-xs leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* View All FAQs Link */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {}}
          className="inline-flex items-center gap-1 text-[11px] font-black text-accent-lux hover:underline cursor-pointer"
        >
          View all FAQs →
        </button>
      </div>
    </section>
  );
}
