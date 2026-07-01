"use client";

import { ShieldCheck, HeartHandshake, CreditCard, Clock } from "lucide-react";
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
      title: "100% Certified Professionals",
      desc: "All technicians pass strict 3-tier background verification, skill assessment trials, and behavioral training before joining our luxury circle.",
      icon: <ShieldCheck className="w-6 h-6 text-accent-lux" />,
      badge: "Vetted & Safe"
    },
    {
      title: "Completely Transparent Flat-Rates",
      desc: "Zero hidden charges or diagnostic surprises. Receive fully transparent material estimates in-app for your digital approval before work begins.",
      icon: <CreditCard className="w-6 h-6 text-accent-lux" />,
      badge: "No Surprises"
    },
    {
      title: "Ultimate Damage Cover Protection",
      desc: "Rest easy with our zero-liability service agreement. Every booking is covered under our premier ₹10,000 warranty protection policy.",
      icon: <HeartHandshake className="w-6 h-6 text-accent-lux" />,
      badge: "$10k Coverage"
    },
    {
      title: "24/7 Dedicated Concierge Care",
      desc: "Need rescheduling or have post-service queries? Our support line connects you instantly to dedicated managers for smooth resolutions.",
      icon: <Clock className="w-6 h-6 text-accent-lux" />,
      badge: "Instant Support"
    }
  ];

  return (
    <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/40 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left text column */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest mb-4 block">
            Guarantee of Trust
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary-lux dark:text-white leading-tight">
            Why Selected Clients <br className="hidden lg:inline" /> Choose HelpMate
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-6 text-sm leading-relaxed max-w-md">
            We are committed to delivering the ultimate home service standards. From background checks to post-service cleaning, every detail is refined for comfort.
          </p>
          <div className="mt-8 hidden lg:block">
            <div className="w-24 h-1 rounded-full bg-gradient-to-r from-accent-lux to-secondary-lux" />
          </div>
        </div>

        {/* Right timeline column */}
        <div className="lg:col-span-7 space-y-8 relative pl-4 sm:pl-8">
          {/* Vertical indicator line */}
          <div className="absolute left-4 sm:left-8 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative pl-8 sm:pl-12 group"
            >
              {/* Timeline circle */}
              <div className="absolute left-[-6px] sm:left-[10px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-accent-lux flex items-center justify-center group-hover:bg-accent-lux transition-colors duration-300 shadow-sm z-10">
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
