"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Phone,
  ArrowLeft,
  ThumbsUp,
  UserCheck,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { services } from "@/utils/mockData";

interface PlaceProps {
  params: Promise<{ place: string }>;
}

export default function PlaceLandingPage({ params }: PlaceProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const placeSlug = resolvedParams.place;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // Format slug to readable name (e.g. assi-ghat -> Assi Ghat)
  const placeName = placeSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Resolve local neighborhood image
  const getPlaceImage = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes("assi") || s.includes("lanka")) return "/bhu-gate.png";
    if (s.includes("godowlia") || s.includes("dashashwamedh")) return "/godowlia-crossing.png";
    if (s.includes("cantonment") || s.includes("nadesar") || s.includes("cantt")) return "/cantt-station.png";
    if (s.includes("sigra") || s.includes("mahmoorganj")) return "/sigra-crossing.png";
    if (s.includes("sarnath") || s.includes("ashapur")) return "/sarnath-temple.jpg";
    if (s.includes("pandeypur") || s.includes("whitespace")) return "/pandeypur-flyover.png";
    return "/sigra-crossing.png"; // Fallback image
  };

  const bgImage = getPlaceImage(placeSlug);

  // Localized trust values
  const trustStats = [
    { label: "Vetted Professionals", value: "85+" },
    { label: "Average Rating", value: "4.92★" },
    { label: "Dispatch Window", value: "30 Mins" },
    { label: "Completed Orders", value: "1,200+" }
  ];

  // Neighborhood list for navigation
  const allLocations = [
    { name: "Assi Ghat", slug: "assi-ghat" },
    { name: "Lanka", slug: "lanka" },
    { name: "Ravindrapuri", slug: "ravindrapuri" },
    { name: "Durgakund", slug: "durgakund" },
    { name: "Godowlia", slug: "godowlia" },
    { name: "Dashashwamedh", slug: "dashashwamedh" },
    { name: "Cantonment", slug: "cantonment" },
    { name: "Nadesar", slug: "nadesar" },
    { name: "Sigra", slug: "sigra" },
    { name: "Mahmoorganj", slug: "mahmoorganj" },
    { name: "Sarnath", slug: "sarnath" },
    { name: "Ashapur", slug: "ashapur" },
    { name: "Pandeypur", slug: "pandeypur" },
    { name: "Shivpur", slug: "shivpur" }
  ];

  // Local provider spotlight
  const localProvider = {
    name: "Vikram Malhotra",
    rating: 4.96,
    jobs: 840,
    experience: "8 Years",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    badges: ["Sanitization Certified", "Top Rated", "Background Cleared"]
  };

  // Neighborhood specific testimonials
  const testimonials = [
    {
      id: 1,
      name: "Ananya Mishra",
      date: "2 days ago",
      comment: `Extremely professional AC servicing right here near ${placeName}. The specialist arrived in a clean uniform, laid down a workspace sheet, cleaned the filters, and left no mess behind. Highly recommended!`,
      rating: 5
    },
    {
      id: 2,
      name: "Rajesh K. Tripathi",
      date: "1 week ago",
      comment: `Getting reliable plumbers in ${placeName} used to be a chore. Booked HelpMate's express plumbing service and they resolved our drainage blockage within an hour. Excellent response time.`,
      rating: 5
    }
  ];

  // Localized FAQ Accordion List
  const placeFaqs = [
    {
      question: `What is the standard dispatch response time in ${placeName}?`,
      answer: "Our specialists average a 30-minute dispatch time. We have active service hubs stationed near Lanka Crossing, Assi Crossing, Sigra Crossing, and Cantonment Station."
    },
    {
      question: "Are dispatch professionals background checked?",
      answer: "Yes, absolutely. Every partner undergoes a three-step vetting process: police background clearance, Aadhaar identity match verification, and strict reference audits before dispatch."
    },
    {
      question: `What if a professional is late arriving at my ${placeName} address?`,
      answer: "HelpMate guarantees promptness. If the specialist is late by 15 minutes or more, we credit ₹1,000 straight into your user wallet, no questions asked."
    },
    {
      question: "Do I need to provide tools or cleaning solvents?",
      answer: "No tools required. Our professionals arrive in uniform, carrying sealed, single-use, eco-friendly kits and sterilized machines."
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  // Filter service catalog
  const filteredServices = selectedCategory === "all"
    ? services
    : services.filter((s) => s.category === selectedCategory);

  const categoriesList = ["all", "cleaning", "ac", "salon", "painter", "plumbing", "electrician"];

  return (
    <>
      <Header />

      <main className="flex-1 pt-24 font-sans bg-slate-50/50 dark:bg-background relative overflow-visible pb-12">
        {/* Background ambient glowing circles */}
        <div className="absolute top-24 left-1/4 -translate-x-1/2 w-96 h-96 bg-accent-lux/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-48 right-1/4 translate-x-1/2 w-96 h-96 bg-accent-lux/[0.03] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-12 relative z-10">
          
          {/* Breadcrumb / Back button */}
          <div className="text-left">
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-accent-lux transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to home
            </Link>
          </div>

          {/* Split Hero Section */}
          <div className="relative rounded-[32px] overflow-hidden bg-white dark:bg-slate-900 p-8 sm:p-12 mb-12 shadow-xl border border-slate-200/40 dark:border-slate-800/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            {/* Ambient glows behind layout */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-lux/[0.03] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

            {/* Left Column: Typography Content (7 columns) */}
            <div className="lg:col-span-7 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-accent-lux/10 dark:bg-accent-lux/20 text-accent-lux text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                <MapPin className="w-3.5 h-3.5 animate-bounce" /> Now Serving {placeName}, Varanasi
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black text-slate-850 dark:text-white tracking-tight leading-tight">
                Premium Home Services in <span className="text-accent-lux">{placeName}</span>
              </h1>
              
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                Experience Varanasi's most reliable, background-verified house maintenance, professional painting, and salon solutions. Dispatched directly to your residence in {placeName} inside 30 minutes.
              </p>

              {/* Local Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                {trustStats.map((stat, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 p-3 rounded-2xl text-left">
                    <span className="text-sm sm:text-base font-black text-accent-lux block">{stat.value}</span>
                    <span className="text-[8px] uppercase font-bold text-slate-455 tracking-wider mt-0.5 block">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Stylized Image Frame (5 columns) */}
            <div className="lg:col-span-5 relative z-10 flex justify-center">
              <div className="relative group w-full max-w-sm aspect-[4/3] sm:aspect-video lg:aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200/40 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300">
                <img
                  src={bgImage}
                  alt={`${placeName} Varanasi`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating pill badge on image */}
                <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md text-white py-1.5 px-3 rounded-full text-[9px] font-bold border border-white/10 flex items-center gap-1 select-none">
                  <span className="w-2 h-2 bg-success-lux rounded-full animate-ping" />
                  Local Specialists Active
                </div>
              </div>
            </div>
          </div>

          {/* Specialist Spotlight Banner (Full Width) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/80 rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <img src={localProvider.avatar} alt={localProvider.name} className="w-16 h-16 rounded-full object-cover border-2 border-accent-lux" />
                <span className="absolute -bottom-1 -right-1 bg-success-lux text-white p-1 rounded-full text-[8px] border border-white dark:border-slate-950 font-black">✓</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="bg-accent-lux/10 text-accent-lux text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
                  Specialist Stationed in {placeName}
                </span>
                <h4 className="font-bold text-base text-foreground mt-1.5">{localProvider.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{localProvider.experience} Experience • Over {localProvider.jobs}+ successful jobs served</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {localProvider.badges.map((badge, idx) => (
                <span key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 text-slate-655 dark:text-slate-400 text-[10px] font-bold py-1.5 px-3.5 rounded-full">
                  {badge}
                </span>
              ))}
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 px-4 py-3.5 rounded-2xl text-[10px] text-slate-550 max-w-sm leading-relaxed text-center lg:text-left">
              Vikram Malhotra is currently stationed near central {placeName} with high-end toolsets. Booking services assigns Vikram or equivalent top-rated professionals instantly.
            </div>
          </div>

          {/* Category Filter and Services Section (Full Width) */}
          <div className="space-y-6">
            {/* Category Filter Buttons */}
            <div className="space-y-3 text-left">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                Select Service Domain
              </span>
              <div className="flex flex-wrap gap-2">
                {categoriesList.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setVisibleCount(8);
                      }}
                      className={`py-2 px-4 rounded-full text-xs font-bold capitalize transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-accent-lux border-accent-lux text-white shadow-md shadow-accent-lux/10"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-655 hover:border-slate-350"
                      }`}
                    >
                      {cat === "all" ? "View All Services" : cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Service List Grid */}
            <div className="space-y-6">
              <h3 className="font-extrabold text-lg text-foreground tracking-tight text-left">
                Available Packages in {placeName} ({filteredServices.length})
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredServices.slice(0, visibleCount).map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => router.push(`/services/${srv.id}`)}
                    className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-350 flex flex-col justify-between h-full text-left cursor-pointer hover:border-accent-lux/40 group"
                  >
                    <div className="space-y-3 block">
                      <div className="h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                        <img src={srv.image} alt={srv.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[8px] uppercase font-bold tracking-widest px-2.5 py-1.5 border border-white/10 rounded">
                          {srv.category}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-foreground leading-snug group-hover:text-accent-lux transition-colors line-clamp-1">{srv.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{srv.description}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4 space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                        <span className="uppercase font-bold text-slate-400 tracking-wider">HelpMate Verified</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {srv.duration} mins</span>
                      </div>

                      <div
                        className="w-full bg-accent-lux hover:bg-accent-lux/95 text-white font-bold text-[10px] py-3 rounded-full shadow-sm text-center flex items-center justify-center gap-1 transition-colors"
                      >
                        View Details & Booking <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredServices.length > visibleCount && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 8)}
                    className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-full transition-colors cursor-pointer shadow-sm hover:shadow"
                  >
                    View More Services
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Why Choose HelpMate Section (Full Width Grid) */}
          <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/80">
            <h3 className="font-extrabold text-lg text-foreground tracking-tight text-left">Why Choose HelpMate in {placeName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 text-left space-y-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-accent-lux/10 flex items-center justify-center text-accent-lux">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-foreground">Background-Vetted Pros</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every specialist undergoes rigorous police verification, local screening, and Aadhaar checks before dispatch.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 text-left space-y-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-accent-lux/10 flex items-center justify-center text-accent-lux">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-foreground">₹1,000 On-Time Promise</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  We value your time. If our professional arrives late by 15 minutes or more, we credit ₹1,000 straight to your wallet.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 text-left space-y-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-accent-lux/10 flex items-center justify-center text-accent-lux">
                  <ThumbsUp className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-foreground">Single-Use Sealed Kits</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Complete safety assured with single-use, bio-friendly solvents and tools unsealed in front of you.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 text-left space-y-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-accent-lux/10 flex items-center justify-center text-accent-lux">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-foreground">100% No-Mess Promise</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Our professionals clean up all residues, wastewater, and packaging debris. Your home remains spotless.
                </p>
              </div>
            </div>
          </div>

          {/* Local Customer Testimonials / Review Section (Full Width) */}
          <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
              <h3 className="font-extrabold text-lg text-foreground">What {placeName} Residents Say</h3>
              <div className="flex items-center gap-1 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">4.92 / 5</span>
                <div className="flex gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-slate-400 text-[10px]">(230 reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((test) => (
                <div key={test.id} className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/60 p-6 rounded-3xl space-y-3.5 text-left shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-xs block text-foreground">{test.name}</span>
                      <span className="text-[9px] text-slate-450 block">{test.date} • Verified resident</span>
                    </div>
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-550 dark:text-slate-400 leading-relaxed italic">
                    "{test.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Neighborhood localized FAQs Accordion style (Full Width) */}
          <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/80 max-w-4xl mx-auto text-left">
            <div className="text-center mb-6">
              <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest mb-1.5 block">
                Clear Information
              </span>
              <h3 className="font-extrabold text-lg text-foreground tracking-tight">FAQs for {placeName} Services</h3>
            </div>
            
            <div className="divide-y divide-slate-200/60 dark:divide-slate-800 border-t border-b border-slate-200/60 dark:border-slate-800">
              {placeFaqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={idx} className="transition-colors">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between py-5 text-left focus:outline-none cursor-pointer group"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-250 group-hover:text-accent-lux transition-colors">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-accent-lux transition-transform duration-300 shrink-0 ml-4 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="pb-5 pt-1 text-slate-500 dark:text-slate-405 text-[11px] sm:text-xs leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* App Download Banner (Luxury Fuchsia-to-Purple Gradient Theme) */}
          <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-accent-lux via-[#6E2660] to-[#511845] p-8 sm:p-12 mb-12 border border-accent-lux/20 text-left shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="space-y-4 max-w-xl relative z-10 text-white">
              <span className="text-fuchsia-300 text-[9px] uppercase font-black tracking-widest block">HelpMate On the Go</span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Varanasi's Premium Services in Your Pocket
              </h3>
              <p className="text-fuchsia-100/70 text-xs sm:text-sm leading-relaxed">
                Download the HelpMate app to manage bookings, track specialists in real-time, and get exclusive discounts. Scan the QR code or click the Play Store button.
              </p>
              
              <div className="flex gap-3 pt-2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-left transition-all hover:scale-105 active:scale-95 cursor-pointer text-white"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <div>
                    <div className="text-[8px] text-fuchsia-200 uppercase tracking-wider">App Store</div>
                    <div className="text-[10px] font-bold leading-none mt-0.5">iOS Apple</div>
                  </div>
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-left transition-all hover:scale-105 active:scale-95 cursor-pointer text-white"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <div>
                    <div className="text-[8px] text-fuchsia-200 uppercase tracking-wider">Google Play</div>
                    <div className="text-[10px] font-bold leading-none mt-0.5">Android APK</div>
                  </div>
                </a>
              </div>
            </div>

            {/* QR Code and Mockup Representation */}
            <div className="flex items-center gap-6 bg-slate-950/20 backdrop-blur-sm p-6 rounded-3xl border border-white/10 relative z-10 shrink-0">
              <div className="bg-white p-2 rounded-2xl shadow-sm">
                <div className="w-20 h-20 bg-slate-100 flex items-center justify-center rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-850 text-center select-none font-mono">HELP<br/>MATE</span>
                </div>
              </div>
              <div className="text-left text-white">
                <span className="text-[9px] uppercase font-black text-fuchsia-300 block">Scan to Install</span>
                <h4 className="text-xs font-bold mt-0.5">Instant Play Store Install</h4>
                <p className="text-[9px] text-fuchsia-100/60 mt-1 leading-normal max-w-[140px]">
                  Use your phone camera to scan and start booking in seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Other Varanasi Locations Grid */}
          <div className="border-t border-slate-200/50 dark:border-slate-800/80 pt-10 mt-12 text-left space-y-4">
            <h3 className="font-extrabold text-base text-foreground tracking-tight">Explore Other Service Locations in Varanasi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
              Select your neighborhood below to explore localized service information, verified expert status, and response details:
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {allLocations
                .filter((loc) => loc.slug !== placeSlug)
                .map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/places/${loc.slug}`}
                    className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/80 px-4 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-350 shadow-sm hover:border-accent-lux/30 transition-all hover:text-accent-lux dark:hover:text-accent-lux cursor-pointer block"
                  >
                    {loc.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
