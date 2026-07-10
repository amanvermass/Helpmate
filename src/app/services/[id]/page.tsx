"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Clock,
  ShieldCheck,
  Check,
  X as CloseIcon,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { services, reviews as mockReviews } from "@/utils/mockData";
import { useStore } from "@/store/useStore";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const serviceId = resolvedParams.id;
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const { addToRecentlyViewed, addToCart, clearCart, addNotification } = useStore();

  const service = services.find((s) => s.id === serviceId);

  const relatedServices = service
    ? services
        .filter((s) => s.id !== service.id && s.category === service.category)
        .concat(services.filter((s) => s.id !== service.id && s.category !== service.category))
        .slice(0, 8)
    : [];

  useEffect(() => {
    if (service) {
      addToRecentlyViewed(service.id);
    }
  }, [service, addToRecentlyViewed]);

  const addons = [
    { id: "eco", label: "Eco-Friendly Safe Solvents", price: 199, duration: 15 },
    { id: "warranty", label: "90-Day Extended Warranty", price: 99, duration: 0 },
    { id: "express", label: "Express 2-Specialist Mode", price: 399, duration: -45 }
  ];

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

  // Calculations for custom bundle
  const addonSum = addons
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);
  const durationAdjustment = addons
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.duration, 0);

  const finalPrice = service.price + addonSum;
  const finalDuration = Math.max(30, service.duration + durationAdjustment);
  
  const selectedAddonLabels = addons
    .filter((a) => selectedAddons.includes(a.id))
    .map((a) => a.label);

  const finalName = `${service.name} ${
    selectedAddonLabels.length > 0 ? `(+ ${selectedAddonLabels.join(", ")})` : ""
  }`;

  const handleBook = () => {
    clearCart();
    addToCart({
      id: service.id,
      name: finalName,
      price: finalPrice,
      category: service.category,
      duration: finalDuration
    });
    router.push("/booking");
  };

  const handleAddToCart = () => {
    addToCart({
      id: service.id,
      name: finalName,
      price: finalPrice,
      category: service.category,
      duration: finalDuration
    });
    addNotification(
      "Added to Cart",
      `${service.name} has been added to your selection.`,
      "success"
    );
  };

  // Matched Specialist Logic (BookMyBai / Pronto Verification Feature)
  let matchedPro = {
    name: "Arjun Mehta",
    specialty: "Luxury Cleaning Expert",
    experience: "7+ Years",
    rating: 4.95,
    completedJobs: 1240,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
  };

  if (service.category === "beauty" || service.category === "salon") {
    matchedPro = {
      name: "Neha Patil",
      specialty: "Master Therapist & Aesthetician",
      experience: "5 Years",
      rating: 4.98,
      completedJobs: 1530,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
    };
  } else if (service.category === "ac" || service.category === "electrician" || service.category === "plumbing") {
    matchedPro = {
      name: "Rahul Ranade",
      specialty: "HVAC & Electrical Automation Engineer",
      experience: "6 Years",
      rating: 4.88,
      completedJobs: 980,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
    };
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer-sweep {
          0% { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        .shimmer-button-glow {
          position: absolute;
          top: 0;
          height: 100%;
          width: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.25) 30%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0.25) 70%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer-sweep 2.2s infinite linear;
        }

        @keyframes arrow-slide-full {
          0% { transform: translate3d(-100%, -50%, 0); opacity: 0; }
          10% { opacity: 0.35; }
          50% { opacity: 0.65; }
          90% { opacity: 0.35; }
          100% { transform: translate3d(240%, -50%, 0); opacity: 0; }
        }
        .arrows-bg-track {
          position: absolute;
          top: 50%;
          left: 0;
          display: flex;
          align-items: center;
          gap: 5px;
          pointer-events: none;
          z-index: 5;
          animation: arrow-slide-full 2.2s infinite linear;
        }
      `}} />
      <Header />

      <main className="flex-1 pt-24 pb-24 lg:pb-12 font-sans bg-slate-50/50 dark:bg-background relative">
        {/* Background glows */}
        <div className="absolute top-24 left-1/4 -translate-x-1/2 w-96 h-96 bg-accent-lux/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-48 right-1/4 translate-x-1/2 w-96 h-96 bg-accent-lux/[0.03] rounded-full blur-[140px] pointer-events-none" />
        
        {/* Banner Section */}
        <section className="max-w-7xl mx-auto px-6 py-6 relative z-10">
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

              {/* Matched Specialist Preview Card */}
              <div className="bg-gradient-to-br from-slate-900/5 via-[#8D397E]/5 to-transparent dark:from-slate-900/60 dark:via-[#8D397E]/10 dark:to-slate-950/40 p-6 rounded-[28px] border border-accent-lux/15 flex flex-col sm:flex-row gap-5 items-center justify-between text-left shadow-sm">
                <div className="flex items-center gap-4 text-left w-full">
                  <img src={matchedPro.avatar} alt={matchedPro.name} className="w-14 h-14 rounded-full object-cover border-2 border-accent-lux shrink-0" />
                  <div>
                    <span className="inline-block bg-accent-lux/10 text-accent-lux text-[8px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider mb-1">
                      Assigned Specialist Preview
                    </span>
                    <h4 className="font-bold text-sm text-foreground">{matchedPro.name}</h4>
                    <p className="text-[10px] text-slate-400">{matchedPro.specialty} • {matchedPro.experience} exp</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {matchedPro.rating} ({matchedPro.completedJobs} jobs completed)
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col gap-x-4 sm:gap-x-0 gap-y-0.5 shrink-0 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-5 text-left text-[10px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-semibold text-success-lux">
                    <Check className="w-3.5 h-3.5" /> Aadhaar Verified
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-success-lux">
                    <Check className="w-3.5 h-3.5" /> Police Audited
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-success-lux">
                    <Check className="w-3.5 h-3.5" /> Varanasi Resident
                  </div>
                </div>
              </div>

              {/* Inclusions / Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Inclusions Card */}
                <div className="bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] border border-emerald-500/10 rounded-[28px] p-6 shadow-sm">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-450 mb-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Included in Package
                  </h4>
                  <ul className="space-y-3">
                    {service.inclusions.map((item, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-650 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions Card */}
                <div className="bg-red-500/[0.02] dark:bg-red-500/[0.04] border border-red-500/10 rounded-[28px] p-6 shadow-sm">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-red-650 dark:text-red-400 mb-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Excluded from Package
                  </h4>
                  <ul className="space-y-3">
                    {service.exclusions.map((item, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-650 dark:text-slate-300">
                        <CloseIcon className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <h3 className="font-extrabold text-base text-foreground tracking-tight">Frequently Asked Questions</h3>
                <div className="divide-y divide-slate-200/60 dark:divide-slate-800 border-t border-b border-slate-200/60 dark:border-slate-800">
                  {service.faqs.map((faq, idx) => (
                    <div key={idx} className="py-4">
                      <h4 className="font-bold text-xs sm:text-sm text-foreground">{faq.question}</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-450 mt-1.5 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Services / Pairs */}
              <div className="space-y-5 pt-8 border-t border-slate-100 dark:border-slate-800/80 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-foreground tracking-tight">Frequently Booked Together</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Varanasi residents often pair this package with these verified services.</p>
                  </div>
                  
                  {/* Scroll Buttons */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        const container = document.getElementById("suggestion-scroll-track");
                        if (container) container.scrollBy({ left: -260, behavior: "smooth" });
                      }}
                      className="w-8 h-8 rounded-full border border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent-lux transition-colors cursor-pointer text-xs font-black"
                      aria-label="Scroll left"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => {
                        const container = document.getElementById("suggestion-scroll-track");
                        if (container) container.scrollBy({ left: 260, behavior: "smooth" });
                      }}
                      className="w-8 h-8 rounded-full border border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent-lux transition-colors cursor-pointer text-xs font-black"
                      aria-label="Scroll right"
                    >
                      →
                    </button>
                  </div>
                </div>
                
                <div
                  id="suggestion-scroll-track"
                  className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2 snap-x snap-mandatory"
                  style={{ scrollbarWidth: "none" }}
                >
                  {relatedServices.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/services/${rel.id}`}
                      className="glass-panel overflow-hidden group flex flex-col justify-between border border-slate-200/10 hover:shadow-lg transition-all duration-300 cursor-pointer p-4 h-full text-left w-[240px] sm:w-[260px] shrink-0 snap-start"
                    >
                      <div className="space-y-2.5">
                        <div className="h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                          <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div>
                          <span className="text-[8px] uppercase font-black text-accent-lux tracking-wider capitalize">{rel.category}</span>
                          <h4 className="font-bold text-xs text-foreground group-hover:text-accent-lux transition-colors truncate mt-0.5">{rel.name}</h4>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/60 text-[10px] font-bold text-slate-500">
                        <span className="text-xs font-black text-foreground">₹{rel.price}</span>
                        <span className="flex items-center gap-0.5 text-amber-500">
                          ★ {rel.rating}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-foreground">Recent Reviews</h3>
                <div className="space-y-4">
                  {mockReviews.map((rev) => (
                    <div key={rev.id} className="bg-white dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/60 p-6 rounded-[24px] space-y-3 shadow-sm hover:border-accent-lux/30 transition-colors">
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
              <div className="glass-panel p-6 border border-slate-200/10 space-y-6 text-left">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Luxury Deal</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-foreground">₹{finalPrice}</span>
                    <span className="text-sm text-slate-400 line-through">₹{service.originalPrice}</span>
                    <span className="text-xs font-bold text-success-lux ml-1">{service.discountText}</span>
                  </div>
                </div>

                {/* Add-ons Checklist */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Custom Add-on Options
                  </span>
                  {addons.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() =>
                          setSelectedAddons((prev) =>
                            prev.includes(addon.id) ? prev.filter((a) => a !== addon.id) : [...prev, addon.id]
                          )
                        }
                        className={`flex items-center justify-between py-1.5 px-3 rounded-lg border cursor-pointer select-none transition-all ${
                          isChecked
                            ? "border-accent-lux/40 bg-accent-lux/[0.02]"
                            : "border-slate-200/10 hover:border-slate-350"
                        }`}
                      >
                        <div className="text-[10px]">
                          <span className="font-bold text-foreground block">{addon.label}</span>
                          <span className="text-[8px] text-slate-400">
                            {addon.duration !== 0 && `${addon.duration > 0 ? `+${addon.duration}` : addon.duration} mins`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold text-accent-lux">+₹{addon.price}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? "bg-accent-lux border-accent-lux text-white" : "border-slate-300 dark:border-slate-700"
                          }`}>
                            {isChecked && <Check className="w-2.5 h-2.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                 <div className="space-y-3 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-success-lux" /> Vetted 5-Star Specialist
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent-lux" /> On-time Guarantee (₹1,000 late refund)
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success-lux" /> Sanitized single-use materials
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 font-bold text-xs py-3.5 rounded-full flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBook}
                    className="flex-1 bg-accent-lux hover:bg-accent-lux/95 text-white font-bold text-xs py-3.5 rounded-full shadow-md flex items-center justify-center cursor-pointer transition-colors relative overflow-hidden"
                  >
                    <div className="arrows-bg-track opacity-25 dark:opacity-20">
                      <ChevronRight className="w-3.5 h-3.5 text-white/90 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
                      <ChevronRight className="w-3.5 h-3.5 text-white/90 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
                      <ChevronRight className="w-3.5 h-3.5 text-white/90 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
                    </div>
                    <div className="shimmer-button-glow pointer-events-none" />
                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                      Book Now <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Varanasi Premium Guarantee Banner */}
              <div className="glass-panel p-5 border border-slate-205/60 dark:border-slate-800/80 bg-gradient-to-br from-[#8D397E]/[0.02] to-transparent rounded-[24px] space-y-3 text-left">
                <span className="text-[9px] uppercase font-bold text-accent-lux tracking-wider block">HelpMate Service Promise</span>
                <h4 className="text-xs font-bold text-foreground">Verified Luxury Quality</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-450 leading-relaxed">
                  Every professional undergoes background screening, police verification, and Aadhaar checks. Varanasi's elite households trust HelpMate.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Sticky Bottom Actions Bar (for mobile/tablet screens where right column is at the bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200/40 dark:border-slate-800/60 py-3 px-6 flex items-center justify-between shadow-[0_-8px_30px_rgb(0,0,0,0.06)] lg:hidden">
        <div className="flex flex-col text-left">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total Price</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-foreground">₹{finalPrice}</span>
            <span className="text-[9px] text-slate-400 line-through">₹{service.originalPrice}</span>
          </div>
        </div>
        
        <div className="flex gap-2.5">
          <button
            onClick={handleAddToCart}
            className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 font-bold text-xs py-2.5 px-4 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-sm"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBook}
            className="bg-accent-lux hover:bg-accent-lux/95 text-white font-bold text-xs py-2.5 px-5 rounded-full shadow-md flex items-center justify-center gap-1 cursor-pointer transition-colors relative overflow-hidden"
          >
            <div className="arrows-bg-track opacity-25 dark:opacity-20">
              <ChevronRight className="w-3.5 h-3.5 text-white/90 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
              <ChevronRight className="w-3.5 h-3.5 text-white/90 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
              <ChevronRight className="w-3.5 h-3.5 text-white/90 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
            </div>
            <div className="shimmer-button-glow pointer-events-none" />
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              Book Now <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
