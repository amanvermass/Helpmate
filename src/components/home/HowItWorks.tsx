"use client";

import { MousePointerClick, CalendarDays, CheckCircle, CreditCard, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  step: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export default function HowItWorks() {
  const steps: Step[] = [
    {
      step: "01",
      title: "Build Checklist",
      desc: "Select a premium package or checklist your daily chores in our interactive pricing calculator.",
      icon: <MousePointerClick className="w-6 h-6 text-accent-lux" />
    },
    {
      step: "02",
      title: "Pick Your Slot",
      desc: "Choose a date and arrival window. Our automated system matches your task to nearby pros instantly.",
      icon: <CalendarDays className="w-6 h-6 text-accent-lux" />
    },
    {
      step: "03",
      title: "Pro Arrives On-Time",
      desc: "Our background-verified, uniformed partner arrives with specialized gear and non-toxic sanitizers.",
      icon: <UserCheck className="w-6 h-6 text-accent-lux" />
    },
    {
      step: "04",
      title: "Confirm & Pay",
      desc: "Verify service completion in the app and pay via UPI, Card, or Cash. On-time refund applies automatically.",
      icon: <CreditCard className="w-6 h-6 text-accent-lux" />
    }
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto font-sans relative">
      <div className="text-center mb-16">
        <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest">Seamless Flow</span>
        <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white mt-1">
          How It Works
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
          Book in under 30 seconds with our fully automated booking sequence.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="glass-panel p-6 flex flex-col justify-between items-start border border-slate-200/10 hover:border-accent-lux/20 transition-colors relative"
          >
            {/* Step count indicator */}
            <span className="absolute top-4 right-6 text-4xl font-black text-slate-100 dark:text-slate-800/40 select-none font-mono">
              {step.step}
            </span>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6">
              {step.icon}
            </div>

            <div>
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
    </section>
  );
}
