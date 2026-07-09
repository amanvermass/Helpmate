"use client";

import { Download } from "lucide-react";

const IroningIllustration = () => (
  <svg viewBox="0 0 120 180" className="w-24 sm:w-32 xl:w-36 h-auto drop-shadow-md shrink-0">
    {/* Ironing Board Legs */}
    <line x1="32" y1="120" x2="48" y2="175" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="88" y1="120" x2="72" y2="175" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Ironing Board Surface */}
    <path d="M 20 120 L 100 120 C 104 120, 104 116, 100 116 L 20 116 C 16 116, 16 120, 20 120 Z" fill="#94A3B8" />
    
    {/* Pink Clothes Sheet on Board */}
    <path d="M 32 115 C 50 112, 70 112, 85 115 L 85 117 L 32 117 Z" fill="#F472B6" />
    
    {/* Iron Device */}
    <path d="M 76 108 L 90 108 C 93 108, 93 111, 93 113 L 88 116 L 76 116 Z" fill="#334155" />
    <path d="M 80 108 Q 80 104 88 104" stroke="#64748B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    
    {/* Helper Character */}
    {/* Legs */}
    <path d="M 44 85 C 44 105, 42 125, 42 173 L 52 173 C 52 135, 54 135, 54 120 C 54 135, 56 135, 56 173 L 66 173 C 66 125, 64 105, 64 85 Z" fill="#1E293B" />
    {/* Pink Sneakers */}
    <path d="M 36 173 L 52 173 C 52 169, 36 169, 36 173 Z" fill="#EC4899" />
    <path d="M 56 173 L 72 173 C 72 169, 56 169, 56 173 Z" fill="#EC4899" />
    
    {/* Torso/Polo shirt */}
    <path d="M 38 46 C 36 60, 40 75, 44 85 L 68 85 C 72 75, 76 60, 74 46 Z" fill="#8D397E" />
    
    {/* White Collar Details */}
    <path d="M 48 46 L 56 56 L 64 46" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    
    {/* Arms */}
    <path d="M 40 50 Q 30 75, 52 88" stroke="#8D397E" strokeWidth="5.5" fill="none" strokeLinecap="round" />
    <path d="M 72 50 Q 82 75, 82 108" stroke="#8D397E" strokeWidth="5.5" fill="none" strokeLinecap="round" />
    
    {/* Hands */}
    <circle cx="52" cy="88" r="3.5" fill="#FCA5A5" />
    <circle cx="82" cy="108" r="3.5" fill="#FCA5A5" />
    
    {/* Neck */}
    <rect x="52" y="40" width="8" height="9" fill="#FCA5A5" />
    {/* Head */}
    <circle cx="56" cy="32" r="11" fill="#FCA5A5" />
    
    {/* Hair (Ponytail) */}
    <path d="M 52 22 C 40 25, 32 38, 30 52 C 34 50, 42 45, 46 32 Z" fill="#1E293B" />
    <circle cx="54" cy="25" r="8" fill="#1E293B" />
  </svg>
);

const DustingIllustration = () => (
  <svg viewBox="0 0 120 180" className="w-24 sm:w-32 xl:w-36 h-auto drop-shadow-md shrink-0">
    {/* Emerald Ladder */}
    <line x1="38" y1="90" x2="26" y2="175" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
    <line x1="58" y1="90" x2="68" y2="175" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
    <line x1="35" y1="110" x2="61" y2="110" stroke="#10B981" strokeWidth="2.5" />
    <line x1="32" y1="130" x2="64" y2="130" stroke="#10B981" strokeWidth="2.5" />
    <line x1="29" y1="150" x2="66" y2="150" stroke="#10B981" strokeWidth="2.5" />
    
    {/* Character */}
    {/* Legs climbing */}
    <path d="M 42 85 C 42 105, 38 120, 34 140 L 44 140 C 46 125, 48 115, 48 100 C 50 115, 54 110, 62 125 L 70 120 C 62 100, 66 95, 66 85 Z" fill="#1E293B" />
    {/* Pink Sneakers */}
    <path d="M 28 140 L 44 140 C 44 136, 28 136, 28 140 Z" fill="#EC4899" />
    <path d="M 60 120 L 76 120 C 76 116, 60 116, 60 120 Z" fill="#EC4899" />
    
    {/* Torso/Polo shirt */}
    <path d="M 36 48 C 34 62, 38 75, 42 85 L 66 85 C 70 75, 74 62, 72 48 Z" fill="#8D397E" />
    
    {/* White Collar Details */}
    <path d="M 46 48 L 54 58 L 62 48" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    
    {/* Arm Reaching Up */}
    <path d="M 64 50 Q 80 30, 88 15" stroke="#8D397E" strokeWidth="5.5" fill="none" strokeLinecap="round" />
    <circle cx="88" cy="15" r="3.5" fill="#FCA5A5" />
    
    {/* Feather Duster */}
    <line x1="88" y1="15" x2="100" y2="5" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="102" cy="3" r="6" fill="#F59E0B" />
    <circle cx="98" cy="7" r="5.5" fill="#F59E0B" />
    <circle cx="105" cy="8" r="5" fill="#F59E0B" />
    
    {/* Arm supporting */}
    <path d="M 38 52 Q 28 65, 34 78" stroke="#8D397E" strokeWidth="5" fill="none" strokeLinecap="round" />
    <circle cx="34" cy="78" r="3" fill="#FCA5A5" />
    
    {/* Neck */}
    <rect x="49" y="40" width="8" height="9" fill="#FCA5A5" />
    {/* Head */}
    <circle cx="53" cy="30" r="10" fill="#FCA5A5" />
    
    {/* Hair (Ponytail) */}
    <path d="M 49 22 C 37 25, 29 38, 27 52 C 31 50, 39 45, 43 32 Z" fill="#1E293B" />
    <circle cx="51" cy="25" r="7.5" fill="#1E293B" />
  </svg>
);

