"use client";

import React from "react";

interface IllustrationProps {
  className?: string;
}

export default function ServiceIllustration({ id, className = "w-full h-full" }: { id: string; className?: string }) {
  // Common Drop Shadow Filter to give 3D volumetric depth
  const filters = (
    <defs>
      <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="#48073d" floodOpacity="0.08" />
      </filter>
      <filter id="inner-shadow">
        <feComponentTransfer in="SourceAlpha">
          <feFuncA type="linear" slope="1"/>
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feOffset dx="0" dy="2"/>
        <feComposite operator="out" in2="SourceGraphic"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.1 0"/>
        <feBlend mode="multiply" in2="SourceGraphic"/>
      </filter>
      {/* Gradients */}
      <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#801C6E" />
        <stop offset="100%" stopColor="#48073d" />
      </linearGradient>
      <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A21CAF" />
        <stop offset="100%" stopColor="#801C6E" />
      </linearGradient>
      <linearGradient id="soft-gray" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>
  );

  switch (id) {
    case "hourly":
      // Minimalist luxury clock
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            <circle cx="50" cy="50" r="38" fill="url(#soft-gray)" stroke="url(#purple-grad)" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="30" fill="#FFFFFF" />
            {/* Clock Ticks */}
            <line x1="50" y1="18" x2="50" y2="22" stroke="#48073d" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="78" x2="50" y2="82" stroke="#48073d" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="50" x2="22" y2="50" stroke="#48073d" strokeWidth="2" strokeLinecap="round" />
            <line x1="78" y1="50" x2="82" y2="50" stroke="#48073d" strokeWidth="2" strokeLinecap="round" />
            {/* Hands */}
            <line x1="50" y1="50" x2="50" y2="30" stroke="url(#purple-grad)" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="50" x2="68" y2="50" stroke="url(#accent-grad)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="50" r="4.5" fill="#48073d" />
          </g>
        </svg>
      );

    case "bathroom":
      // Toilet & Clean environment
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Bathroom Base */}
            <path d="M15 75 L50 88 L85 75 L50 62 Z" fill="#E2E8F0" opacity="0.6" />
            {/* Toilet Body */}
            <rect x="42" y="38" width="16" height="28" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Toilet Bowl */}
            <ellipse cx="50" cy="58" rx="7" ry="9" fill="#F1F5F9" stroke="url(#purple-grad)" strokeWidth="2" />
            {/* Lid open background */}
            <rect x="42" y="32" width="16" height="12" rx="4" fill="url(#purple-grad)" />
            <rect x="44" y="24" width="12" height="16" rx="2" fill="#FFFFFF" stroke="url(#accent-grad)" strokeWidth="1.5" />
            {/* Water shine */}
            <ellipse cx="50" cy="61" rx="4" ry="5" fill="#E0F2FE" />
          </g>
        </svg>
      );

    case "fridge":
      // Refrigerator with shelves
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Fridge Main Body */}
            <rect x="30" y="15" width="40" height="70" rx="6" fill="url(#soft-gray)" stroke="#94A3B8" strokeWidth="2" />
            {/* Double Door Split */}
            <line x1="30" y1="48" x2="70" y2="48" stroke="#94A3B8" strokeWidth="1.5" />
            {/* Open Door effect / Depth inside */}
            <rect x="34" y="20" width="32" height="24" rx="2" fill="#F8FAFC" stroke="url(#purple-grad)" strokeWidth="1.5" />
            {/* Inner shelves */}
            <line x1="34" y1="28" x2="66" y2="28" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="34" y1="36" x2="66" y2="36" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Soft drinks/jars inside */}
            <rect x="38" y="22" width="5" height="6" rx="1" fill="url(#accent-grad)" />
            <rect x="46" y="21" width="4" height="7" rx="1" fill="#10B981" />
            {/* Handles */}
            <rect x="64" y="42" width="3" height="12" rx="1.5" fill="url(#purple-grad)" />
          </g>
        </svg>
      );

    case "packing":
      // Suitcase open with neatly folded clothes
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Suitcase Base */}
            <rect x="22" y="35" width="56" height="42" rx="8" fill="url(#purple-grad)" stroke="#48073d" strokeWidth="1" />
            {/* Suitcase Lid Open */}
            <path d="M22 35 L40 12 L78 20" fill="none" stroke="url(#accent-grad)" strokeWidth="3" strokeLinecap="round" />
            {/* Neat stacks of folded clothes inside */}
            <rect x="28" y="42" width="20" height="8" rx="2" fill="#3B82F6" />
            <rect x="28" y="48" width="20" height="8" rx="2" fill="#F472B6" />
            <rect x="28" y="54" width="20" height="8" rx="2" fill="#E2E8F0" />
            {/* Second stack */}
            <rect x="52" y="45" width="20" height="8" rx="2" fill="#10B981" />
            <rect x="52" y="51" width="20" height="8" rx="2" fill="#FBBF24" />
            <rect x="52" y="57" width="20" height="8" rx="2" fill="url(#accent-grad)" />
            {/* Handle */}
            <path d="M42 35 L42 28 L58 28 L58 35" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "utensils":
      // Dish rack and plates
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Plate 1 (Back) */}
            <circle cx="42" cy="45" r="22" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="42" cy="45" r="15" fill="#F8FAFC" />
            {/* Plate 2 (Front) */}
            <circle cx="58" cy="55" r="22" fill="#FFFFFF" stroke="url(#purple-grad)" strokeWidth="2.5" />
            <circle cx="58" cy="55" r="15" fill="#F8FAFC" stroke="url(#accent-grad)" strokeWidth="1" />
            {/* Fork and Spoon */}
            <path d="M22 62 L32 78" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="21" cy="60" r="3" fill="#94A3B8" />
            <path d="M78 62 L68 78" stroke="url(#accent-grad)" strokeWidth="3" strokeLinecap="round" />
            <path d="M78 60 C75 58 72 62 75 64 Z" fill="url(#accent-grad)" />
          </g>
        </svg>
      );

    case "prep":
      // Cutting board and vegetables
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Cutting Board */}
            <polygon points="18,65 50,80 82,65 50,50" fill="#E2B18A" stroke="#C68A5A" strokeWidth="2" />
            <polygon points="22,63 50,76 78,63 50,50" fill="#F3D1B5" />
            {/* Tomato */}
            <circle cx="42" cy="56" r="8" fill="#EF4444" />
            <path d="M42 48 L44 50 M42 48 L40 50" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            {/* Knife */}
            <path d="M35 72 L70 54" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M70 54 L80 49" stroke="url(#purple-grad)" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "dusting":
      // Spray bottle and feather duster
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Spray Bottle Body */}
            <rect x="30" y="48" width="16" height="32" rx="4" fill="url(#soft-gray)" stroke="url(#purple-grad)" strokeWidth="2" />
            <path d="M38 48 L38 38 L42 38 L42 48" fill="#E2E8F0" stroke="url(#purple-grad)" strokeWidth="1.5" />
            {/* Spray Nozzle */}
            <path d="M34 38 L46 38 L44 32 L36 32 Z" fill="url(#accent-grad)" />
            <path d="M44 38 L48 35" stroke="url(#accent-grad)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Feather Duster */}
            <path d="M70 78 L55 50" stroke="#E2B18A" strokeWidth="3" strokeLinecap="round" />
            <path d="M55 50 Q48 32 60 22 Q72 32 65 50" fill="url(#accent-grad)" opacity="0.9" />
            {/* Cleaning stars / sparkle */}
            <polygon points="76,28 78,32 82,34 78,36 76,40 74,36 70,34 74,32" fill="#FBBF24" />
          </g>
        </svg>
      );

    case "mopping":
      // Bucket and mop standing
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Mopping Bucket */}
            <ellipse cx="44" cy="74" rx="20" ry="10" fill="url(#purple-grad)" />
            <path d="M24 74 L28 52 L60 52 L64 74 Z" fill="url(#purple-grad)" />
            <ellipse cx="44" cy="52" rx="16" ry="7" fill="#801C6E" />
            {/* Foam / Water inside */}
            <ellipse cx="44" cy="53" rx="14" ry="5.5" fill="#E0F2FE" />
            {/* Mop Stick */}
            <line x1="68" y1="20" x2="48" y2="60" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
            {/* Mop head */}
            <path d="M44 56 Q40 68 48 66 Q52 64 48 56" fill="url(#accent-grad)" />
          </g>
        </svg>
      );

    case "preparty":
      // Luxury tray and drink glasses
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Serving Tray */}
            <polygon points="15,66 50,80 85,66 50,52" fill="url(#purple-grad)" stroke="#48073d" strokeWidth="1.5" />
            <polygon points="18,64 50,77 82,64 50,52" fill="#FFFFFF" opacity="0.1" />
            {/* Champagne Glass 1 */}
            <path d="M40 54 L40 62" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M36 62 L44 62" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M37 40 L43 40 L42 54 L38 54 Z" fill="url(#accent-grad)" opacity="0.8" />
            {/* Champagne Glass 2 */}
            <path d="M60 54 L60 62" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M56 62 L64 62" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M57 40 L63 40 L62 54 L58 54 Z" fill="url(#accent-grad)" opacity="0.8" />
          </g>
        </svg>
      );

    case "wardrobe":
      // Organized closet double doors open
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Wardrobe Body */}
            <rect x="25" y="15" width="50" height="70" rx="4" fill="url(#soft-gray)" stroke="url(#purple-grad)" strokeWidth="2.5" />
            {/* Hanging Clothes Inside */}
            <line x1="30" y1="26" x2="70" y2="26" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Hanger 1 */}
            <rect x="33" y="28" width="6" height="24" rx="2.5" fill="#EF4444" />
            {/* Hanger 2 */}
            <rect x="42" y="28" width="6" height="28" rx="2.5" fill="#3B82F6" />
            {/* Hanger 3 */}
            <rect x="51" y="28" width="6" height="26" rx="2.5" fill="#F59E0B" />
            {/* Hanger 4 */}
            <rect x="60" y="28" width="6" height="22" rx="2.5" fill="url(#accent-grad)" />
            {/* Open Cabinet Doors */}
            <rect x="5" y="15" width="20" height="70" rx="2" fill="url(#purple-grad)" opacity="0.25" />
            <rect x="75" y="15" width="20" height="70" rx="2" fill="url(#purple-grad)" opacity="0.25" />
          </g>
        </svg>
      );

    case "afterparty":
      // Party cleanup tray with cans and trash
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Trash Tray */}
            <polygon points="15,66 50,80 85,66 50,52" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            {/* Crushed Cups and Bottles */}
            <rect x="36" y="44" width="7" height="15" rx="1.5" fill="url(#accent-grad)" transform="rotate(-15 36 44)" />
            <rect x="52" y="46" width="6" height="13" rx="1" fill="#94A3B8" transform="rotate(35 52 46)" />
            <circle cx="46" cy="62" r="5" fill="#EF4444" opacity="0.8" />
            <circle cx="62" cy="58" r="4.5" fill="#3B82F6" opacity="0.8" />
          </g>
        </svg>
      );

    case "ironing":
      // Ironing board and iron
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Ironing Board Surface */}
            <ellipse cx="50" cy="60" rx="35" ry="8" fill="url(#soft-gray)" stroke="url(#purple-grad)" strokeWidth="2.5" />
            {/* Ironing Board Legs */}
            <line x1="28" y1="60" x2="68" y2="82" stroke="url(#purple-grad)" strokeWidth="3" />
            <line x1="72" y1="60" x2="32" y2="82" stroke="url(#purple-grad)" strokeWidth="3" />
            {/* Modern Steam Iron */}
            <path d="M42 46 L62 46 L62 52 L38 52 Z" fill="url(#accent-grad)" />
            <path d="M48 42 L60 42 L60 46 L48 46 Z" fill="url(#purple-grad)" />
            {/* Steam bubbles */}
            <circle cx="34" cy="56" r="1.5" fill="#3B82F6" opacity="0.6" />
            <circle cx="31" cy="58" r="1" fill="#3B82F6" opacity="0.6" />
          </g>
        </svg>
      );

    case "mirror":
      // Mirror cleaning with squeegee
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Wall Mirror Frame */}
            <rect x="22" y="18" width="56" height="64" rx="16" fill="url(#soft-gray)" stroke="url(#purple-grad)" strokeWidth="2.5" />
            {/* Mirror reflection glass */}
            <rect x="26" y="22" width="48" height="56" rx="12" fill="#E0F2FE" />
            {/* Clean sparkle diagonal streak */}
            <path d="M26 64 L66 24" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            {/* Squeegee */}
            <path d="M46 36 L66 48" stroke="url(#accent-grad)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M56 42 L48 56" stroke="url(#purple-grad)" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "laundry":
      // Front load washing machine
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Machine Cabinet */}
            <rect x="24" y="18" width="52" height="64" rx="8" fill="url(#soft-gray)" stroke="url(#purple-grad)" strokeWidth="2.5" />
            {/* Top Control Drawer */}
            <rect x="28" y="22" width="16" height="6" rx="1" fill="#E2E8F0" />
            <circle cx="64" cy="25" r="2.5" fill="url(#accent-grad)" />
            <circle cx="70" cy="25" r="1.5" fill="#10B981" />
            {/* Main Round Window */}
            <circle cx="50" cy="56" r="18" fill="#F1F5F9" stroke="url(#purple-grad)" strokeWidth="2" />
            {/* Inner Water/Clothes spinner */}
            <circle cx="50" cy="56" r="13" fill="#E0F2FE" />
            {/* Door handle latch */}
            <path d="M64 50 L66 56 C66 58 64 62 64 62" fill="none" stroke="url(#accent-grad)" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "sink":
      // Kitchen tap sink faucet and splash
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Faucet Arch */}
            <path d="M30 75 L30 35 C30 22 46 22 46 28 L46 36" fill="none" stroke="url(#purple-grad)" strokeWidth="4.5" strokeLinecap="round" />
            {/* Tap knob */}
            <rect x="24" y="56" width="12" height="4" rx="1.5" fill="url(#accent-grad)" />
            {/* Splash Water Droplets */}
            <path d="M46 36 L46 64" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="3,3" />
            <ellipse cx="46" cy="68" rx="8" ry="3" fill="#3B82F6" opacity="0.6" />
          </g>
        </svg>
      );

    case "balcony":
      // Balcony rails and flower pot
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Balcony Railings */}
            <line x1="18" y1="58" x2="82" y2="58" stroke="url(#purple-grad)" strokeWidth="3" />
            <line x1="18" y1="78" x2="82" y2="78" stroke="url(#purple-grad)" strokeWidth="3" />
            <line x1="28" y1="58" x2="28" y2="78" stroke="url(#purple-grad)" strokeWidth="2" />
            <line x1="42" y1="58" x2="42" y2="78" stroke="url(#purple-grad)" strokeWidth="2" />
            <line x1="56" y1="58" x2="56" y2="78" stroke="url(#purple-grad)" strokeWidth="2" />
            <line x1="70" y1="58" x2="70" y2="78" stroke="url(#purple-grad)" strokeWidth="2" />
            {/* Potted Plant */}
            <rect x="46" y="46" width="8" height="12" fill="url(#accent-grad)" rx="1.5" />
            <path d="M44 46 Q50 32 50 36 M56 46 Q50 32 50 36 M46 44 Q36 34 46 40 M54 44 Q64 34 54 40" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "fan":
      // Ceiling fan
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Fan Base */}
            <circle cx="50" cy="50" r="10" fill="url(#purple-grad)" />
            <circle cx="50" cy="50" r="6" fill="#FFFFFF" opacity="0.2" />
            {/* Fan Blade 1 */}
            <path d="M50 40 L50 14 C50 10 46 10 46 14 L46 40 Z" fill="url(#accent-grad)" />
            {/* Fan Blade 2 */}
            <path d="M42 52 L16 62 C12 64 14 68 18 66 L44 56 Z" fill="url(#accent-grad)" />
            {/* Fan Blade 3 */}
            <path d="M58 52 L84 62 C88 64 86 68 82 66 L56 56 Z" fill="url(#accent-grad)" />
          </g>
        </svg>
      );

    case "cabinet":
      // Storage cabinet open
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {filters}
          <g filter="url(#soft-shadow)">
            {/* Cabinet frame */}
            <rect x="22" y="24" width="56" height="52" rx="4" fill="url(#soft-gray)" stroke="url(#purple-grad)" strokeWidth="2.5" />
            {/* Dividers */}
            <line x1="22" y1="50" x2="78" y2="50" stroke="url(#purple-grad)" strokeWidth="2" />
            {/* Stored items / Towels */}
            <rect x="28" y="32" width="16" height="12" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            <rect x="52" y="36" width="18" height="8" rx="1.5" fill="url(#accent-grad)" />
            {/* Lower drawer folders */}
            <rect x="28" y="58" width="22" height="12" rx="2" fill="#3B82F6" opacity="0.8" />
            <rect x="56" y="58" width="16" height="12" rx="2" fill="#10B981" opacity="0.8" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}
