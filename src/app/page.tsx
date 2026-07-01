"use client";

import Header from "@/components/common/Header";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Trending from "@/components/home/Trending";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import BeforeAfter from "@/components/home/BeforeAfter";
import Reviews from "@/components/home/Reviews";
import Partners from "@/components/home/Partners";
import FaqSection from "@/components/home/FaqSection";
import Footer from "@/components/common/Footer";
import { Download, QrCode, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <Hero />

        {/* Categories Grid */}
        <Categories />

        {/* Trending Packages */}
        <Trending />

        {/* Vetting Vow (Why Choose Us) */}
        <WhyChooseUs />

        {/* Step Guide (How it works) */}
        <HowItWorks />

        {/* Before / After comparisons */}
        <BeforeAfter />

        {/* Reviews marquee */}
        <Reviews />

        {/* Professional partners list */}
        <Partners />

        {/* App Download Banner */}
        <section className="py-20 px-6 max-w-7xl mx-auto font-sans">
          <div className="bg-gradient-to-br from-primary-lux via-slate-900 to-slate-950 text-white rounded-[32px] overflow-hidden p-8 sm:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative shadow-2xl">
            {/* Background glowing rings */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-lux/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-lux/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="lg:col-span-7 space-y-6 z-10">
              <span className="text-[10px] uppercase font-bold text-accent-lux/85 dark:text-slate-400 tracking-widest mb-4 block">
                HelpMate Mobile App
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                Luxury Home Services, <br />
                Right in Your Pocket.
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg">
                Book instantly, track your background-verified provider on a live map, and get instant pricing confirmations. Scan the QR code or click your store to get started.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white text-primary-lux hover:bg-slate-100 transition-colors text-left cursor-pointer">
                  <Download className="w-5 h-5 text-accent-lux" />
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Download on the</div>
                    <div className="text-xs font-black">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors text-left cursor-pointer">
                  <Download className="w-5 h-5 text-white" />
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Get it on</div>
                    <div className="text-xs font-black">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center items-center gap-8 z-10">
              {/* QR Code Graphic */}
              <div className="glass-panel p-6 bg-white/10 border-white/10 flex flex-col items-center shadow-2xl">
                <div className="p-3 bg-white rounded-2xl">
                  <QrCode className="w-28 h-28 text-slate-900" />
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-300 mt-4 tracking-wider">
                  Scan to Download
                </span>
              </div>

              {/* Phone graphic preview */}
              <div className="hidden sm:flex w-44 h-80 rounded-[32px] border-4 border-slate-700 bg-slate-950 p-2 overflow-hidden flex-col shadow-2xl relative">
                <div className="w-16 h-4 bg-slate-700 rounded-full mx-auto mb-2 shrink-0" />
                <div className="flex-1 flex flex-col gap-2 p-1 overflow-hidden select-none opacity-80">
                  <div className="w-full h-8 bg-slate-800 rounded-xl flex items-center justify-center text-[7px] font-bold text-slate-400 uppercase">
                    Map Tracking...
                  </div>
                  <div className="flex-1 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between p-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-accent-lux shrink-0" />
                      <div>
                        <div className="w-10 h-1 bg-slate-600 rounded-full" />
                        <div className="w-16 h-1 bg-slate-800 rounded-full mt-1" />
                      </div>
                    </div>
                    <div className="w-full h-12 bg-accent-lux rounded-lg flex items-center justify-center text-[8px] font-black text-white">
                      Arriving in 8 mins
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FAQs Section */}
        <FaqSection />
      </main>

      <Footer />
    </>
  );
}