const SprayingIllustration = () => (
  <svg viewBox="0 0 120 180" className="w-24 sm:w-32 xl:w-36 h-auto drop-shadow-md shrink-0">
    {/* Window Pane background */}
    <rect x="10" y="25" width="48" height="75" fill="none" stroke="#CBD5E1" strokeWidth="2" rx="2" />
    <line x1="34" y1="25" x2="34" y2="100" stroke="#CBD5E1" strokeWidth="1.5" />
    <line x1="10" y1="62" x2="58" y2="62" stroke="#CBD5E1" strokeWidth="1.5" />
    
    {/* Character */}
    {/* Legs */}
    <path d="M 50 95 C 50 115, 48 135, 48 173 L 58 173 C 58 135, 60 135, 60 120 C 60 135, 62 135, 62 173 L 72 173 C 72 135, 70 115, 70 95 Z" fill="#1E293B" />
    {/* Pink Sneakers */}
    <path d="M 42 173 L 58 173 C 58 169, 42 169, 42 173 Z" fill="#EC4899" />
    <path d="M 56 173 L 72 173 C 72 169, 56 169, 56 173 Z" fill="#EC4899" />
    
    {/* Torso/Polo shirt */}
    <path d="M 44 58 C 42 72, 46 85, 50 95 L 74 95 C 78 85, 82 72, 80 58 Z" fill="#8D397E" />
    
    {/* White Collar Details */}
    <path d="M 54 58 L 62 68 L 70 58" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    
    {/* Wiping Arm */}
    <path d="M 44 62 Q 30 50, 18 50" stroke="#8D397E" strokeWidth="5.5" strokeLinecap="round" fill="none" />
    <circle cx="18" cy="50" r="3.5" fill="#FCA5A5" />
    {/* Yellow cloth */}
    <rect x="13" y="47" width="8" height="6" fill="#F59E0B" rx="1" />
    
    {/* Spraying Arm */}
    <path d="M 76 62 Q 85 75, 80 92" stroke="#8D397E" strokeWidth="5" strokeLinecap="round" fill="none" />
    <circle cx="80" cy="92" r="3.5" fill="#FCA5A5" />
    {/* Spray Bottle */}
    <path d="M 78 92 L 76 95 L 82 95 L 80 92 Z" fill="#38BDF8" />
    
    {/* Neck */}
    <rect x="58" y="50" width="8" height="9" fill="#FCA5A5" />
    {/* Head */}
    <circle cx="62" cy="40" r="11" fill="#FCA5A5" />
    
    {/* Hair (Ponytail) */}
    <path d="M 58 30 Q 48 34, 44 46" stroke="#1E293B" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <circle cx="61" cy="33" r="8" fill="#1E293B" />
  </svg>
);

