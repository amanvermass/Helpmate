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
            <img src="/logo.png" alt="HelpMate Logo" className="h-6 w-auto object-contain" />
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
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-5">Concierge Support</h4>
          <ul className="space-y-3 text-[12px] text-slate-400">
            <li><Link href="/profile" className="hover:text-white transition-colors">Client Profile & Wallet</Link></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Warranty Claims</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Elite AMC Subscriptions</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Help Center / FAQs</span></li>
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
                placeholder="luxury@lifestyle.com"
                {...register("email")}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-[11px] focus:outline-none focus:border-accent-lux text-white"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-1 top-1 w-8 h-8 rounded-full bg-accent-lux flex items-center justify-center hover:bg-accent-lux/95 transition-all text-white disabled:opacity-50 cursor-pointer"
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
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-left transition-colors cursor-pointer">
                <Download className="w-3.5 h-3.5 text-white" />
                <div>
                  <div className="text-[8px] text-slate-400 uppercase">App Store</div>
                  <div className="text-[10px] font-bold leading-none mt-0.5">iOS Apple</div>
                </div>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-left transition-colors cursor-pointer">
                <Download className="w-3.5 h-3.5 text-white" />
                <div>
                  <div className="text-[8px] text-slate-400 uppercase">Google Play</div>
                  <div className="text-[10px] font-bold leading-none mt-0.5">Android APK</div>
                </div>
              </button>
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
