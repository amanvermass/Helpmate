"use client";

import { ShieldCheck, HeartHandshake, CreditCard, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
  badge: string;
}

export default function WhyChooseUs() {
  const steps: TimelineItem[] = [
    {
      title: "Varanasi's First ₹1,000 Late Refund",
      desc: "We value your time. If our specialist is more than 10 minutes late, receive a ₹1,000 cash discount or refund on your service invoice instantly.",
      icon: <Clock className="w-6 h-6 text-accent-lux" />,
      badge: "On-Time Vow"
    },
    {
      title: "Strict 3-Tier Background Checks",
      desc: "Every Pro undergoes rigorous verification: Aadhaar matching, local police database check, and address verification. Only the top 5% of applicants are hired.",
      icon: <ShieldCheck className="w-6 h-6 text-accent-lux" />,
      badge: "3-Tier Vetting"
    },
    {
      title: "Completely Contract-Free Booking",
      desc: "No long-term contracts or hidden sign-up fees. Schedule hourly chores or deep cleans as needed, or modify your subscription in 1 tap.",
      icon: <CreditCard className="w-6 h-6 text-accent-lux" />,
      badge: "No Lock-ins"
    },
    {
      title: "Zero-Liability Damage Protection",
      desc: "Rest easy with our zero-liability service agreement. Every booking is covered under our premier ₹10,000 warranty protection policy.",
      icon: <HeartHandshake className="w-6 h-6 text-accent-lux" />,
      badge: "₹10k Protection"
    },
    {
      title: "100% Satisfaction Re-run Vow",
      desc: "Not fully satisfied with our service quality? Contact us within 24 hours, and we will dispatch a specialist to redo the job free of cost, no questions asked.",
      icon: <Sparkles className="w-6 h-6 text-accent-lux" />,
      badge: "Satisfaction Vow"
    }
  ];

  return (
    <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/40 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left text column - Sticky */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left lg:sticky lg:top-28 self-start">
          <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest mb-4 block">
            Step 4: Safety & Quality
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary-lux dark:text-white leading-tight">
            Our 5 Reliability <br className="hidden lg:inline" /> Service Guarantees
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-6 text-sm leading-relaxed max-w-md">
            Varanasi's first service built entirely on trust and punctuality. If we fail our vows, you are compensated automatically.
          </p>
          <div className="mt-8 hidden lg:block">
            <div className="w-24 h-1 rounded-full bg-gradient-to-r from-accent-lux to-secondary-lux" />
          </div>
        </div>

        {/* Right timeline column */}
        <div className="lg:col-span-7 space-y-8 relative">
          {/* Vertical indicator line */}
          <div className="absolute left-[20px] sm:left-[32px] top-[96px] sm:top-[76px] bottom-[76px] sm:bottom-[56px] w-0.5 bg-slate-200 dark:bg-slate-800" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative pl-10 sm:pl-16 group"
            >
              {/* Timeline circle */}
              <div className="absolute left-[8px] sm:left-[20px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-accent-lux flex items-center justify-center group-hover:bg-accent-lux transition-colors duration-300 shadow-sm z-10">
                <div className="w-2 h-2 rounded-full bg-accent-lux group-hover:bg-white transition-colors" />
              </div>

              {/* Box */}
              <div className="glass-panel p-6 hover:shadow-xl transition-all duration-300 relative border border-slate-200/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-accent-lux bg-accent-lux/5 px-2.5 py-1 rounded-md self-start">
                    {step.badge}
                  </span>
                  <div className="text-slate-400 dark:text-slate-600 self-start sm:self-auto">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