const MoppingIllustration = () => (
  <svg viewBox="0 0 120 180" className="w-24 sm:w-32 xl:w-36 h-auto drop-shadow-md shrink-0">
    {/* Red Bucket */}
    <ellipse cx="88" cy="158" rx="10" ry="4" fill="#EF4444" />
    <path d="M 78 158 L 80 144 L 96 144 L 98 158 Z" fill="#EF4444" />
    <path d="M 77 146 Q 88 136 99 146" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
    
    {/* Character */}
    {/* Legs */}
    <path d="M 38 95 C 38 115, 36 135, 36 173 L 46 173 C 46 135, 48 135, 48 120 C 48 135, 50 135, 50 173 L 60 173 C 60 135, 58 115, 58 95 Z" fill="#1E293B" />
    {/* Pink Sneakers */}
    <path d="M 30 173 L 46 173 C 46 169, 30 169, 30 173 Z" fill="#EC4899" />
    <path d="M 44 173 L 60 173 C 60 169, 44 169, 44 173 Z" fill="#EC4899" />
    
    {/* Torso/Polo shirt */}
    <path d="M 32 58 C 30 72, 34 85, 38 95 L 62 95 C 66 85, 70 72, 68 58 Z" fill="#8D397E" />
    
    {/* White Collar Details */}
    <path d="M 42 58 L 50 68 L 58 58" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    
    {/* Arms holding mop */}
    <path d="M 32 60 Q 24 85, 20 110" stroke="#8D397E" strokeWidth="5.5" fill="none" strokeLinecap="round" />
    <path d="M 62 60 Q 50 88, 30 112" stroke="#8D397E" strokeWidth="5" fill="none" strokeLinecap="round" />
    
    {/* Hands */}
    <circle cx="20" cy="110" r="3.5" fill="#FCA5A5" />
    <circle cx="30" cy="112" r="3.5" fill="#FCA5A5" />
    
    {/* Mop Stick */}
    <line x1="42" y1="42" x2="12" y2="162" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Yellow Mop Head */}
    <path d="M 5 162 L 19 162 L 23 170 L 1 170 Z" fill="#F59E0B" />
    
    {/* Neck */}
    <rect x="44" y="50" width="8" height="9" fill="#FCA5A5" />
    {/* Head */}
    <circle cx="48" cy="40" r="11" fill="#FCA5A5" />
    
    {/* Hair (Ponytail) */}
    <path d="M 44 30 Q 34 34, 30 46" stroke="#1E293B" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <circle cx="47" cy="33" r="8" fill="#1E293B" />
  </svg>
);

export default function CtaBanner() {
  return (
    <section className="w-full bg-gradient-to-b from-transparent via-accent-lux/[0.03] to-transparent dark:via-accent-lux/[0.05] border-t border-slate-100 dark:border-slate-800/60 pt-20 pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative">
        
        {/* Left Column: Two provider illustrations */}
        <div className="hidden lg:flex lg:col-span-4 items-end justify-center gap-6 xl:gap-8">
          <IroningIllustration />
          <DustingIllustration />
        </div>

        {/* Center Column: Text & Store Actions */}
        <div className="col-span-1 lg:col-span-4 text-center flex flex-col items-center justify-center space-y-6 z-10 pb-4">
          <span className="text-[10px] uppercase font-black text-accent-lux tracking-widest block">
            Varanasi's First Quick Service App
          </span>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-lux dark:text-white leading-tight">
            Varanasi's First Quick<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-lux to-[#a21caf]">
              Service App
            </span>
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
            On-demand home services to empower Varanasi households. Book verified, uniformed experts in 60 seconds.
          </p>

          {/* Combined rating & star reviews */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1 text-[13px]">
              <span className="text-accent-lux font-black">★★★★★</span>
              <span className="font-extrabold text-slate-800 dark:text-white ml-1">4.9</span>
            </div>
            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest">
              12,000+ Varanasi Bookings Combined
            </span>
          </div>

          {/* App download link badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950 text-white hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer text-left">
              <Download className="w-4 h-4 text-accent-lux" />
              <div>
                <div className="text-[7px] text-slate-400 uppercase font-black tracking-wider leading-none">Get it on</div>
                <div className="text-[10px] font-bold mt-0.5 leading-none">Google Play</div>
              </div>
            </button>
            <button className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950 text-white hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer text-left">
              <Download className="w-4 h-4 text-white" />
              <div>
                <div className="text-[7px] text-slate-400 uppercase font-black tracking-wider leading-none">Download on</div>
                <div className="text-[10px] font-bold mt-0.5 leading-none">App Store</div>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Two provider illustrations */}
        <div className="hidden lg:flex lg:col-span-4 items-end justify-center gap-6 xl:gap-8">
          <SprayingIllustration />
          <MoppingIllustration />
        </div>

      </div>

      {/* Deep purple/pink accent bottom strip */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-lux via-secondary-lux to-primary-lux" />
    </section>
  );
}
