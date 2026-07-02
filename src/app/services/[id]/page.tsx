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
  ArrowLeft
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
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const { addToRecentlyViewed, addToCart, clearCart } = useStore();

  const service = services.find((s) => s.id === serviceId);

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
    setCheckoutOpen(true);
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

              {/* Matched Specialist Preview Card */}
              <div className="glass-panel p-5 border border-slate-200/10 flex flex-col sm:flex-row gap-5 items-center justify-between text-left">
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
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
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
                        className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
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

                <button
                  onClick={handleBook}
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
        serviceName={finalName}
        servicePrice={finalPrice}
        serviceCategory={service.category}
        serviceDuration={finalDuration}
      />

      <Footer />
    </>
  );
}
