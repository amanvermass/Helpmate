"use client";

import Header from "@/components/common/Header";
import PromoModal from "@/components/home/PromoModal";
import Hero from "@/components/home/Hero";
import PricingCalculator from "@/components/home/PricingCalculator";
import Categories from "@/components/home/Categories";
import Trending from "@/components/home/Trending";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import Reviews from "@/components/home/Reviews";
import FaqSection from "@/components/home/FaqSection";
import Footer from "@/components/common/Footer";
import ServiceAreas from "@/components/home/ServiceAreas";
import CtaBanner from "@/components/home/CtaBanner";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

export default function Home() {
  const router = useRouter();
  const { addToCart, clearCart } = useStore();

  const handleBookFromCalculator = (data: {
    id: string;
    name: string;
    price: number;
    category: string;
    duration: number;
  }) => {
    clearCart();
    addToCart(data);
    router.push("/booking");
  };

  return (
    <>
      <PromoModal />
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <Hero />

        {/* Categories Grid */}
        <Categories />

        {/* Trending Packages */}
        <Trending />

        {/* Dynamic Pricing Calculator Widget */}
        <PricingCalculator onBook={handleBookFromCalculator} />

        {/* Vetting Vow (Why Choose Us) */}
        <WhyChooseUs />

        {/* Where We Serve (Varanasi active zones & sub-areas) */}
        <ServiceAreas />

        {/* Step Guide (How it works) */}
        <HowItWorks />

        {/* Reviews marquee */}
        <Reviews />

        {/* CTA Download Banner */}
        <CtaBanner />

        {/* FAQs Section */}
        <FaqSection />
      </main>

      <Footer />
    </>
  );
}
