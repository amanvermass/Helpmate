"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
  Crown,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  ShieldCheck,
  Send,
  Download
} from "lucide-react";
import { useStore } from "@/store/useStore";

const newsletterSchema = zod.object({
  email: zod.string().email({ message: "Please enter a valid luxury email address" }),
});

type NewsletterInput = zod.infer<typeof newsletterSchema>;

export default function Footer() {
  const { addNotification } = useStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = (data: NewsletterInput) => {
    addNotification(
      "Newsletter Subscribed",
      `Thank you! We've sent an exclusive 15% discount code to ${data.email}. Welcome to luxury.`,
      "success"
    );
    reset();
  };

  return (
    <footer className="bg-primary-lux text-white dark:bg-slate-950 border-t border-white/5 py-16 px-6 font-sans mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-2 self-start">
            <img src="/logo.png" alt="HelpMate Logo" className="h-10 w-auto object-contain" />
          </Link>
          <p className="text-[12px] text-slate-400 leading-relaxed max-w-xs">
            Connecting selective clients with Varanasi's most experienced, background-verified on-demand technicians and therapists. Guaranteed premium satisfaction.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-success-lux font-semibold">
            <ShieldCheck className="w-4 h-4" /> Fully Bonded & Insured up to ₹10,000
          </div>
        </div>

        {/* Categories / Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-5">Premium Services</h4>
          <ul className="space-y-3 text-[12px] text-slate-400">
            <li><Link href="/search?category=cleaning" className="hover:text-white transition-colors">Elite Deep Cleaning</Link></li>
            <li><Link href="/search?category=ac" className="hover:text-white transition-colors">Power Jet AC Service</Link></li>
            <li><Link href="/search?category=beauty" className="hover:text-white transition-colors">Beauty & Home Salon</Link></li>
            <li><Link href="/search?category=electrician" className="hover:text-white transition-colors">Smart Home Automation</Link></li>
            <li><Link href="/search?category=plumbing" className="hover:text-white transition-colors">Plumbing & Hydro Jetting</Link></li>
          </ul>
        </div>

        {/* Legal & Contacts */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-5">Contact HelpMate</h4>
          <ul className="space-y-3.5 text-[11px] text-slate-400">
            <li className="font-semibold text-white text-[12px] leading-tight">Helpmate Home Care Services Pvt. Ltd.</li>
            <li>
              <span className="block text-[9px] uppercase font-black text-slate-500 tracking-wider mb-0.5">Corporate Office</span>
              D-58/16C Shashtri Nagar Colony, Sigra, Varanasi, UP
            </li>
            <li>
              <span className="block text-[9px] uppercase font-black text-slate-500 tracking-wider mb-0.5">Phone Support</span>
              <a href="tel:+917705004040" className="hover:text-white transition-colors block font-bold text-white">+91 7705 004 040</a>
              <a href="tel:+9105422974740" className="hover:text-white transition-colors block text-[10px] mt-0.5">+91 0542 297 4740</a>
            </li>
            <li>
              <span className="block text-[9px] uppercase font-black text-slate-500 tracking-wider mb-0.5">Email Support</span>
              <a href="mailto:info@helpmate.net.in" className="hover:text-white transition-colors block font-bold text-white">info@helpmate.net.in</a>
            </li>
            <li className="pt-2 flex gap-4 text-slate-400">
              <a href="#" aria-label="Instagram" className="hover:text-white transition-all hover:scale-115"><Instagram className="w-4 h-4" /></a>
              <a href="#" aria-label="Twitter" className="hover:text-white transition-all hover:scale-115"><Twitter className="w-4 h-4" /></a>
              <a href="#" aria-label="Facebook" className="hover:text-white transition-all hover:scale-115"><Facebook className="w-4 h-4" /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white transition-all hover:scale-115"><Linkedin className="w-4 h-4" /></a>
            </li>
          </ul>
        </div>

        {/* Newsletter / App Column */}
        <div className="flex flex-col gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-accent-lux" /> Join HelpMate Elite
            </h4>
            <p className="text-[11px] text-slate-400 mb-4">
              Get notified of weekend wellness deals and seasonal HVAC campaigns.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="relative flex">
              <input
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-[11px] placeholder:text-slate-500 focus:outline-none focus:border-accent-lux text-white"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-accent-lux flex items-center justify-center hover:bg-accent-lux/90 transition-all text-white disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {errors.email && (
              <p className="text-[10px] text-red-400 mt-2 pl-2">{errors.email.message}</p>
            )}
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-col gap-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Download App</span>
            <div className="flex gap-3">
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-left transition-colors cursor-pointer">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.62.71-1.16 1.85-1.01 2.96 1.1.09 2.23-.55 2.96-1.4z" />
                </svg>
                <div>
                  <div className="text-[8px] text-slate-400 uppercase font-sans">App Store</div>
                  <div className="text-[10px] font-bold leading-none mt-0.5 font-sans">iOS Apple</div>
                </div>
              </a>
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-left transition-colors cursor-pointer">
                <img src="/play-store.svg" alt="Google Play Icon" className="w-4 h-4 shrink-0" />
                <div>
                  <div className="text-[8px] text-slate-400 uppercase font-sans">Google Play</div>
                  <div className="text-[10px] font-bold leading-none mt-0.5 font-sans">Android APK</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500">
        <p>© 2026 HelpMate Inc. All rights reserved. Designed for elite service standards.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
