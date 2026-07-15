"use client";

import { MousePointerClick, CalendarDays, CreditCard, UserCheck } from "lucide-react";
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
    <section className="bg-[#48073D] text-white py-20 px-6 relative z-10 w-full overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-bold text-accent-lux bg-accent-lux/10 px-3 py-1 rounded-full tracking-widest inline-block mb-3.5">
            Step 5: Booking Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
            How to Book in 30 Seconds
          </h2>
          <p className="text-slate-300 mt-2.5 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Experience our frictionless scheduling process from start to finish.
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
              className="bg-white dark:bg-slate-900 p-6 rounded-[28px] flex flex-col justify-between items-start border border-slate-200/10 dark:border-slate-800 hover:border-accent-lux/30 transition-colors relative h-full text-left shadow-sm hover:shadow-md"
            >
              {/* Step count indicator */}
              <span className="absolute top-4 right-6 text-4xl font-black text-slate-100 dark:text-slate-800/40 select-none font-mono">
                {step.step}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950/60 flex items-center justify-center mb-6">
                {step.icon}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
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
