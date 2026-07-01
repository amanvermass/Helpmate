"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Clock,
  ShieldCheck,
  Check,
  X as CloseIcon,
  ChevronRight,
  ArrowLeft,
  DollarSign
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CheckoutModal from "@/components/booking/CheckoutModal";
import { services, reviews as mockReviews } from "@/utils/mockData";
import { useStore } from "@/store/useStore";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const serviceId = resolvedParams.id;

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { addToRecentlyViewed } = useStore();

  const service = services.find((s) => s.id === serviceId);

  useEffect(() => {
    if (service) {
      addToRecentlyViewed(service.id);
    }
  }, [service, addToRecentlyViewed]);

  if (!service) {
    return (
      <>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-32 px-6 font-sans">
          <div className="glass-panel p-8 text-center max-w-sm">
            <h2 className="text-lg font-bold text-foreground">Service Not Found</h2>
            <p className="text-xs text-slate-500 mt-2">The requested luxury service has been cataloged under another code.</p>
            <Link href="/" className="mt-6 inline-block text-xs font-bold text-accent-lux hover:underline">
              Back to Homepage
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="flex-1 pt-24 font-sans bg-slate-50/50 dark:bg-background">
        
        {/* Banner Section */}
        <section className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-accent-lux transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to explore services
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Image Frame */}
              <div className="relative h-96 sm:h-[450px] rounded-[32px] overflow-hidden shadow-xl border border-slate-200/10">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute bottom-6 left-6 bg-black/65 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 border border-white/10 shadow-lg select-none">
                  Premium Vetted Service
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                  {service.name}
                </h1>
                
                <div className="flex flex-wrap gap-4 items-center text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {service.rating}
                  </span>
                  <span>({service.reviewsCount} reviews)</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {service.duration} mins duration
                  </span>
                  <span>•</span>
                  <span className="capitalize">{service.category}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-bold text-base text-foreground">Service Overview</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Inclusions / Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-slate-900/60 p-6 rounded-[24px] border border-slate-150/40 dark:border-slate-800">
                {/* Inclusions */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">Included in Package</h4>
                  <ul className="space-y-3">
                    {service.inclusions.map((item, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-600 dark:text-slate-300">
                        <Check className="w-4 h-4 text-success-lux mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">Excluded from Package</h4>
                  <ul className="space-y-3">
                    {service.exclusions.map((item, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-600 dark:text-slate-300">
                        <CloseIcon className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-foreground">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {service.faqs.map((faq, idx) => (
                    <div key={idx} className="glass-panel p-5 border border-slate-200/10">
                      <h4 className="font-bold text-xs sm:text-sm text-foreground">{faq.question}</h4>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-foreground">Recent Reviews</h3>
                <div className="space-y-4">
                  {mockReviews.map((rev) => (
                    <div key={rev.id} className="bg-white dark:bg-slate-900/40 border border-slate-150/40 dark:border-slate-800 p-6 rounded-[24px] space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-xs block text-foreground">{rev.name}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex gap-0.5 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sticky Card column */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <div className="glass-panel p-6 border border-slate-200/10 space-y-6">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Luxury Deal</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-foreground">${service.price}</span>
                    <span className="text-sm text-slate-400 line-through">${service.originalPrice}</span>
                    <span className="text-xs font-bold text-success-lux ml-1">{service.discountText}</span>
                  </div>
                </div>

                <div className="space-y-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-success-lux" /> Vetted 5-Star Technician
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent-lux" /> On-time Guarantee (Refund on delay)
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success-lux" /> Sanitized single-use material kits
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full bg-primary-lux hover:bg-slate-800 dark:bg-accent-lux dark:hover:bg-accent-lux/95 text-white font-bold text-xs py-4 rounded-full shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  Book Service Slot <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        serviceId={service.id}
        serviceName={service.name}
        servicePrice={service.price}
        serviceCategory={service.category}
        serviceDuration={service.duration}
      />

      <Footer />
    </>
  );
}
