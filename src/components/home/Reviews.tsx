"use client";

import { Star, ShieldCheck, Quote } from "lucide-react";
import { reviews } from "@/utils/mockData";
import { motion } from "framer-motion";

export default function Reviews() {
  // Duplicate reviews to create infinite marquee effect
  const marqueeReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/40 overflow-hidden font-sans relative">
      <div className="text-center mb-12">
        <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest">Client Testimonials</span>
        <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white mt-1">
          Reviews from Verified Clients
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
          Hear how our selective clients rate our luxury service professionals.
        </p>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full flex items-center justify-start py-6">
        <div className="animate-marquee flex gap-8">
          {marqueeReviews.map((rev, idx) => (
            <div
              key={rev.id + "-" + idx}
              className="glass-panel w-[320px] sm:w-[380px] p-6 shrink-0 flex flex-col justify-between border border-slate-200/10 hover:shadow-2xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                </div>

                <div className="relative">
                  <Quote className="w-8 h-8 text-accent-lux/10 absolute -top-3 -left-3 rotate-180" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic pl-4 relative z-10">
                    "{rev.comment}"
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1">
                      {rev.name}
                      <ShieldCheck className="w-3.5 h-3.5 text-success-lux" />
                    </h4>
                    <p className="text-[9px] text-slate-400 uppercase mt-0.5 tracking-wider font-semibold">
                      {rev.serviceName}
                    </p>
                  </div>
                </div>

                {rev.image && (
                  <img
                    src={rev.image}
                    alt="Service Result"
                    className="w-12 h-12 rounded-lg object-cover border border-slate-100 dark:border-slate-800"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
