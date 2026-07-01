"use client";

import { Star, ShieldCheck, Award, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import { professionals } from "@/utils/mockData";

export default function Partners() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto font-sans relative">
      <div className="text-center mb-16">
        <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest">Our Elite Team</span>
        <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white mt-1">
          Top Rated Professionals
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
          Meet our background-verified service professionals operating in your local city zone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {professionals.map((prof, idx) => (
          <motion.div
            key={prof.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="glass-panel overflow-hidden border border-slate-200/10 p-6 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center"
          >
            {/* Avatar & Experience */}
            <div className="relative">
              <img
                src={prof.avatar}
                alt={prof.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800"
              />
              <span className="absolute bottom-0 right-0 bg-accent-lux text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                {prof.experience}
              </span>
            </div>

            {/* Name & Specialty */}
            <h3 className="text-base font-bold text-foreground mt-6 flex items-center gap-1">
              {prof.name}
              <ShieldCheck className="w-4 h-4 text-success-lux" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              {prof.specialty}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 justify-center mt-4">
              {prof.badges.map((badge) => (
                <span
                  key={badge}
                  className="text-[9px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Stats Row */}
            <div className="w-full grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Rating</span>
                <span className="text-xs font-bold text-foreground flex items-center justify-center gap-0.5 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {prof.rating}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Jobs Done</span>
                <span className="text-xs font-bold text-foreground block mt-1">
                  {prof.completedJobs}+
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">SLA Rate</span>
                <span className="text-xs font-bold text-foreground flex items-center justify-center gap-0.5 mt-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-success-lux" /> {prof.completedRate}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
